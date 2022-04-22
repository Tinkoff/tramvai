/**
 * @jest-environment jsdom
 */
import { UAParser } from 'ua-parser-js';
import { parse } from './userAgent';

jest.mock('ua-parser-js', () => ({
  UAParser: Object.assign(jest.fn(), { BROWSER: {} }),
}));

let params;

(UAParser as any).mockImplementation(function () {
  return {
    setUA() {
      return this;
    },
    getResult() {
      return params;
    },
  };
});

const responseManager: any = {
  getHeader() {
    return 'ua';
  },
};

describe('user-agent/userAgent', () => {
  it('test service for winphone/firefox', () => {
    params = {
      os: { name: 'Windows Phone' },
      browser: { name: 'Firefox' },
    };

    expect(parse(responseManager)).toEqual({
      browser: { browserEngine: 'firefox', name: 'firefox' },
      os: { name: 'Windows Phone' },
      mobileOS: 'winphone',
      sameSiteNoneCompatible: true,
    });
  });

  it('test service for android/webkit', () => {
    params = {
      os: { name: 'Android' },
      browser: { name: 'Chrome' },
      engine: { name: 'Webkit' },
      sameSiteNoneCompatible: true,
    };

    expect(parse(responseManager)).toEqual({
      browser: { browserEngine: 'chrome', name: 'chrome' },
      engine: { name: 'Webkit' },
      os: { name: 'Android' },
      mobileOS: 'android',
      sameSiteNoneCompatible: true,
    });
  });

  it('test service for ios/safari', () => {
    params = {
      os: { name: 'iOS' },
      browser: { name: 'Safari' },
      sameSiteNoneCompatible: true,
    };

    expect(parse(responseManager)).toEqual({
      browser: { browserEngine: 'safari', name: 'safari' },
      os: { name: 'iOS' },
      mobileOS: 'ios',
      sameSiteNoneCompatible: true,
    });
  });

  it('test service for blackberry', () => {
    params = {
      os: { name: 'BlackBerry' },
      browser: { name: 'amigo' },
      sameSiteNoneCompatible: true,
    };

    expect(parse(responseManager)).toEqual({
      browser: { browserEngine: 'other', name: 'amigo' },
      os: { name: 'BlackBerry' },
      mobileOS: 'blackberry',
      sameSiteNoneCompatible: true,
    });
  });

  it('test service for opera mobi', () => {
    params = {
      os: { name: 'BlackBerry' },
      browser: { name: 'Opera Mobi' },
      sameSiteNoneCompatible: true,
      device: {
        type: undefined,
      },
    };

    expect(parse(responseManager)).toMatchObject({
      device: {
        type: 'mobile',
      },
    });
  });
});
