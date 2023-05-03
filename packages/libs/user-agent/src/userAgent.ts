import propOr from '@tinkoff/utils/object/propOr';
import compose from '@tinkoff/utils/function/compose';
import toLower from '@tinkoff/utils/string/toLower';

import { UAParser } from 'ua-parser-js';
import type { UserAgent } from './types';
import { isSameSiteNoneCompatible } from './isSameSiteNoneCompatible';
import { getBrowserEngine, getMobileOs } from './utils';

const toLowerName = compose(toLower, propOr('name', ''));

const uaParserExtensions = [
  // добавляем отдельные регекспы для ботов гугла и т.п.
  // это позволит для них получить отдельное имя браузера и обработать специальным образом
  // https://github.com/faisalman/ua-parser-js/issues/227

  // google, bing, msn
  [/((?:\S+)bot(?:-[imagevdo]{5})?)\/([\w.]+)/i],
  [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION, ['type', 'bot']],

  // google adsbot под видом обычного браузера
  [/[\s;(](adsbot[-\w]*?[\s;)])/i],
  [UAParser.BROWSER.NAME, [UAParser.BROWSER.VERSION, 'unknown'], ['type', 'bot']],

  // добавляем регекспы для браузеров которые пытаются казаться другими браузерами
  // например ua-parser-js Firefox Focus для ios считает как просто Firefox, что ломает проверки на версии

  // Firefox for iOS
  [/fxios\/([\w\\.-]+)/i],
  [[UAParser.BROWSER.NAME, 'Firefox Focus'], UAParser.BROWSER.VERSION],
];

export const parseUserAgentHeader = (userAgent: string): UserAgent => {
  const { ua, ...result } = new UAParser(userAgent, { browser: uaParserExtensions }).getResult();
  const { browser, os, engine } = result;

  const browserName = toLowerName(browser);
  const engineName = toLowerName(engine);
  const sameSiteNoneCompatible = isSameSiteNoneCompatible(result);

  if (browserName === 'opera mobi') {
    result.device.type = 'mobile';
  }

  return {
    ...result,
    mobileOS: getMobileOs(os.name),
    sameSiteNoneCompatible,
    browser: {
      ...browser,
      browserEngine: getBrowserEngine(browserName, engineName),
      name: browserName,
    },
  };
};
