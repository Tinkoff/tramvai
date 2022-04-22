import type UAParser from 'ua-parser-js';

const processUserAgentAttributeName = (attributeName = '') => attributeName.toLowerCase();

const splitUserAgentAttributeVersion = (attributeVersion = '-1.-1.-1') =>
  attributeVersion.split('.').map(Number);

// https://www.chromium.org/updates/same-site/incompatible-clients
export const isSameSiteNoneCompatible = (userAgent: Omit<UAParser.IResult, 'ua'>) => {
  // На случай неполных данных из ua-parser-js
  try {
    const browserName = processUserAgentAttributeName(userAgent.browser.name);
    const [browserMajor, browserMinor, browserBuild] = splitUserAgentAttributeVersion(
      userAgent.browser.version
    );
    const osName = processUserAgentAttributeName(userAgent.os.name);
    const [osMajor, osMinor] = splitUserAgentAttributeVersion(userAgent.os.version);
    const engineName = processUserAgentAttributeName(userAgent.engine.name);
    const [engineMajor] = splitUserAgentAttributeVersion(userAgent.engine.version);

    if (osName === 'ios') {
      // На iOS 12 все браузеры не совместимы с samesite=none
      // При этом полагается, что если на iOS!=12 - любые браузеры совместимы с samesite=none, включая UCBrowser<12.13.2 и 51<=Chrome<=66 (WebKit)
      return osMajor !== 12;
    }

    // Встроенный браузер Mac OS парсится как Webkit
    if (browserName === 'safari' || browserName === 'webkit') {
      return !(osName === 'mac os' && osMajor === 10 && osMinor === 14);
    }

    if (browserName === 'ucbrowser') {
      const [major, minor, build] = [12, 13, 2];

      if (browserMajor !== major) {
        return browserMajor > major;
      }

      if (browserMinor !== minor) {
        return browserMinor > minor;
      }

      return browserBuild >= build;
    }

    if (browserName === 'chrome' || browserName === 'chromium') {
      return browserMajor < 51 || browserMajor > 66;
    }

    if (engineName === 'blink') {
      return engineMajor < 51 || engineMajor > 66;
    }

    return true;
  } catch {
    return true;
  }
};
