// https://storybook.js.org/docs/react/addons/writing-presets

import type { Configuration } from 'webpack';
import Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import type { TransformOptions } from '@babel/core';
import { buildConfigManager } from './tramvai/buildConfigManager';
import { babelConfigFactory } from './babel/babelConfigFactory';
import { addEnvVariables } from './webpack/addEnvVariables';
import { addFilesRules } from './webpack/addFilesRules';
import { addStylesRules } from './webpack/addStylesRules';
import type { TramvaiCoreDecoratorParameters } from './decorators/tramvaiCoreDecorator';
import type { RouterDecoratorParameters } from './decorators/routerDecorator';
import type { ReactQueryDecoratorParameters } from './decorators/reactQueryDecorator';
import type { ActionsDecoratorParameters } from './decorators/actionsDecorator';

export type TramvaiStoriesParameters = TramvaiCoreDecoratorParameters &
  RouterDecoratorParameters &
  ReactQueryDecoratorParameters &
  ActionsDecoratorParameters;

export const config = (entry: string[]): string[] => {
  return [...entry, require.resolve('./preview')];
};

export const babel = (cfg: TransformOptions): TransformOptions => {
  return babelConfigFactory();
};

export const webpackFinal = async (baseConfig: Configuration, options): Promise<Configuration> => {
  const configManager = buildConfigManager(options);
  const webpackConfig = new Config();

  addEnvVariables({ webpackConfig, configManager, options });
  addFilesRules({ baseConfig, webpackConfig, configManager });
  addStylesRules({ baseConfig, webpackConfig, configManager });

  return merge(baseConfig, webpackConfig.toConfig());
};
