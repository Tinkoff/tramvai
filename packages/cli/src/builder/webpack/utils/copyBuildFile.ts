import * as fs from 'fs-extra';
import path from 'path';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';

export function copyBuildFile({
  config,
  inputPath,
  fromType,
  fileName,
}: {
  config: ConfigManager<ApplicationConfigEntry>;
  fromType: 'client' | 'server';
  inputPath?: string;
  fileName: string;
}) {
  const inputPathBase =
    inputPath || (fromType === 'client' ? config.output.client : config.output.server);
  const outputPathBase = fromType === 'client' ? config.output.server : config.output.client;

  return fs.copy(
    path.resolve(config.rootDir, inputPathBase, fileName),
    path.resolve(config.rootDir, outputPathBase, fileName)
  );
}
