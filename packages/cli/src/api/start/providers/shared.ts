import type { Provider } from '@tinkoff/dippy';
import { STRICT_ERROR_HANDLE } from '../tokens';
import { COMMAND_PARAMETERS_TOKEN } from '../../../di/tokens';
import type { Params } from '../index';

export const sharedProviders: readonly Provider[] = [
  {
    provide: STRICT_ERROR_HANDLE,
    useFactory: ({ parameters }: { parameters: Params }) => {
      return parameters.strictErrorHandle ?? true;
    },
    deps: {
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  },
] as const;
