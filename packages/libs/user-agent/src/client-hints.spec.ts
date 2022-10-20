import { parseClientHintsHeaders } from './client-hints';

describe('low entropy headers only', () => {
  it('desktop chrome', () => {
    expect(
      parseClientHintsHeaders({
        'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      })
    ).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "106",
          "name": "google chrome",
          "version": "106",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": undefined,
          "type": "desktop",
          "vendor": undefined,
        },
        "engine": {
          "name": "chromium",
          "version": "106",
        },
        "mobileOS": undefined,
        "os": {
          "name": "Windows",
          "version": undefined,
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile chrome', () => {
    expect(
      parseClientHintsHeaders({
        'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
      })
    ).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "106",
          "name": "google chrome",
          "version": "106",
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
          "name": "chromium",
          "version": "106",
        },
        "mobileOS": "android",
        "os": {
          "name": "Android",
          "version": undefined,
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('desktop vivaldi', () => {
    expect(
      parseClientHintsHeaders({
        'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      })
    ).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": undefined,
          "name": "chromium",
          "version": "104",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": undefined,
          "type": "desktop",
          "vendor": undefined,
        },
        "engine": {
          "name": "chromium",
          "version": "104",
        },
        "mobileOS": undefined,
        "os": {
          "name": "Windows",
          "version": undefined,
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile vivaldi', () => {
    expect(
      parseClientHintsHeaders({
        'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
      })
    ).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": undefined,
          "name": "chromium",
          "version": "104",
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
          "name": "chromium",
          "version": "104",
        },
        "mobileOS": "android",
        "os": {
          "name": "Android",
          "version": undefined,
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('desktop edge', () => {
    expect(
      parseClientHintsHeaders({
        'sec-ch-ua': '"Microsoft Edge";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      })
    ).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "105",
          "name": "microsoft edge",
          "version": "105",
        },
        "cpu": {
          "architecture": undefined,
        },
        "device": {
          "model": undefined,
          "type": "desktop",
          "vendor": undefined,
        },
        "engine": {
          "name": "chromium",
          "version": "105",
        },
        "mobileOS": undefined,
        "os": {
          "name": "Windows",
          "version": undefined,
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile edge', () => {
    expect(
      parseClientHintsHeaders({
        'sec-ch-ua': '"Microsoft Edge";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
      })
    ).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "105",
          "name": "microsoft edge",
          "version": "105",
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
          "name": "chromium",
          "version": "105",
        },
        "mobileOS": "android",
        "os": {
          "name": "Android",
          "version": undefined,
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });
});
