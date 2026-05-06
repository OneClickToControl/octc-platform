#!/usr/bin/env ruby
# frozen_string_literal: true

# Resolves .octc/workspace-guardrails.yaml (or defaults), prints JSON for bash/jq,
# then runs optional_checks when present. Exit non-zero on policy violations.
#
# Usage: run from workspace repo root (caller checkout).
#   ruby /path/to/octc-platform/scripts/workspace-guardrails-verify.rb

require "date"
require "json"
require "yaml"

DEFAULT_MARKDOWN = %w[
  README.md AGENTS.md CLAUDE.md IDENTITY.md MEMORY.md SOUL.md USER.md TOOLS.md HEARTBEAT.md
].freeze

ALLOWED_SKIP = %w[HEARTBEAT.md USER.md TOOLS.md].freeze

ALLOWED_TOP = %w[schema_version meta exceptions optional_checks].freeze
ALLOWED_EXCEPTIONS = %w[skip_required_root_markdown].freeze
ALLOWED_OPTIONAL = %w[require_package_json_scripts expect_agent_templates_range].freeze

def err(msg)
  warn "octc-workspace-guardrails::error #{msg}"
end

def fail!(msg)
  err(msg)
  exit 1
end

def parse_triple(str)
  m = str.to_s.match(/(\d+)\.(\d+)\.(\d+)/)
  return nil unless m

  [m[1].to_i, m[2].to_i, m[3].to_i]
end

def cmp_triples(a, b)
  ax = (a + [0, 0, 0]).take(3)
  bx = (b + [0, 0, 0]).take(3)
  ax <=> bx
end

def gte_triple?(v, floor)
  cmp_triples(v, floor) >= 0
end

def lt_triple?(v, cap)
  cmp_triples(v, cap) < 0
end

# version_str: base semver from package.json (e.g. "0.3.1" extracted from "^0.3.1").
# range_str: policy from YAML: exact "0.1.0", "^0.1.0", or "~1.2.3"
def semver_satisfies?(version_str, range_str)
  v = parse_triple(version_str)
  return false unless v

  r = range_str.to_s.strip
  if (m = r.match(/^(\d+)\.(\d+)\.(\d+)$/))
    return cmp_triples(v, [m[1].to_i, m[2].to_i, m[3].to_i]).zero?
  end

  if (m = r.match(/^\^(\d+)\.(\d+)\.(\d+)$/))
    maj, min, pat = m[1].to_i, m[2].to_i, m[3].to_i
    return false unless gte_triple v, [maj, min, pat]

    upper =
      if maj > 0
        [maj + 1, 0, 0]
      elsif min > 0
        [0, min + 1, 0]
      else
        [0, 0, pat + 1]
      end
    return lt_triple?(v, upper)
  end

  if (m = r.match(/^~(\d+)\.(\d+)\.(\d+)$/))
    maj, min, pat = m[1].to_i, m[2].to_i, m[3].to_i
    return v[0] == maj && v[1] == min && gte_triple?(v, [maj, min, pat])
  end

  false
end

config_path = File.join(Dir.pwd, ".octc", "workspace-guardrails.yaml")
payload = {
  "required_root_markdown" => DEFAULT_MARKDOWN.dup,
  "optional_checks" => {}
}

if File.file?(config_path)
  raw = YAML.safe_load(
    File.read(config_path),
    permitted_classes: [Symbol, Date, Time],
    permitted_symbols: [],
    aliases: true
  )
  fail!("invalid YAML structure") unless raw.is_a?(Hash)

  raw.each_key do |k|
    fail!("unknown top-level key: #{k}") unless ALLOWED_TOP.include?(k.to_s)
  end

  ver = raw["schema_version"]
  fail!("unsupported schema_version #{ver.inspect} (only 1)") unless ver == 1

  meta = raw["meta"]
  meta = {} unless meta.is_a?(Hash)
  exceptions = raw["exceptions"]
  exceptions = {} unless exceptions.is_a?(Hash)
  optional = raw["optional_checks"]
  optional = {} unless optional.is_a?(Hash)

  exceptions.each_key do |k|
    fail!("unknown exceptions key: #{k}") unless ALLOWED_EXCEPTIONS.include?(k.to_s)
  end
  optional.each_key do |k|
    fail!("unknown optional_checks key: #{k}") unless ALLOWED_OPTIONAL.include?(k.to_s)
  end

  needs_meta = false
  skip_block = exceptions["skip_required_root_markdown"]
  if skip_block
    fail!("skip_required_root_markdown must be a mapping with 'files'") unless skip_block.is_a?(Hash)
    skip_files = skip_block["files"]
    if skip_files.is_a?(Array) && !skip_files.empty?
      needs_meta = true
      skip_files.each do |f|
        fail!("cannot skip #{f}: not in allowed exception set #{ALLOWED_SKIP.inspect}") unless ALLOWED_SKIP.include?(f.to_s)
      end
      payload["required_root_markdown"] = DEFAULT_MARKDOWN - skip_files.map(&:to_s)
    elsif skip_files.is_a?(Array)
      # empty: ok
    else
      fail!("skip_required_root_markdown.files must be an array")
    end
  end

  opt_scripts = optional["require_package_json_scripts"]
  if opt_scripts.is_a?(Array) && !opt_scripts.empty?
    needs_meta = true
    opt_scripts.each { |s| fail!("script name must be string") unless s.is_a?(String) && !s.strip.empty? }
    payload["optional_checks"]["require_package_json_scripts"] = opt_scripts
  elsif opt_scripts.is_a?(Array)
    # empty
  elsif !optional["require_package_json_scripts"].nil?
    fail!("require_package_json_scripts must be an array")
  end

  range = optional["expect_agent_templates_range"]
  if range && !range.to_s.strip.empty?
    needs_meta = true
    payload["optional_checks"]["expect_agent_templates_range"] = range.to_s.strip
  end

  if needs_meta
    fail!("meta.owner is required when exceptions or optional_checks have effect") if meta["owner"].to_s.strip.empty?
    fail!("meta.reason is required when exceptions or optional_checks have effect") if meta["reason"].to_s.strip.empty?
  end
end

out_file = File.join(Dir.pwd, ".workspace-guardrails.json")
File.write(out_file, JSON.pretty_generate(payload))

# --- optional checks (opt-in only) ---
opt = payload["optional_checks"]
pkg_path = File.join(Dir.pwd, "package.json")
if !opt.empty?
  fail!("optional_checks require root package.json") unless File.file?(pkg_path)

  pkg = JSON.parse(File.read(pkg_path))
  scripts = pkg["scripts"]
  dev = pkg["devDependencies"] || {}

  if (req = opt["require_package_json_scripts"]) && req.is_a?(Array)
    req.each do |name|
      fail!("package.json missing scripts.#{name} (optional_check)") unless scripts.is_a?(Hash) && scripts.key?(name)
    end
  end

  if (rng = opt["expect_agent_templates_range"])
    raw = dev["@1c2c/agent-templates"]
    fail!("package.json must declare devDependencies['@1c2c/agent-templates'] (optional_check)") if raw.nil? || raw.to_s.strip.empty?

    ver = raw.to_s[/(\d+\.\d+\.\d+)/, 1]
    fail!("could not parse semver from @1c2c/agent-templates #{raw.inspect} (optional_check)") unless ver

    fail!(
      "@1c2c/agent-templates lower bound #{ver} does not satisfy policy range #{rng} (optional_check)"
    ) unless semver_satisfies?(ver, rng)
  end
end

exit 0
