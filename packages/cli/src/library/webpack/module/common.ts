import type Config from 'webpack-chain';
import webpack from 'webpack';
import path from 'path';
import externals from './externals';
import common from '../common/main';
import RuntimePathPlugin from '../plugins/RuntimePathPlugin';

import type { ConfigManager } from '../../../config/configManager';
import type { ModuleConfigEntry } from '../../../typings/configEntry/module';

import ts from '../blocks/ts';
import js from '../blocks/js';
import css from '../blocks/css';
import nodeClient from '../blocks/nodeClient';
import { configToEnv } from '../blocks/configToEnv';

export default (configManager: ConfigManager<ModuleConfigEntry>) => (config: Config) => {
  const { name, version, root } = configManager;

  const cssLocalIdentName =
    configManager.env === 'production'
      ? `${name}__[minicss]`
      : `${name}__[name]__[local]_[hash:base64:5]`;
  const publicPath = `(typeof spm === "object" && spm["${name}"]) + "/${name}/${version}/"`;

  config.entry(name).add(path.resolve(configManager.rootDir, `${root}/entry`));

  config.externals(externals);

  config.batch(nodeClient(configManager));

  config.batch(common(configManager));

  config.batch(configToEnv(configManager));

  config.plugin('limit-chunk').use(webpack.optimize.LimitChunkCountPlugin, [
    {
      maxChunks: 1,
    },
  ]);

  config.plugin('runtime-path').use(RuntimePathPlugin, [
    {
      publicPath,
    },
  ]);

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.MODULE': true,
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
};
