# Errors

Common errors classes

## Common

### SilentError

Marks error as silent e.g. throwing such errors should not produce any error logs.

## HTTP

### HttpError

#### RedirectFoundError

Current response should be redirected

#### NotFoundError

Current Page was not found in the app

## Execution

### ExecutionError

Execution was failed due to error in execution callback

### ExecutionAbortError

Execution was aborted due to AbortSignal abortion
