import propOr from '@tinkoff/utils/object/propOr';
import compose from '@tinkoff/utils/function/compose';
import toLower from '@tinkoff/utils/string/toLower';

import { UAParser } from 'ua-parser-js';
import type { UserAgent } from './types';
import { isSameSiteNoneCompatible } from './isSameSiteNoneCompatible';

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

export const parse = (userAgent: string): UserAgent => {
  const uaParser = new UAParser('', { browser: uaParserExtensions });
  const { ua, ...result } = uaParser.setUA(userAgent).getResult();
  const { browser, os, engine } = result;
  const browserName = toLowerName(browser);
  const engineName = toLowerName(engine);
  const sameSiteNoneCompatible = isSameSiteNoneCompatible(result);

  let mobileOS;

  if (browserName === 'opera mobi') {
    result.device.type = 'mobile';
  }

  switch (os.name) {
    case 'Windows Phone':
      mobileOS = 'winphone';
      break;
    case 'Android':
      mobileOS = 'android';
      break;
    case 'iOS':
      mobileOS = 'ios';
      break;
    case 'BlackBerry':
    case 'RIM Tablet OS':
      mobileOS = 'blackberry';
      break;
  }

  let browserEngine;

  switch (true) {
    case browserName === 'firefox':
      browserEngine = 'firefox';
      break;
    case browserName === 'safari':
      browserEngine = 'safari';
      break;
    case engineName === 'webkit' || engineName === 'blink':
      browserEngine = 'chrome';
      break;
    default:
      browserEngine = 'other';
  }

  return {
    ...result,
    mobileOS,
    sameSiteNoneCompatible,
    browser: {
      ...browser,
      browserEngine,
      name: browserName,
    },
  };
};
