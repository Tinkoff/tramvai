import path from 'path';
import semver from 'semver';

// `[/\\\\]` для матчинга обычных и обратных слэшей в разных ОС
const slash = '[/\\\\]';

// https://gist.github.com/developit/80a6926679ac33570f66ca8184a249d2#file-auto-babel-loader-js-L3
const MODULE_DIR =
  /(.*(?:[\/\\]node_modules|\.\.)[\/\\](?:@[^\/\\]+[\/\\])?[^\/\\]+)(?:[\/\\].*)?$/;

export const modernLibs = [
  // inner libs
  '@tinkoff',
  '@tinkoff-boxy',
  '@tramvai',
  '@tramvai-tinkoff',
  '@tinkoff-ui',
  '@platform-ui',
  '@tinkoff-fb',
  '@tinkoff-boxy',
  '@platform-legacy',
  `@storybook/addon-viewport`,
  '@pfa',
  '@tinkoff-codeceptjs',
  'dippy',
  'hook-runner',
  'meta-tags-generate',
  'htmlpagebuilder',
  'dynamic-components',
  'browser-timings',
  'tinkoff-offers',
  '@platform/utils',
  // external libs
  'proxy-polyfill',
  'react-diff-viewer',
  'lru-cache',
  'yallist',
  'abort-controller',
  'event-target-shim',
  'debug',
  'tslib',
  'nanoid',
  'punycode',
  'prom-client',
  'parse5',
  'async-mutex',
  'xlsx',
  'react-swipeable',
  '@react-hook',
  '@tui-react',
  '@tui-react-mobile',
  'tinkoff-push-web',
  'cacheable-lookup',
];

const regexStringFactory = ({ except }: { except?: boolean } = {}) =>
  `^.*${slash}node_modules${slash}(${except ? '?!' : ''}${modernLibs
    .map((lib) => lib.replace('/', slash))
    .join('|')})((?!${slash}node_modules${slash}).)*$`;

export const isModernLibStr = regexStringFactory();

export const isLegacyLibStr = regexStringFactory({ except: true });

export const isModernLib = new RegExp(isModernLibStr, 'i');

export const isLegacyLib = new RegExp(isLegacyLibStr, 'i');

const cache = Object.create(null);

/**
 * Самый надежный вариант поиска библиотек, которые необходимо транспилировать
 *
 * Кроме проверки библиотеки на наличие в фиксированном списке modern библиотек,
 * использует несколько других приемов:
 *
 * - из https://npm.im/webpack-plugin-modern-npm используется идея проверять на наличие полей "exports" и "modern"
 * - из https://github.com/SamVerschueren/babel-engine-plugin используется идея проверки поля "engines.node"
 *
 * Потенцильно, более надежный, но медленный вариант, это искать все modern библиотеки заранее,
 * через парсинг исходного кода, как в https://github.com/obahareth/are-you-es5.
 * @todo попробовать, если текущая реализация не оправдает себя.
 */
// eslint-disable-next-line max-statements
export const modernLibsFilter = (filePath: string): boolean => {
  const isNodeModule = /node_modules/.test(filePath);

  if (!isNodeModule) {
    return false;
  }

  const results = filePath.match(MODULE_DIR);
  const packagePath = results && results[1];
  const cacheKey = packagePath || filePath;

  if (cacheKey in cache) {
    return cache[cacheKey];
  }

  const isModerLibFromList = isModernLib.test(filePath);

  if (isModerLibFromList) {
    cache[cacheKey] = true;
    return cache[cacheKey];
  }

  const packageJsonPath: string = packagePath ? path.resolve(packagePath, 'package.json') : '';
  let packageJson: Record<string, any> = {};

  try {
    packageJson = require(packageJsonPath);
  } catch (e) {
    console.error(`${packageJsonPath} read failure`, e);
  }

  // https://gist.github.com/developit/80a6926679ac33570f66ca8184a249d2#file-auto-babel-loader-js-L10
  const packageJsonLooksLikeModern = !!(
    packageJson.exports ||
    packageJson.modern ||
    packageJson.type === 'module'
  );

  if (packageJsonLooksLikeModern) {
    cache[cacheKey] = true;
    return cache[cacheKey];
  }

  const nodeEngine = packageJson && packageJson.engines && packageJson.engines.node;

  if (!nodeEngine) {
    cache[cacheKey] = false;
    return cache[cacheKey];
  }

  if (!semver.validRange(nodeEngine)) {
    cache[cacheKey] = false;
    return cache[cacheKey];
  }

  // https://github.com/SamVerschueren/babel-engine-plugin/blob/master/lib/babel-module-template.js#L54
  if (semver.satisfies('0.10.0', nodeEngine)) {
    cache[cacheKey] = false;
    return cache[cacheKey];
  }

  cache[cacheKey] = true;
  return cache[cacheKey];
};
