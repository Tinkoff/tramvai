# Error handlers

Библиотека для логгирования глобальных ошибок и необработанных reject-ов промисов. Содерижит реализацию как для браузера так и для nodejs.

### Api

- `globalErrorHandler = (logger: Logger = console)` - инициализация логгирования глобальных ошибок
- `unhandledRejectionHandler = (logger: Logger = console)` - инициализация логгирования unhandled rejection promise

### Types

- `Logger`
```tsx
export interface Logger {
  error: Function;
}
```
