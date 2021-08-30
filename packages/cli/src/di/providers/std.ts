import type { Provider } from '@tinkoff/dippy';
import { STDOUT_TOKEN, STDERR_TOKEN, COMMAND_PARAMETERS_TOKEN } from '../tokens';

export const stdProviders: readonly Provider[] = [
  {
    provide: STDOUT_TOKEN,
    useFactory: ({ params }) => {
      return params.stdout ?? process.stdout;
    },
    deps: {
      params: COMMAND_PARAMETERS_TOKEN,
    },
  },
  {
    provide: STDERR_TOKEN,
    useFactory: ({ params }) => {
      return params.stderr ?? process.stderr;
    },
    deps: {
      params: COMMAND_PARAMETERS_TOKEN,
    },
  },
] as const;
