# Sentry — Flutter template

Sentry initialization for portfolio Flutter apps.

## Files

- `sentry_init.dart` — `initOctcSentry` wrapper with PII scrubbing and baseline sampling.

## Usage

```dart
import 'sentry_init.dart';

void main() async {
  await initOctcSentry(() async {
    runApp(const MyApp());
  });
}
```

## Variables (compile-time)

- `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` passed as `--dart-define` at build time.

## Notes

- Replay does not apply on mobile.
- For native errors (iOS/Android) follow [Sentry docs](https://docs.sentry.io/platforms/flutter/) and upload symbols with `sentry-cli` (`upload-dif`).
