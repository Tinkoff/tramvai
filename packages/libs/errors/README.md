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

## Action

### ConditionFailError

Some of the conditions check were failed

## Execution

### ExecutionError

Execution was failed due to error in execution callback

### ExecutionAbortError

Execution was aborted due to AbortSignal abortion

### ExecutionTimeoutError

Execution was aborted due to exceeding timeout execution time
