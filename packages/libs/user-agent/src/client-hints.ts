import type { Browser, Engine, UserAgent } from './types';
import { getBrowserEngine, getMobileOs } from './utils';

const KNOWN_VENDORS = new Set(['Opera', 'Google Chrome', 'Microsoft Edge', 'Firefox', 'Safari']);

const KNOWN_ENGINES = new Set(['Chromium']);

const parseQuotedString = (str: string | undefined): string | undefined => {
  if (!str) {
    return str;
  }

  try {
    return JSON.parse(str)?.trim();
  } catch (err) {
    return str;
  }
};

const parseBrowser = (brandsList: string): { browser: Browser; engine: Engine } => {
  const browser: Browser = {
    name: undefined,
    version: undefined,
    major: undefined,
    browserEngine: '',
  };
  const engine: Engine = {
    name: undefined,
    version: undefined,
  };

  brandsList.split(',').forEach((entry) => {
    const [name, version] = entry.split(/;\s*v=/).map(parseQuotedString);

    if (name && KNOWN_VENDORS.has(name)) {
      browser.name = name.toLowerCase();
      browser.version = version;
      browser.major = version;
    }

    if (name && KNOWN_ENGINES.has(name)) {
      engine.name = name.toLowerCase();
      engine.version = version;
    }
  });

  if (!browser.name && engine.name) {
    browser.name = engine.name;
    browser.version = engine.version;
  }

  browser.browserEngine = getBrowserEngine(browser.name, engine.name);

  return { browser, engine };
};

/**
 *
 * @description
 *
 * Some of the data are available only when additional headers for client-hints were sent from server:
 * - full browser version (only major version is available by default)
 * - OS version
 * - CPU architecture
 * - device model
 *
 * To able to use data you should first provide header `Accept-CH` with the list of headers that client should send.
 *
 * @param headers
 * @returns
 */
export const parseClientHintsHeaders = (headers: Record<string, string | string[]>): UserAgent => {
  const { browser, engine } = parseBrowser(
    (headers['sec-ch-ua-full-version-list'] as string) || (headers['sec-ch-ua'] as string)
  );
  const osName = parseQuotedString(headers['sec-ch-ua-platform'] as string);

  const mobileOS = getMobileOs(osName);

  return {
    browser,
    engine,
    os: {
      name: osName,
      version: parseQuotedString(headers['sec-ch-ua-platform-version'] as string),
    },
    cpu: {
      architecture: parseQuotedString(headers['sec-ch-ua-arch'] as string),
    },
    mobileOS,
    device: {
      model: parseQuotedString(headers['sec-ch-ua-model'] as string),
      type: headers['sec-ch-ua-mobile'] === '?1' ? 'mobile' : 'desktop',
      vendor: undefined,
    },
    // basically all of the browsers with client-hints support
    // also compatible with SameSite=None
    sameSiteNoneCompatible: true,
  };
};
