import type { PageResource, FETCH_WEBPACK_STATS_TOKEN } from '@tramvai/tokens-render';
import { ResourceSlot, ResourceType } from '@tramvai/tokens-render';
import { flushFiles } from './utils/flushFiles';

export const polyfillResources = async ({
  condition,
  modern,
  fetchWebpackStats,
}: {
  condition: string;
  modern: boolean;
  fetchWebpackStats: typeof FETCH_WEBPACK_STATS_TOKEN;
}) => {
  const webpackStats = await fetchWebpackStats({ modern });

  const { publicPath } = webpackStats;

  // получает файл полифилла из stats.json\stats.modern.json.
  // В зависимости от версии браузера будет использован полифилл из legacy или modern сборки,
  // т.к. полифиллы для них могут отличаться на основании преобразований `@babel/preset-env`
  const { scripts: polyfillScripts } = flushFiles(['polyfill'], webpackStats, {
    ignoreDependencies: true,
  });

  const genHref = (href) => `${publicPath}${href}`;

  const result: PageResource[] = [];

  polyfillScripts.forEach((script) => {
    const href = genHref(script);

    result.push({
      type: ResourceType.inlineScript,
      slot: ResourceSlot.HEAD_POLYFILLS,
      payload: `(function (){
  var con;
  try {
    con = ${condition};
  } catch (e) {
    con = true;
  }
  if (con) { document.write('<script defer="defer" charset="utf-8" data-critical="true" crossorigin="anonymous" src="${href}"><\\/script>')}
})()`,
    });
  });

  return result;
};
