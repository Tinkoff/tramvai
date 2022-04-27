import isString from '@tinkoff/utils/is/string';
import browserslist from 'browserslist';
import browserslistTinkoffConfig from '@tinkoff/browserslist-config';
import browserslistFileConfig from '@tramvai/cli/lib/external/browserslist-normalized-file-config';
import { parse } from './userAgent';
import type { UserAgent } from './types';
import { BROWSERS_LIST_MAP, CHROMIUM_BASED_BROWSERS } from './constants';

const deviceTypes: Record<string, string> = {
  mobile: 'mobile',
  tablet: 'mobile', // Считаем планшеты мобильными устройствами т. к. на них установлены мобильные браузеры
  desktop: 'desktop',
};

type BrowserMap = Record<string, Record<string, number>>;

const normalizedBrowserslist = (query: string[]) => {
  const resolved = browserslist(query, {
    // ставим в true, чтобы browserslist возвращал полный список для мобильных браузеров
    // т.к. по умолчанию, из-за того что `Can I use` хранит только последнюю версию мобильных браузеров
    // то и browserslist возвращал только самую последнюю версию для мобилок, а так он будет маппить
    // соответствие к десктопной версии
    mobileToDesktop: true,
  })
    // так как ie убрали из конфига @tinkoff/browserslist-config, то для того чтобы отсечь ie
    // добавляем фиктивную версию, чтобы вся функция вернула false для любой версии ie
    // причем если обычная версия ie была задана в кастомном конфиге или в конфиге переданном как аргумент
    // эта фиктивная версия ни на что не повлияет и будет использована кастомная конфигурация
    .concat(['ie 999']);

  const result: BrowserMap = {};

  for (let i = 0; i < resolved.length; i++) {
    const [name, version] = resolved[i].split(' ');

    if (BROWSERS_LIST_MAP[name]) {
      const { type: mapType, name: mapName } = BROWSERS_LIST_MAP[name];
      const mapVersion = parseFloat(version);

      if (result[mapName]) {
        if (!result[mapName][mapType] || result[mapName][mapType] > mapVersion) {
          result[mapName][mapType] = mapVersion;
        }
      } else {
        result[mapName] = {
          [mapType]: mapVersion,
        };
      }
    }
  }

  return result;
};

export const satisfies = (
  userAgent: UserAgent | string,
  browserslistConfig?: string[],
  { env = 'defaults' }: { env?: 'modern' | 'defaults' } = {}
): boolean | null => {
  const ua = isString(userAgent) ? parse(userAgent) : userAgent;
  const {
    engine: { name: engineName = '', version: engineVersion },
    device: { type = '' } = {},
  } = ua;
  let { browser: { name: browserName = '', version: browserVersion = '' } = {} } = ua;

  // Chromium based браузеры (yandex, samsung, opera, vivaldi, edge) указывают версию движка как `Chrome/*`.
  // А версия движка (blink) матчится в версию chromium один к одному
  // https://github.com/faisalman/ua-parser-js/pull/390
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Rendering_engine
  if (engineName.toLowerCase() === 'blink' && CHROMIUM_BASED_BROWSERS.indexOf(browserName) !== -1) {
    browserName = 'chrome';
    browserVersion = engineVersion || '';
  }

  // parseFloat - заберет мажорную + минорную версии, остальное отбросит
  const checkVersion = parseFloat(browserVersion);
  const deviceType = deviceTypes[type] || type || deviceTypes.desktop; // по умолчанию считаем устройство десктопом

  if (!browserName) {
    return null;
  }

  const targets =
    browserslistConfig ?? browserslistFileConfig[env] ?? browserslistTinkoffConfig[env];

  const browsers = normalizedBrowserslist(targets);

  let hasEntry = false;

  if (browserName in browsers) {
    const browserInfo = browsers[browserName];
    const browserInfoVersion = browserInfo.any ?? browserInfo[deviceType];

    hasEntry = !!browserInfoVersion;

    if (checkVersion >= browserInfoVersion) {
      return true;
    }
  }

  return hasEntry ? false : null; // null означает что не нашли соответствия браузеру в списке browserslist
};
