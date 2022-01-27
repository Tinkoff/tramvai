import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { CONFIG_MANAGER_TOKEN } from '../../../../../di/tokens';
import { CLOSE_HANDLER_TOKEN } from '../../../tokens';
import { copyStatsJsonFileToServerDirectory } from '../../../utils/copyStatsJsonFile';

export const buildApplicationServerProviders: Provider[] = [
  provide({
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ configManager }) => {
      return async function copyStatsFiles() {
        return copyStatsJsonFileToServerDirectory(configManager);
      };
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
];
