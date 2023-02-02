import { resolve, join } from 'path';
import PQueue from 'promise-queue';
import { outputFile } from 'fs-extra';
import { request } from './request';
import type { Context } from '../../models/context';
import type { ConfigManager } from '../../config/configManager';
import type { ApplicationConfigEntry } from '../../typings/configEntry/application';

const MAX_CONCURRENT = 10;
const DYNAMIC_PAGE_REGEX = /\/:.+\//g;

export const generateStatic = async (
  context: Context,
  configManager: ConfigManager<ApplicationConfigEntry>,
  paths: string[]
) => {
  const q = new PQueue(MAX_CONCURRENT);
  const promises = [];

  const { host, port, rootDir, output } = configManager;
  const staticPath = resolve(rootDir, output.static);
  const serverPath = `http://${host}:${port}`;

  for (const path of paths) {
    promises.push(
      q.add(async () => {
        // @todo need something similar to https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
        if (DYNAMIC_PAGE_REGEX.test(path)) {
          context.logger.event({
            type: 'warning',
            event: 'COMMAND:STATIC:DYNAMIC_PAGE_UNSUPPORTED',
            message: `path: ${path}, message: export dynamic pages to HTML is not supported`,
          });
          return;
        }

        try {
          context.logger.event({
            type: 'debug',
            event: 'COMMAND:STATIC:PAGE_FETCH',
            message: `path: ${path}, message: start fetching page`,
          });

          const html = await request({ url: `${serverPath}${path}` });

          await outputFile(join(staticPath, path, 'index.html'), html);

          context.logger.event({
            type: 'debug',
            event: 'COMMAND:STATIC:PAGE_CREATED',
            message: `path: ${path}, message: page created successfully`,
          });
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
