import { parseUserAgentHeader } from './userAgent';

describe('modern browsers', () => {
  it('desktop chrome', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36';
    expect(parseUserAgentHeader(ua)).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "83",
          "name": "chrome",
          "version": "83.0.4103.61",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": undefined,
          "type": undefined,
          "vendor": undefined,
        },
        "engine": {
          "name": "Blink",
          "version": "83.0.4103.61",
        },
        "mobileOS": undefined,
        "os": {
          "name": "Mac OS",
          "version": "10.15.4",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile chrome', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 9) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.162 Mobile Safari/537.36 DuckDuckGo/5';
    expect(parseUserAgentHeader(ua)).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "4",
          "name": "android browser",
          "version": "4.0",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": undefined,
          "type": "mobile",
          "vendor": undefined,
        },
        "engine": {
          "name": "Blink",
          "version": "80.0.3987.162",
        },
        "mobileOS": "android",
        "os": {
          "name": "Android",
          "version": "9",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('safari', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15';
    expect(parseUserAgentHeader(ua)).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "safari",
          "major": "13",
          "name": "safari",
          "version": "13.1",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": undefined,
          "type": undefined,
          "vendor": undefined,
        },
        "engine": {
          "name": "WebKit",
          "version": "605.1.15",
        },
        "mobileOS": undefined,
        "os": {
          "name": "Mac OS",
          "version": "10.15.4",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });
});

describe('supported browsers', () => {
  it('desktop chrome', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36';
    expect(parseUserAgentHeader(ua)).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "81",
          "name": "chrome",
          "version": "81.0.4044.92",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": undefined,
          "type": undefined,
          "vendor": undefined,
        },
        "engine": {
          "name": "Blink",
          "version": "81.0.4044.92",
        },
        "mobileOS": undefined,
        "os": {
          "name": "Mac OS",
          "version": "10.14.5",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile chrome', () => {
    const ua =
      'Mozilla/5.0 (Linux; U; Android 5.1; zh-CN; MZ-M3s Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 MZBrowser/8.2.110-2020060117 UWS/2.15.0.4 Mobile Safari/537.360.44';
    expect(parseUserAgentHeader(ua)).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "4",
          "name": "android browser",
          "version": "4.0",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": "M3s",
          "type": "mobile",
          "vendor": "Meizu",
        },
        "engine": {
          "name": "Blink",
          "version": "57.0.2987.108",
        },
        "mobileOS": "android",
        "os": {
          "name": "Android",
          "version": "5.1",
        },
        "sameSiteNoneCompatible": false,
      }
    `);
  });

  it('desktop safari', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.22';
    expect(parseUserAgentHeader(ua)).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "safari",
          "major": "13",
          "name": "safari",
          "version": "13.0.5",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": undefined,
          "type": undefined,
          "vendor": undefined,
        },
        "engine": {
          "name": "WebKit",
          "version": "605.1.15",
        },
        "mobileOS": undefined,
        "os": {
          "name": "Mac OS",
          "version": "10.15.3",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile safari', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.7';
    expect(parseUserAgentHeader(ua)).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "13",
          "name": "mobile safari",
          "version": "13.1",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": "iPhone",
          "type": "mobile",
          "vendor": "Apple",
        },
        "engine": {
          "name": "WebKit",
          "version": "605.1.15",
        },
        "mobileOS": "ios",
        "os": {
          "name": "iOS",
          "version": "13.4",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });
});

describe('mobile devices', () => {
  it('winphone', () => {
    const ua =
      'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; Lumia 535 Dual SIM) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Mobile Safari/537.36 Edge/14.14393';
    expect(parseUserAgentHeader(ua)).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "other",
          "major": "14",
          "name": "edge",
          "version": "14.14393",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": "Lumia 535 Dual SIM",
          "type": "mobile",
          "vendor": "Microsoft",
        },
        "engine": {
          "name": "EdgeHTML",
          "version": "14.14393",
        },
        "mobileOS": "winphone",
        "os": {
          "name": "Windows Phone",
          "version": "10.0",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });
});
