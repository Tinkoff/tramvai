import { createToken } from '@tinkoff/dippy';

export interface ExecutionContextValues {
  [key: string]: any | undefined;
}

export interface ExecutionContext {
  name: string;
  abortSignal: AbortSignal;
  values: ExecutionContextValues;
}

export interface ExecutionContextOptions {
  name: string;
  values?: ExecutionContextValues;
}

export interface ExecutionContextManager {
  withContext<T>(
    parentContext: ExecutionContext,
    nameOrOptions: string | ExecutionContextOptions,
    cb: (context: ExecutionContext, abortController: AbortController) => Promise<T>
  ): Promise<T>;
}

export const EXECUTION_CONTEXT_MANAGER_TOKEN = createToken<ExecutionContextManager>(
  'common ExecutionContextManager'
);

export const ROOT_EXECUTION_CONTEXT_TOKEN = createToken<ExecutionContext | null>(
  'common rootExecutionContext'
);

export const COMMAND_LINE_EXECUTION_CONTEXT_TOKEN = createToken<() => ExecutionContext | null>(
  'common commandLineExecutionContext'
);
