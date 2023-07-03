import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';
import { addTranspilerLoader, getTranspilerConfig } from '../utils/transpiler';

export const serverInline = (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  // создаём клиентский конфиг и отключаем modern режим
  const clientConfigManager = configManager.withSettings({ buildType: 'client', modern: false });

  const addInlineHandler = (type: string) => {
    config.module
      .rule(type)
      .oneOf('inline')
      .before('project')
      .test(new RegExp(`\\.inline(\\.es)?\\.${type}$`))
      .use('transpiler')
      .batch(
        addTranspilerLoader(
          clientConfigManager,
          getTranspilerConfig(clientConfigManager, { typescript: type === 'ts' })
        )
      );
  };

  addInlineHandler('js');
  addInlineHandler('ts');
};
