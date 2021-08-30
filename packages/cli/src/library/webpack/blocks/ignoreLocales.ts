import type Config from 'webpack-chain';
import webpack from 'webpack';

export default () => (config: Config) => {
  config
    .plugin('moment-locale-replace')
    .use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /en-gb|ru/]);

  // Плагин ломает сборки, где есть импорты локалей из общего index файла, например `import { ru } from 'date-fns/locale'`
  // @todo убедиться, что есть проблема лишних локалей, и найти возможность вырезать их, не ломая сборку
  // config.plugin('ignore-date-fns-locales').use(webpack.IgnorePlugin, [
  //   {
  //     checkResource(resource, context) {
  //       return context.match(/date-fns(?:\/esm)?\/locale$/);
  //     },
  //   },
  // ]);
};
