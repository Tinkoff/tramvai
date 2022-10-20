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
    case browserName === 'safari':
      return 'safari';
    case engineName === 'webkit' || engineName === 'blink' || engineName === 'chromium':
      return 'chrome';
  }

  return 'other';
};
