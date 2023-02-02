import type Config from 'webpack-chain';
import type { PluginOptions } from 'mini-css-extract-plugin';
import ExtractCssPlugin from 'mini-css-extract-plugin';
import type { ConfigManager } from '../../../config/configManager';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

interface Options {
  filename?: string | null;
  chunkFilename?: string | null;
}

export const extractCssPluginFactory =
  (configManager: ConfigManager<CliConfigEntry>, options: Options = {}) =>
  (config: Config) => {
    const { filename = '[name].css', chunkFilename = '[name].chunk.css' } = options;

    const pluginOptions: PluginOptions = {
      ignoreOrder: true,
      experimentalUseImportModule: !!configManager.experiments.minicss?.useImportModule,
    };

    if (filename !== null) {
      pluginOptions.filename = filename;
    }

    if (chunkFilename !== null) {
      pluginOptions.chunkFilename = chunkFilename;
    }

    config.plugin('extract-css').use(ExtractCssPlugin, [pluginOptions]);
  };
