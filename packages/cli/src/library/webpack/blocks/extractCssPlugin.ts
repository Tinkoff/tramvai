import type Config from 'webpack-chain';
import ExtractCssPlugin from 'mini-css-extract-plugin';
import type { ConfigManager } from '../../../config/configManager';

interface Options {
  filename?: string;
  chunkFilename?: string;
}

export const extractCssPluginFactory = (configManager: ConfigManager, options: Options = {}) => (
  config: Config
) => {
  const { filename = '[name].css', chunkFilename = '[name].chunk.css' } = options;

  const pluginOptions = {
    filename,
    chunkFilename,
    ignoreOrder: true,
    experimentalUseImportModule: !!configManager.experiments.minicss?.useImportModule,
  };

  if (filename === null) {
    delete pluginOptions.filename;
  }
  if (chunkFilename === null) {
    delete pluginOptions.chunkFilename;
  }

  config.plugin('extract-css').use(ExtractCssPlugin, [pluginOptions]);
};
