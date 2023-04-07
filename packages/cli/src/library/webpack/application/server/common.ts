import path from 'path';
import webpack from 'webpack';
import type Config from 'webpack-chain';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

import common from '../../common/main';
import files from '../../blocks/filesServer';
import ts from '../../blocks/ts';
import js from '../../blocks/js';
import css from '../../blocks/css';
import apiResolve from '../../blocks/apiResolve';
import { pagesResolve } from '../../blocks/pagesResolve';
import { serverInline } from '../../blocks/serverInline';
import { browserslistConfigResolve } from '../../blocks/browserslistConfig';
import { configToEnv } from '../../blocks/configToEnv';
import { commonApplication } from '../common';
import { extractCssPluginFactory } from '../../blocks/extractCssPlugin';

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager<ApplicationConfigEntry>) => (config: Config) => {
  const { output, fileSystemPages } = configManager;

  config
    .name('server')
    .target('node')
    .entry('server')
    .add(path.resolve(configManager.rootDir, `${configManager.root}/index`));

  config
    .batch(common(configManager))
    .batch(commonApplication(configManager))
    .batch(configToEnv(configManager))
    .batch(files(configManager))
    .batch(apiResolve(configManager))
    .batch(js(configManager))
    .batch(ts(configManager))
    .batch(serverInline(configManager))
    .batch(browserslistConfigResolve(configManager))
    .batch(
      extractCssPluginFactory(configManager, {
        filename: 'server.[contenthash].css',
        chunkFilename: null,
      })
    )
    .batch(css(configManager))
    .when(fileSystemPages.enabled, (cfg) => cfg.batch(pagesResolve(configManager)));

  config.output
    .path(configManager.buildPath)
    .publicPath(path.posix.join('/', output.server))
    .filename('server.js')
    .libraryTarget('commonjs2');

  config.resolve.extensions.merge(['.node']);
  config.node.set('__dirname', false);

  config.module
    .rule('less')
    .test(/\.less$/)
    .use('ignore')
    .loader('null-loader');

  config
    .plugin('define')
    .tap((args) => [
      {
        ...args[0],
        'global.GENTLY': false,
        'process.env.MODULE': true, // mimic module to bundle svg's inside js and prevent errors from iconLoader
        'process.env.BROWSER': false,
        'process.env.SERVER': true,
      },
    ])
    .end()
    .plugin('limit-chunk')
    .use(webpack.optimize.LimitChunkCountPlugin, [
      {
        maxChunks: 1,
      },
    ]);

  return config;
};
