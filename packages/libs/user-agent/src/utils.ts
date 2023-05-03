export const getMobileOs = (osName?: string): string | undefined => {
  switch (osName) {
    case 'Windows Phone':
      return 'winphone';
    case 'Android':
      return 'android';
    case 'iOS':
      return 'ios';
    case 'BlackBerry':
    case 'RIM Tablet OS':
      return 'blackberry';
  }
};

export const getBrowserEngine = (browserName?: string, engineName?: string): string => {
  switch (true) {
    case browserName === 'firefox':
      return 'firefox';
    // If an `engineName` is webkit, and it's not Safari,
    // then define the `browserName` as `safari`, because all browsers
    // on iOS use webkit. Also, we are not handling mobile Safari separately,
    // as it webkit too. See https://en.wikipedia.org/wiki/WebKit
    case browserName === 'safari' || engineName === 'webkit':
      return 'safari';
    // We aren't using something like `browserName === 'chrome'` here,
    // because there are a lot of browsers based on chromium.
    case engineName === 'blink' || engineName === 'chromium':
      return 'chrome';
  }

  return 'other';
};
