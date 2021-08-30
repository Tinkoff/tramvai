import Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import js from './js';
import ts from './ts';

export const serverInline = (configManager: ConfigManager) => (config: Config) => {
  // создаём клиентский конфиг и отключаем modern режим
  const clientConfigManager = configManager.withSettings({ buildType: 'client', modern: false });

  const clientConfig = new Config().batch(js(clientConfigManager)).batch(ts(clientConfigManager));

  const addInlineHandler = (type: string, extension: string) => {
    config.module
      .rule(type)
      .oneOf('inline')
      .before('default')
      .test(new RegExp(`\\.inline(\\.es)?\\.${extension}$`))
      .uses.merge(clientConfig.module.rule(type).oneOfs.get('default').uses.entries());
  };

  addInlineHandler('js:project', 'js');
  addInlineHandler('js:node_modules', 'js');
  addInlineHandler('ts:project', 'ts');
};
