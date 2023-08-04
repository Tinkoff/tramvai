import { parseClientHintsHeaders, parseClientHintsUserAgentData } from './client-hints';

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

describe('low entropy UADataValues only', () => {
  it('desktop chrome', () => {
    const result = parseClientHintsUserAgentData({
      brands: [
        {
          brand: 'Not.A/Brand',
          version: '8',
        },
        {
          brand: 'Chromium',
          version: '114',
        },
        {
          brand: 'Google Chrome',
          version: '114',
        },
      ],
      mobile: false,
      platform: 'macOS',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "114",
          "name": "google chrome",
          "version": "114",
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
          "version": "114",
        },
        "mobileOS": undefined,
        "os": {
          "name": "macOS",
          "version": undefined,
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile chrome', () => {
    const result = parseClientHintsUserAgentData({
      brands: [
        {
          brand: 'Not.A/Brand',
          version: '8',
        },
        {
          brand: 'Chromium',
          version: '114',
        },
        {
          brand: 'Google Chrome',
          version: '114',
        },
      ],
      mobile: true,
      platform: 'Android',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "114",
          "name": "google chrome",
          "version": "114",
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
          "version": "114",
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
    const result = parseClientHintsUserAgentData({
      brands: [
        {
          brand: 'Not.A/Brand',
          version: '8',
        },
        {
          brand: 'Chromium',
          version: '114',
        },
        {
          brand: 'Microsoft Edge',
          version: '114',
        },
      ],
      mobile: false,
      platform: 'Windows',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "114",
          "name": "microsoft edge",
          "version": "114",
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
          "version": "114",
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
    const result = parseClientHintsUserAgentData({
      brands: [
        {
          brand: 'Not.A/Brand',
          version: '8',
        },
        {
          brand: 'Chromium',
          version: '114',
        },
        {
          brand: 'Microsoft Edge',
          version: '114',
        },
      ],
      mobile: true,
      platform: 'Android',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "114",
          "name": "microsoft edge",
          "version": "114",
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
          "version": "114",
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

describe('high entropy UADataValues only', () => {
  it('desktop chrome', () => {
    const result = parseClientHintsUserAgentData({
      architecture: 'arm',
      brands: [
        {
          brand: 'Not.A/Brand',
          version: '8',
        },
        {
          brand: 'Chromium',
          version: '114',
        },
        {
          brand: 'Google Chrome',
          version: '114',
        },
      ],
      fullVersionList: [
        {
          brand: 'Not.A/Brand',
          version: '8.0.0.0',
        },
        {
          brand: 'Chromium',
          version: '114.0.5735.198',
        },
        {
          brand: 'Google Chrome',
          version: '114.0.5735.198',
        },
      ],
      mobile: false,
      model: '',
      platform: 'macOS',
      platformVersion: '13.2.1',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "114",
          "name": "google chrome",
          "version": "114.0.5735.198",
        },
        "cpu": {
          "architecture": "arm",
        },
        "device": {
          "model": "",
          "type": "desktop",
          "vendor": undefined,
        },
        "engine": {
          "name": "chromium",
          "version": "114.0.5735.198",
        },
        "mobileOS": undefined,
        "os": {
          "name": "macOS",
          "version": "13.2.1",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile chrome', () => {
    const result = parseClientHintsUserAgentData({
      architecture: '',
      brands: [
        {
          brand: 'Not.A/Brand',
          version: '8',
        },
        {
          brand: 'Chromium',
          version: '114',
        },
        {
          brand: 'Google Chrome',
          version: '114',
        },
      ],
      fullVersionList: [
        {
          brand: 'Not.A/Brand',
          version: '8.0.0.0',
        },
        {
          brand: 'Chromium',
          version: '114.0.5735.198',
        },
        {
          brand: 'Google Chrome',
          version: '114.0.5735.198',
        },
      ],
      mobile: true,
      model: 'SM-G955U',
      platform: 'Android',
      platformVersion: '8.0.0',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "114",
          "name": "google chrome",
          "version": "114.0.5735.198",
        },
        "cpu": {
          "architecture": "",
        },
        "device": {
          "model": "SM-G955U",
          "type": "mobile",
          "vendor": undefined,
        },
        "engine": {
          "name": "chromium",
          "version": "114.0.5735.198",
        },
        "mobileOS": "android",
        "os": {
          "name": "Android",
          "version": "8.0.0",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('desktop edge', () => {
    const result = parseClientHintsUserAgentData({
      architecture: 'x86',
      brands: [
        {
          brand: 'Not.A/Brand',
          version: '8',
        },
        {
          brand: 'Chromium',
          version: '114',
        },
        {
          brand: 'Microsoft Edge',
          version: '114',
        },
      ],
      fullVersionList: [
        {
          brand: 'Not.A/Brand',
          version: '8.0.0.0',
        },
        {
          brand: 'Chromium',
          version: '114.0.5735.134',
        },
        {
          brand: 'Microsoft Edge',
          version: '114.0.1823.58',
        },
      ],
      mobile: false,
      model: '',
      platform: 'Windows',
      platformVersion: '10.0.0',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "114",
          "name": "microsoft edge",
          "version": "114.0.1823.58",
        },
        "cpu": {
          "architecture": "x86",
        },
        "device": {
          "model": "",
          "type": "desktop",
          "vendor": undefined,
        },
        "engine": {
          "name": "chromium",
          "version": "114.0.5735.134",
        },
        "mobileOS": undefined,
        "os": {
          "name": "Windows",
          "version": "10.0.0",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });

  it('mobile edge', () => {
    const result = parseClientHintsUserAgentData({
      architecture: '',
      brands: [
        {
          brand: 'Not.A/Brand',
          version: '8',
        },
        {
          brand: 'Chromium',
          version: '114',
        },
        {
          brand: 'Microsoft Edge',
          version: '114',
        },
      ],
      fullVersionList: [
        {
          brand: 'Not.A/Brand',
          version: '8.0.0.0',
        },
        {
          brand: 'Chromium',
          version: '114.0.5735.134',
        },
        {
          brand: 'Microsoft Edge',
          version: '114.0.1823.58',
        },
      ],
      mobile: true,
      model: 'Pixel 5',
      platform: 'Android',
      platformVersion: '11',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "browser": {
          "browserEngine": "chrome",
          "major": "114",
          "name": "microsoft edge",
          "version": "114.0.1823.58",
        },
        "cpu": {
          "architecture": "",
        },
        "device": {
          "model": "Pixel 5",
          "type": "mobile",
          "vendor": undefined,
        },
        "engine": {
          "name": "chromium",
          "version": "114.0.5735.134",
        },
        "mobileOS": "android",
        "os": {
          "name": "Android",
          "version": "11",
        },
        "sameSiteNoneCompatible": true,
      }
    `);
  });
});
