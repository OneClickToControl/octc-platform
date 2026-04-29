# Sentry — Flutter template

Inicialización de Sentry para apps Flutter del portfolio.

## Archivos

- `sentry_init.dart` — wrapper `initOctcSentry` con scrubbing PII y sampling base.

## Uso

```dart
import 'sentry_init.dart';

void main() async {
  await initOctcSentry(() async {
    runApp(const MyApp());
  });
}
```

## Variables (compile-time)

- `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` pasados como `--dart-define` en build.

## Notas

- Replay no aplica en mobile.
- Para errores nativos (iOS/Android) seguir [docs Sentry](https://docs.sentry.io/platforms/flutter/) y subir symbol files con `sentry-cli` (`upload-dif`).
