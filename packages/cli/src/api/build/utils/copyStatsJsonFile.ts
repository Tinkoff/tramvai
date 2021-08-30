import fs from 'fs';
import path from 'path';
import { copyBuildFile } from './copyBuildFile';
import type { ConfigManager } from '../../../config/configManager';

export const copyStatsJsonFileToServerDirectory = async (clientConfigManager: ConfigManager) => {
  const STATS_JSON_FILE_NAME = 'stats.json';
  const STATS_JSON_FILE_NAME_MODERN = 'stats.modern.json';

  const statsJsonFileDirectoryPath = clientConfigManager.build.options.outputClient;

  const statsJsonFilePath = path.resolve(
    clientConfigManager.rootDir,
    statsJsonFileDirectoryPath,
    STATS_JSON_FILE_NAME
  );

  const statsJsonFilePathModern = path.resolve(
    clientConfigManager.rootDir,
    statsJsonFileDirectoryPath,
    STATS_JSON_FILE_NAME_MODERN
  );

  const isExistStatsJsonFilePath = fs.existsSync(statsJsonFilePath);
  const isExistStatsJsonFilePathModern = fs.existsSync(statsJsonFilePathModern);

  // TODO: Необходимо вынести все локальные константы обозначающие тип сборки
  // ('client' | 'server' | 'all') в отдельный enum и переиспользовать по всему коду @tramvai/cli
  const FROM_BUILD_DIRECTORY_TYPE = 'client';

  if (isExistStatsJsonFilePath) {
    // TODO: Если в дальнейшем не предполагается какая-либо функциональность связанная с подобным копированием файлов,
    // то возможно есть смысл перенести всю логику из copyBuildFile непосредственно в утилиту copyStatsJsonFileToServerDirectory
    await copyBuildFile({
      config: clientConfigManager,
      inputPath: statsJsonFileDirectoryPath,
      fromType: FROM_BUILD_DIRECTORY_TYPE,
      fileName: STATS_JSON_FILE_NAME,
    });
  }

  if (isExistStatsJsonFilePathModern && clientConfigManager.modern) {
    await copyBuildFile({
      config: clientConfigManager,
      inputPath: statsJsonFileDirectoryPath,
      fromType: FROM_BUILD_DIRECTORY_TYPE,
      fileName: STATS_JSON_FILE_NAME_MODERN,
    });
  }
};
