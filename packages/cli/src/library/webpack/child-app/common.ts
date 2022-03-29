import type Config from 'webpack-chain';
import webpack, { container } from 'webpack';
import path from 'path';
import common from '../common/main';

import type { ConfigManager } from '../../../config/configManager';
import type { ModuleConfigEntry } from '../../../typings/configEntry/module';

import ts from '../blocks/ts';
import js from '../blocks/js';
import css from '../blocks/css';
import nodeClient from '../blocks/nodeClient';
import type { ModuleFederationPluginOptions } from '../types/webpack';
import { getSharedModules } from './moduleFederationShared';
import { configToEnv } from '../blocks/configToEnv';

export default (configManager: ConfigManager<ModuleConfigEntry>) => (config: Config) => {
  const { name, root } = configManager;

  const cssLocalIdentName =
    configManager.env === 'production'
      ? `${name}__[minicss]`
      : `${name}__[name]__[local]_[hash:base64:5]`;
  const entry = path.resolve(configManager.rootDir, `${root}`);

  // use empty module instead of original one as I haven't figured out how to prevent webpack from initializing entry module on loading
  // it should be initialized only as remote in ModuleFederation and not as standalone module
  config.entry(name).add(path.resolve(__dirname, 'fakeModule.js'));

  config.batch(nodeClient(configManager));

  config.batch(common(configManager));

  config.batch(configToEnv(configManager));

  config.plugin('limit-chunk').use(webpack.optimize.LimitChunkCountPlugin, [
    {
      maxChunks: 1,
    },
  ]);

  config
    .batch(js(configManager))
    .batch(ts(configManager))
    .batch(
      css(configManager, {
        localIdentName: cssLocalIdentName,
      })
    );

  config.plugin('module-federation').use(container.ModuleFederationPlugin, [
    {
      name,
      library:
        configManager.buildType === 'server'
          ? {
              type: 'commonjs2',
            }
          : {
              name: 'window["child-app__" + document.currentScript.src]',
              type: 'assign',
            },
      exposes: {
        entry,
      },
      shared: getSharedModules(configManager),
    } as ModuleFederationPluginOptions,
  ]);
};
