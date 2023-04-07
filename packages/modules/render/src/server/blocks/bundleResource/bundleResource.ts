import has from '@tinkoff/utils/object/has';
import last from '@tinkoff/utils/array/last';
import type { ChunkExtractor } from '@loadable/server';
import type { PageResource, FETCH_WEBPACK_STATS_TOKEN } from '@tramvai/tokens-render';
import { ResourceType, ResourceSlot } from '@tramvai/tokens-render';
import { isFileSystemPageComponent, fileSystemPageToWebpackChunkName } from '@tramvai/experiments';
import { PRELOAD_JS } from '../../constants/performance';
import { flushFiles } from '../utils/flushFiles';

export const bundleResource = async ({
  bundle,
  modern,
  extractor,
  pageComponent,
  fetchWebpackStats,
}: {
  bundle: string;
  modern: boolean;
  extractor: ChunkExtractor;
  pageComponent?: string;
  fetchWebpackStats: typeof FETCH_WEBPACK_STATS_TOKEN;
}) => {
  // for file-system pages preload page chunk against bundle chunk
  const chunkNameFromBundle = isFileSystemPageComponent(pageComponent)
    ? fileSystemPageToWebpackChunkName(pageComponent)
    : last(bundle.split('/'));

  const webpackStats = await fetchWebpackStats({ modern });
  const { publicPath, assetsByChunkName } = webpackStats;

  const bundles: string[] = has('common-chunk', assetsByChunkName)
    ? ['common-chunk', chunkNameFromBundle]
    : [chunkNameFromBundle];
  const lazyChunks = extractor.getMainAssets().map((entry) => entry.chunk);

  const { scripts: baseScripts } = flushFiles(['vendor'], webpackStats, {
    ignoreDependencies: true,
  });
  const { scripts, styles } = flushFiles([...bundles, ...lazyChunks, 'platform'], webpackStats);

  const genHref = (href) => `${publicPath}${href}`;

  const result: PageResource[] = [];

  if (
    process.env.NODE_ENV === 'production' ||
    (process.env.ASSETS_PREFIX && process.env.ASSETS_PREFIX !== 'static')
  ) {
    result.push({
      type: ResourceType.inlineScript,
      slot: ResourceSlot.HEAD_CORE_SCRIPTS,
      payload: `window.ap = ${`"${process.env.ASSETS_PREFIX}"`};`,
    });
  }

  styles.map((style) =>
    result.push({
      type: ResourceType.style,
      slot: ResourceSlot.HEAD_CORE_STYLES,
      payload: genHref(style),
      attrs: {
        'data-critical': 'true',
        onload: `${PRELOAD_JS}()`,
      },
    })
  );
  baseScripts.map((script) =>
    result.push({
      type: ResourceType.script,
      slot: ResourceSlot.HEAD_CORE_SCRIPTS,
      payload: genHref(script),
      attrs: {
        'data-critical': 'true',
      },
    })
  );

  scripts.map((script) =>
    result.push({
      type: ResourceType.script,
      slot: ResourceSlot.HEAD_CORE_SCRIPTS,
      payload: genHref(script),
      attrs: {
        'data-critical': 'true',
      },
    })
  );

  return result;
};
