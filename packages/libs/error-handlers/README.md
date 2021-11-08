# Error handlers

Library for logging of global errors and unhandled promise rejections. May work in browsers and nodejs.

## Api

- `globalErrorHandler = (logger: Logger = console)` - init logging of global errors
- `unhandledRejectionHandler = (logger: Logger = console)` - init logging of unhandled rejection promise

### Parameters

- `Logger` - used for logging errors

  ```tsx
  export interface Logger {
    warn: Function;
    error: Function;
  }
  ```
