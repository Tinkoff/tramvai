import * as fs from 'fs-extra';
import path from 'path';
import type { ConfigManager } from '../../../config/configManager';

export function copyBuildFile({
  config,
  inputPath,
  fromType,
  fileName,
}: {
  config: ConfigManager;
  fromType: 'client' | 'server';
  inputPath?: string;
  fileName: string;
}) {
  const inputPathBase =
    inputPath ||
    (fromType === 'client' ? config.build.options.outputClient : config.build.options.outputServer);
  const outputPathBase =
    fromType === 'client' ? config.build.options.outputServer : config.build.options.outputClient;

  return fs.copy(
    path.resolve(config.rootDir, inputPathBase, fileName),
    path.resolve(config.rootDir, outputPathBase, fileName)
  );
}
