import path from 'path';
import {
  ConfigManager,
  ConfigManagerValidator,
  getTramvaiConfig,
  syncJsonFile,
} from '@tramvai/cli';

export const buildConfigManager = (options): ConfigManager => {
  const rootDir = options.tramvaiDir || path.resolve(process.cwd(), '..');
  const { content, isSuccessful } = getTramvaiConfig(rootDir);

  if (!isSuccessful) {
    throw Error(`tramvai.json not found inside ${rootDir} folder`);
  }

  const configManagerValidator = new ConfigManagerValidator({
    config: content,
    syncConfigFile: syncJsonFile,
  });

  const { projects } = content;
  const defaultProject = Object.keys(projects)[0];
  const configManager = new ConfigManager(
    configManagerValidator.getProject(options.tramvaiAppName || defaultProject),
    { rootDir, buildType: 'client', env: process.env.NODE_ENV as any }
  );

  return configManager;
};
