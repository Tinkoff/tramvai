import { resolve, join } from 'path';
import PQueue from 'promise-queue';
import { outputFile } from 'fs-extra';
import { request } from './request';
import type { Context } from '../../models/context';
import type { ConfigManager } from '../../config/configManager';
import type { ApplicationConfigEntry } from '../../typings/configEntry/application';

const MAX_CONCURRENT = 10;

export const generateStatic = async (
  context: Context,
  configManager: ConfigManager<ApplicationConfigEntry>,
  paths: string[]
) => {
  const q = new PQueue(MAX_CONCURRENT);
  const promises = [];

  const { host, port, rootDir, build } = configManager;
  const staticPath = resolve(rootDir, build.options.outputStatic);
  const serverPath = `http://${host}:${port}`;

  for (const path of paths) {
    promises.push(
      q.add(async () => {
        try {
          const html = await request({ url: `${serverPath}${path}` });

          await outputFile(join(staticPath, path, 'index.html'), html);
        } catch (e) {
          context.logger.event({
            type: 'error',
            event: 'COMMAND:STATIC:ERROR',
            message: `path: ${path}, message: ${e.message}`,
          });
        }
      })
    );
  }

  return Promise.all(promises);
};
