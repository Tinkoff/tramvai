import { resolve } from 'path';
import fs from 'fs';
import findCacheDir from 'find-cache-dir';
import type { Container } from '@tinkoff/dippy';
import { COMMAND_PARAMETERS_TOKEN, CONFIG_ROOT_DIR_TOKEN } from '../../../di/tokens';

export const clearCacheDirectory = async (di: Container) => {
  return fs.promises.rm(
    resolve(
      findCacheDir({
        // при задании директории надо учитывать, что директория может задаваться в опциях к самой команде или же быть значение по умолчанию из контейнера
        cwd:
          di.get(COMMAND_PARAMETERS_TOKEN).commandOptions.rootDir ?? di.get(CONFIG_ROOT_DIR_TOKEN),
        name: 'cli',
      }),
      '../'
    ),
    { recursive: true, force: true }
  );
};
