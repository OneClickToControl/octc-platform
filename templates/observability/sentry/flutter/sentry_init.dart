// octc-platform — Flutter Sentry init template
// Política: docs/observability/OBSERVABILITY.md

import 'package:flutter/foundation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

const _sensitiveKeys = <String>{
  'email',
  'phone',
  'name',
  'address',
  'id_document',
  'ssn',
  'credit_card',
  'auth',
  'authorization',
  'cookie',
  'session',
  'password',
};

Object? _scrub(Object? value) {
  if (value is Map) {
    return value.map((k, v) {
      final key = k.toString().toLowerCase();
      if (_sensitiveKeys.any((s) => key.contains(s))) {
        return MapEntry(k, '[redacted]');
      }
      return MapEntry(k, _scrub(v));
    });
  }
  if (value is List) {
    return value.map(_scrub).toList();
  }
  return value;
}

Future<void> initOctcSentry(Future<void> Function() runApp) async {
  await SentryFlutter.init(
    (options) {
      options.dsn = const String.fromEnvironment('SENTRY_DSN');
      options.environment = const String.fromEnvironment(
        'SENTRY_ENVIRONMENT',
        defaultValue: 'development',
      );
      options.release = const String.fromEnvironment('SENTRY_RELEASE');
      options.tracesSampleRate = 0.1;
      options.profilesSampleRate = 0.05;
      options.sendDefaultPii = false;
      options.beforeSend = (event, hint) async {
        return event.copyWith(
          extra: _scrub(event.extra) as Map<String, dynamic>?,
          contexts: event.contexts,
        );
      };
    },
    appRunner: runApp,
  );
}
