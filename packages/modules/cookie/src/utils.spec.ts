import { calculateExpires, trimSubdomains, prepareCookieOptions } from './utils';

const DateConstructor = Date;

describe('cookie utils', () => {
  it('calculateExpires', () => {
    // @ts-ignore
    jest.spyOn(global, 'Date').mockImplementation((args: any) => {
      if (args) {
        return new DateConstructor(args);
      }
      return new DateConstructor('2020-03-06T15:00:00.478Z');
    });
    const currentDate = new Date();

    expect(calculateExpires()).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(calculateExpires(25)!.toUTCString()).toEqual('Fri, 06 Mar 2020 15:00:25 GMT');
    expect(calculateExpires(currentDate)).toEqual(currentDate);
  });

  it('extractDomain', () => {
    expect(trimSubdomains('www.tinkoff.ru')).toBe('.tinkoff.ru');
    expect(trimSubdomains('test-state.tinkoff.ru:2020')).toBe('.tinkoff.ru');
    expect(trimSubdomains('localhost:3000')).toBe('localhost');
    expect(trimSubdomains('192.168.1.3')).toBe('192.168.1.3');
  });

  describe('prepareCookieOptions', () => {
    const compatibleUserAgent = {
      browser: {
        name: 'chrome',
        version: '100.0.4896.75',
        major: '100',
        browserEngine: 'chrome',
      },
      engine: { name: 'Blink', version: '100.0.4896.75' },
      os: { name: 'Mac OS', version: '10.15.7' },
      device: { vendor: undefined, model: undefined, type: undefined },
      cpu: { architecture: undefined },
      mobileOS: undefined,
      sameSiteNoneCompatible: true,
    };

    const incompatibleUserAgent = {
      browser: {
        name: 'chrome',
        version: '51.0.2704.84',
        major: '51',
        browserEngine: 'chrome',
      },
      engine: { name: 'Blink', version: '51.0.2704.84' },
      os: { name: undefined, version: undefined },
      device: { vendor: undefined, model: undefined, type: undefined },
      cpu: { architecture: undefined },
      mobileOS: undefined,
      sameSiteNoneCompatible: false,
    };

    it('correctly prepares options with sameSite=none and secure protocol', () => {
      expect(
        prepareCookieOptions(
          {
            userAgent: compatibleUserAgent,
            defaultHost: 'www.tinkoff.ru',
            secureProtocol: true,
          },
          {
            path: '/',
            sameSite: 'none',
          }
        )
      ).toEqual({ path: '/', secure: true, sameSite: 'none' });
    });

    it('ignores sameSite=none if protocol is not secure', () => {
      expect(
        prepareCookieOptions(
          {
            userAgent: compatibleUserAgent,
            defaultHost: 'www.tinkoff.ru',
            secureProtocol: false,
          },
          {
            path: '/',
            sameSite: 'none',
            noSubdomains: true,
          }
        )
      ).toEqual({ path: '/', domain: '.tinkoff.ru' });
    });

    it('correctly prepares options if sameSite is not none', () => {
      expect(
        prepareCookieOptions(
          {
            userAgent: compatibleUserAgent,
            defaultHost: 'www.tinkoff.ru',
            secureProtocol: false,
          },
          {
            path: '/',
            sameSite: 'strict',
            noSubdomains: true,
          }
        )
      ).toEqual({ path: '/', domain: '.tinkoff.ru', sameSite: 'strict' });

      expect(
        prepareCookieOptions(
          {
            userAgent: compatibleUserAgent,
            defaultHost: 'www.tinkoff.ru',
            secureProtocol: true,
          },
          {
            path: '/',
            sameSite: 'strict',
            noSubdomains: true,
          }
        )
      ).toEqual({ path: '/', domain: '.tinkoff.ru', sameSite: 'strict' });
    });

    it('ignores sameSite=none for incompatible userAgent', () => {
      expect(
        prepareCookieOptions(
          {
            userAgent: incompatibleUserAgent,
            defaultHost: 'www.tinkoff.ru',
            secureProtocol: true,
          },
          {
            path: '/',
            sameSite: 'none',
          }
        )
      ).toEqual({ path: '/' });
    });

    it('correctly prepares options if sameSite is not none for incompatible userAgent', () => {
      expect(
        prepareCookieOptions(
          {
            userAgent: incompatibleUserAgent,
            defaultHost: 'www.tinkoff.ru',
            secureProtocol: true,
          },
          {
            path: '/',
            sameSite: 'strict',
          }
        )
      ).toEqual({ path: '/', sameSite: 'strict' });
    });
  });
});
