/**
 * @jest-environment jsdom
 */
import { Cookies } from './cookies';

/* eslint-disable max-statements */
describe('Cookies mocked environment', () => {
  let cookiesValue = '';
  const cookieGetMock = jest.fn().mockImplementation(() => {
    return cookiesValue;
  });
  const cookieSetMock = jest.fn().mockImplementation((nextCookiesValue) => {
    cookiesValue = nextCookiesValue;
  });
  let dateSpy: jest.SpyInstance<Date, []>;
  let cookies: Cookies;

  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      get: cookieGetMock,
      set: cookieSetMock,
    });

    const RealDate = global.Date;
    const dateMock = new Date(Date.UTC(2030, 11, 20, 23, 15, 30, 0)); // 2030-12-20 23:15:30
    // @ts-ignore
    dateSpy = jest.spyOn(global, 'Date').mockImplementation((value) => {
      return value ? new RealDate(value) : dateMock;
    });

    cookies = new Cookies();
  });

  afterEach(() => {
    cookiesValue = '';
    dateSpy.mockRestore();
  });

  it('Get/set/erase basics', () => {
    // Test set
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Test get
    cookies.set('banana', 'yellow');
    expect(cookies.get('banana')).toBe('yellow');

    // Test erase
    cookies.erase('banana');
    expect(document.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;path=/');
  });

  it('Set a cookie using all possible options', () => {
    // Set all options
    const options = {
      expires: 4,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httpOnly: true,
      sameSite: 'strict' as const,
    };
    cookies.set('banana', 'yellow', options);

    // All options should have been applied
    expect(document.cookie).toBe(
      'banana=yellow;expires=Tue, 24 Dec 2030 23:15:30 GMT;domain=www.test.com;path=/some/path;secure;httponly;samesite=strict'
    );

    // Original options structure not modified
    expect(options).toEqual({
      expires: 4,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  });

  it('Set all possible defaults', () => {
    const defaults = {
      expires: 7,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httpOnly: true,
      sameSite: 'strict' as const,
    };

    // Set new defaults
    cookies = new Cookies(defaults);

    // Set cookie, all default options should be applies
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe(
      'banana=yellow;expires=Fri, 27 Dec 2030 23:15:30 GMT;domain=www.test.com;path=/some/path;secure;httponly;samesite=strict'
    );

    // The defaults should not have been modified
    expect(defaults).toEqual({
      expires: 7,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  });

  it('Set empty cookie', () => {
    cookies.set('banana', '');
    expect(document.cookie).toBe('banana=;path=/');
  });

  it('Set cookie using using no global defaults at all', () => {
    cookies = new Cookies({});
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/');
  });

  it('Set expires option', () => {
    // Set cookie with custom expiration time
    cookies.set('banana', 'yellow', { expires: 30 });
    expect(document.cookie).toBe('banana=yellow;expires=Sun, 19 Jan 2031 23:15:30 GMT;path=/');

    // Set a default expiration time
    cookies = new Cookies({ expires: 7 });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;expires=Fri, 27 Dec 2030 23:15:30 GMT;path=/');

    // Override the default expiration time using the function option
    cookies.set('banana', 'yellow', { expires: 14 });
    expect(document.cookie).toBe('banana=yellow;expires=Fri, 03 Jan 2031 23:15:30 GMT;path=/');
  });

  it('Verify erase options are applied', () => {
    // Erase cookie with all available options
    cookies.erase('banana', { domain: 'example.org', path: '/a/path' });
    expect(document.cookie).toBe(
      'banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=example.org;path=/a/path'
    );

    // Erase cookie with only the path set
    cookies.erase('banana', { path: '/a/path' });
    expect(document.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;path=/a/path');

    // Erase cookie with only the domain set
    cookies.erase('banana', { domain: 'example.org' });
    expect(document.cookie).toBe(
      'banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=example.org;path=/'
    );
  });

  it("Verify erase doesn't apply default configuration", () => {
    // Set some defaults
    cookies = new Cookies({
      expires: 7,
      domain: 'default.example.org',
      path: '/default/path',
      secure: true,
      httpOnly: true,
    });

    // Erase cookie should apply the domain and path specified in the defaults above
    cookies.erase('banana');
    expect(document.cookie).toBe(
      'banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=default.example.org;path=/default/path'
    );

    // Erase cookie with specified domain and path overrules the defaults
    cookies.erase('banana', { domain: 'other.example.org', path: '/other/path' });
    expect(document.cookie).toBe(
      'banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=other.example.org;path=/other/path'
    );

    // All options besides domain and path should be ignored
    cookies.erase('banana', {
      domain: 'other.example.org',
      path: '/other/path',
      expires: 100,
      secure: true,
      httpOnly: true,
    });
    expect(document.cookie).toBe(
      'banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=other.example.org;path=/other/path'
    );
  });

  it("Verify all allowed formats for the 'expires' option", () => {
    // Verify usage of Date() format
    cookies.set('banana', 'yellow', { expires: new Date(2030, 11, 20) });
    expect(document.cookie.replace('GMT', 'UTC')).toBe(
      `banana=yellow;expires=${new Date(2030, 11, 20).toUTCString().replace('GMT', 'UTC')};path=/`
    );

    // Verify usage of integer format (days till expiration)
    cookies.set('banana', 'yellow', { expires: 5 });
    expect(document.cookie).toBe('banana=yellow;expires=Wed, 25 Dec 2030 23:15:30 GMT;path=/');

    // Verify usage of float format (set to one and a half day)
    cookies.set('banana', 'yellow', { expires: 1.5 });
    expect(document.cookie).toBe('banana=yellow;expires=Sun, 22 Dec 2030 11:15:30 GMT;path=/');

    // Verify usage of string format (in a format recognized by Date.parse() )
    cookies.set('banana', 'yellow', { expires: '01/08/2031' });
    let expectedDate = new Date('01/08/2031').toUTCString();
    expect(document.cookie).toBe(`banana=yellow;expires=${expectedDate};path=/`);

    // Verify date may be set to unix epoch
    cookies.set('banana', 'yellow', { expires: new Date(0) });
    expectedDate = new Date(0).toUTCString();
    expect(document.cookie).toBe(`banana=yellow;expires=${expectedDate};path=/`);
  });

  it("Verify unsupported formats for the 'expires' option are ignored", () => {
    cookies.set('banana', 'yellow', { expires: 'anInvalidDateString' });
    expect(document.cookie).toBe('banana=yellow;path=/');

    // @ts-ignore
    cookies.set('banana', 'yellow', { expires: ['an', 'array'] });
    expect(document.cookie).toBe('banana=yellow;path=/');

    cookies.set('banana', 'yellow', { expires: NaN });
    expect(document.cookie).toBe('banana=yellow;path=/');

    cookies.set('banana', 'yellow', { expires: null });
    expect(document.cookie).toBe('banana=yellow;path=/');
  });

  it('Set domain option', () => {
    // Set cookie with custom domain
    cookies.set('banana', 'yellow', { domain: 'www.test.com' });
    expect(document.cookie).toBe('banana=yellow;domain=www.test.com;path=/');

    // Set a default domain
    cookies = new Cookies({ domain: 'default.domain.com' });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;domain=default.domain.com;path=/');

    // Override the default domain using the function option
    cookies.set('banana', 'yellow', { domain: 'override.domain.com' });
    expect(document.cookie).toBe('banana=yellow;domain=override.domain.com;path=/');
  });

  it('Set path option', () => {
    // Path defaults to '/'
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Set cookie with custom path
    cookies.set('banana', 'yellow', { path: '/some/path' });
    expect(document.cookie).toBe('banana=yellow;path=/some/path');

    // Set cookie with an empty path (the browser will use the current path)
    cookies.set('banana', 'yellow', { path: '' });
    expect(document.cookie).toBe('banana=yellow');

    // Change the default path
    cookies = new Cookies({ path: '/a/default/path' });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/a/default/path');

    // Override the default path using the function option
    cookies.set('banana', 'yellow', { path: '/override/path' });
    expect(document.cookie).toBe('banana=yellow;path=/override/path');

    // Default path may set set to ''
    cookies = new Cookies({ path: '' });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow');
  });

  it('Set secure option', () => {
    // Set cookie with the secure option
    cookies.set('banana', 'yellow', { secure: true });
    expect(document.cookie).toBe('banana=yellow;path=/;secure');

    // Set cookie without the secure option
    cookies.set('banana', 'yellow', { secure: false });
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Change the default to true
    cookies = new Cookies({ secure: true });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/;secure');

    // Override the default to false using the function option
    cookies.set('banana', 'yellow', { secure: false });
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Change the default to false
    cookies = new Cookies({ secure: false });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Override the default to true using the function option
    cookies.set('banana', 'yellow', { secure: true });
    expect(document.cookie).toBe('banana=yellow;path=/;secure');
  });

  it('Set httpOnly option', () => {
    // Set cookie with the httpOnly option
    cookies.set('banana', 'yellow', { httpOnly: true });
    expect(document.cookie).toBe('banana=yellow;path=/;httponly');

    // Set cookie without the httpOnly option
    cookies.set('banana', 'yellow', { httpOnly: false });
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Change the default to true
    cookies = new Cookies({ httpOnly: true });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/;httponly');

    // Override the default to false using the function option
    cookies.set('banana', 'yellow', { httpOnly: false });
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Change the default to false
    cookies = new Cookies({ httpOnly: false });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Override the default to true using the function option
    cookies.set('banana', 'yellow', { httpOnly: true });
    expect(document.cookie).toBe('banana=yellow;path=/;httponly');
  });

  it('Set sameSite option', () => {
    // Set cookie with the sameSite option (to Strict)
    cookies.set('banana', 'yellow', { sameSite: 'strict' });
    expect(document.cookie).toBe('banana=yellow;path=/;samesite=strict');

    // Set cookie with the sameSite option (to Lax)
    cookies.set('banana', 'yellow', { sameSite: 'lax' });
    expect(document.cookie).toBe('banana=yellow;path=/;samesite=lax');

    // Set cookie without the sameSite option
    // @ts-ignore
    cookies.set('banana', 'yellow', { sameSite: '' });
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Change the default to 'lax'
    cookies = new Cookies({ sameSite: 'lax' });
    cookies.set('banana', 'yellow');
    expect(document.cookie).toBe('banana=yellow;path=/;samesite=lax');

    // Override the default using the function option to disable sameSite
    // @ts-ignore
    cookies.set('banana', 'yellow', { sameSite: '' });
    expect(document.cookie).toBe('banana=yellow;path=/');

    // Override the default using the function option (to 'strict')
    cookies.set('banana', 'yellow', { sameSite: 'strict' });
    expect(document.cookie).toBe('banana=yellow;path=/;samesite=strict');
  });

  it('Verify cookie name encoding', () => {
    // Should apply URI encoding
    cookies.set('báñâñâ', 'yellow');
    expect(document.cookie).toBe('b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2=yellow;path=/');

    // rfc6265 specifies a cookie name is of the `token` type as defined in rfc2616:
    //   token          = 1*<any CHAR except CTLs or separators>
    //   separators     = "(" | ")" | "<" | ">" | "@"
    //                  | "," | ";" | ":" | "\" | <">
    //                  | "/" | "[" | "]" | "?" | "="
    //                  | "{" | "}" | SP | HT
    //
    //  Note that a CHAR is defined as any US-ASCII character (octets 0 - 127)
    const separators = {
      '(': '%28',
      ')': '%29',
      '<': '%3C',
      '>': '%3E',
      '@': '%40',
      ',': '%2C',
      ';': '%3B',
      ':': '%3A',
      '\\': '%5C',
      '"': '%22',
      '/': '%2F',
      '[': '%5B',
      ']': '%5D',
      '?': '%3F',
      '=': '%3D',
      '{': '%7B',
      '}': '%7D',
      ' ': '%20',
      '\t': '%09',
    };

    // Check whether all separators are encoded
    for (const separator in separators) {
      cookies.set(`cookie${separator}`, 'value');
      expect(document.cookie).toBe(`cookie${separators[separator]}=value;path=/`);
    }

    // Check whether CTLs are encoded
    cookies.set('\x10', 'value');
    expect(document.cookie).toBe('%10=value;path=/');
    cookies.set('\x7F', 'value');
    expect(document.cookie).toBe('%7F=value;path=/');

    // The '%' sign should be encoded as it's used as prefix for percentage encoding
    cookies.set('%', 'value');
    expect(document.cookie).toBe('%25=value;path=/');

    // Check whether all US-ASCII CHARS except for separators and CTLs are encoded
    for (let i = 0; i < 256; i++) {
      const ascii = String.fromCharCode(i);

      // Skip CTLs, the % sign and separators
      // eslint-disable-next-line eqeqeq, no-prototype-builtins
      if (i < 32 || i >= 127 || ascii == '%' || separators.hasOwnProperty(ascii)) {
        continue;
      }

      cookies.set(`cookie${ascii}`, 'value');
      expect(document.cookie).toBe(`cookie${ascii}=value;path=/`);
    }
  });

  it('Verify cookie name decoding', () => {
    document.cookie = 'b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2=yellow';
    expect(cookies.get('báñâñâ')).toBe('yellow');
    expect(cookies.all()['báñâñâ']).toBe('yellow');
  });

  it('Return cookies with wrong encoded name without decoding', () => {
    document.cookie = 'b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2=yellow; %ff=red';
    expect(cookies.get('%ff')).toBe('red');
    expect(cookies.all()).toEqual({ '%ff': 'red', báñâñâ: 'yellow' });
  });

  it('Return cookies with wrong encoded value without decoding', () => {
    document.cookie = 'banana=yellow; apple=%ff';
    expect(cookies.get('apple')).toBe('%ff');
    expect(cookies.all()).toEqual({ apple: '%ff', banana: 'yellow' });
  });

  it('Verify cookie name parsing using whitespace', () => {
    // Without whitespace
    document.cookie = 'a=1;b=2;c=3';
    expect(cookies.get('a')).toBe('1');
    expect(cookies.get('b')).toBe('2');
    expect(cookies.get('c')).toBe('3');
    expect(cookies.all()).toEqual({ a: '1', b: '2', c: '3' });

    // With leading whitespace
    document.cookie = 'a=1; b=2;c=3';
    expect(cookies.get('a')).toBe('1');
    expect(cookies.get('b')).toBe('2');
    expect(cookies.get('c')).toBe('3');
    expect(cookies.all()).toEqual({ a: '1', b: '2', c: '3' });
  });

  it('Verify cookie value encoding', () => {
    // Should apply URI encoding
    cookies.set('banana', '¿yéllów?');
    expect(document.cookie).toBe('banana=%C2%BFy%C3%A9ll%C3%B3w?;path=/');

    // Should not modify the original value
    const value = '¿yéllów?';
    cookies.set('banana', value);
    expect(document.cookie).toBe('banana=%C2%BFy%C3%A9ll%C3%B3w?;path=/');
    expect(value).toBe('¿yéllów?');

    // RFC 6265 (http://tools.ietf.org/html/rfc6265) is the 'real world' cookies specification.
    // The specification allows the following subset of ASCII characters to be unescaped:
    //     hex    : dec   : ASCII
    //     0x21   : 33    : !
    cookies.set('a', '!');
    expect(document.cookie).toBe('a=!;path=/');
    //     0x23-2B: 35-43 : #$%&'()*+    (note that % should be encoded because it's the prefix for percent encoding)
    cookies.set('b', "#$%&'()*+");
    expect(document.cookie).toBe("b=#$%25&'()*+;path=/");
    //     0x2D-3A: 45-58 : -./0123456789:
    cookies.set('c', '-./0123456789:');
    expect(document.cookie).toBe('c=-./0123456789:;path=/');
    //     0x3C-5B: 60-91 : <=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[
    cookies.set('d', '<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');
    expect(document.cookie).toBe('d=<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[;path=/');
    //     0x5D-7E: 93-126: ]^_`abcdefghijklmnopqrstuvwxyz{|}~
    cookies.set('e', ']^_`abcdefghijklmnopqrstuvwxyz{|}~');
    expect(document.cookie).toBe('e=]^_`abcdefghijklmnopqrstuvwxyz{|}~;path=/');

    // Now check the inverse of above: whether remaining character ranges are percent encoded (they should be)
    cookies.set('f_CTL', '\x10');
    expect(document.cookie).toBe('f_CTL=%10;path=/');
    cookies.set('f_whitespace', ' ');
    expect(document.cookie).toBe('f_whitespace=%20;path=/');
    cookies.set('f_DQUOTE', '"');
    expect(document.cookie).toBe('f_DQUOTE=%22;path=/');
    cookies.set('f_comma', ',');
    expect(document.cookie).toBe('f_comma=%2C;path=/');
    cookies.set('f_semicolon', ';');
    expect(document.cookie).toBe('f_semicolon=%3B;path=/');
    cookies.set('f_backslash', '\\');
    expect(document.cookie).toBe('f_backslash=%5C;path=/');
    cookies.set('f_CTL2', '\x7F');
    expect(document.cookie).toBe('f_CTL2=%7F;path=/');
  });

  describe('Verify compatibility with PHP server side', () => {
    it("Using PHP setcookie() - doesn't encode the plus sign properly", () => {
      // PHP output was generated using PHP 5.5
      // http://php.net/manual/en/function.setcookie.php

      // <?php setcookie('banana', '¿yéllów?'); ?>
      document.cookie = 'banana=%C2%BFy%C3%A9ll%C3%B3w%3F';
      expect(cookies.get('banana')).toBe('¿yéllów?');

      // <?php setcookie('a', '!#$%&\'()*+-./0123456789:'); ?>
      document.cookie = 'a=%21%23%24%25%26%27%28%29%2A%2B-.%2F0123456789%3A';
      expect(cookies.get('a')).toBe("!#$%&'()*+-./0123456789:");

      // <?php setcookie('b', '<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ['); ?>
      document.cookie = 'b=%3C%3D%3E%3F%40ABCDEFGHIJKLMNOPQRSTUVWXYZ%5B';
      expect(cookies.get('b')).toBe('<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');

      // <?php setcookie('c', ']^_`abcdefghijklmnopqrstuvwxyz{|}~'); ?>
      document.cookie = 'c=%5D%5E_%60abcdefghijklmnopqrstuvwxyz%7B%7C%7D%7E';
      expect(cookies.get('c')).toBe(']^_`abcdefghijklmnopqrstuvwxyz{|}~');

      // <?php setcookie('f', "\x10"); ?>
      document.cookie = 'f=%10';
      expect(cookies.get('f')).toBe('\x10');

      // <?php setcookie('f', " "); ?>
      document.cookie = 'f=+';
      expect(cookies.get('f')).toBe('+'); // Note: should have been ' ' instead of '+'

      // <?php setcookie('f', '"'); ?>
      document.cookie = 'f=%22';
      expect(cookies.get('f')).toBe('"');

      // <?php setcookie('f', ","); ?>
      document.cookie = 'f=%2C';
      expect(cookies.get('f')).toBe(',');

      // <?php setcookie('f', ";"); ?>
      document.cookie = 'f=%3B';
      expect(cookies.get('f')).toBe(';');

      // <?php setcookie('f', "\\"); ?>
      document.cookie = 'f=%5C';
      expect(cookies.get('f')).toBe('\\');

      // <?php setcookie('f', "\x7F"); ?>
      document.cookie = 'f=%7F';
      expect(cookies.get('f')).toBe('\x7F');

      // PHP cookie array notation
      // <?php setcookie('cookie[one]', "1"); ?>
      // <?php setcookie('cookie[two]', "2"); ?>
      document.cookie = 'cookie[one]=1; cookie[two]=2';
      expect(cookies.get('cookie[one]')).toBe('1');
      expect(cookies.get('cookie[two]')).toBe('2');

      // PHP will overwrite existing cookies (which is the correct behavior)
      // <?php setcookie('c', "1"); ?>
      // <?php setcookie('c', "2"); ?>
      document.cookie = 'c=2';
      expect(cookies.get('c')).toBe('2');
    });

    it('Using PHP setrawcookie() and rawurlencode', () => {
      // PHP output was generated using PHP 5.5
      // http://php.net/manual/en/function.setcookie.php
      // http://php.net/manual/en/function.rawurlencode.php

      // <?php setrawcookie('banana', rawurlencode('¿yéllów?')); ?>
      document.cookie = 'banana=%C2%BFy%C3%A9ll%C3%B3w%3F';
      expect(cookies.get('banana')).toBe('¿yéllów?');

      // <?php setrawcookie('a', rawurlencode('!#$%&\'()*+-./0123456789:')); ?>
      document.cookie = 'a=%21%23%24%25%26%27%28%29%2A%2B-.%2F0123456789%3A';
      expect(cookies.get('a')).toBe("!#$%&'()*+-./0123456789:");

      // <?php setrawcookie('b', rawurlencode('<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[')); ?>
      document.cookie = 'b=%3C%3D%3E%3F%40ABCDEFGHIJKLMNOPQRSTUVWXYZ%5B';
      expect(cookies.get('b')).toBe('<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');

      // <?php setrawcookie('c', rawurlencode(']^_`abcdefghijklmnopqrstuvwxyz{|}~')); ?>
      document.cookie = 'c=%5D%5E_%60abcdefghijklmnopqrstuvwxyz%7B%7C%7D~';
      expect(cookies.get('c')).toBe(']^_`abcdefghijklmnopqrstuvwxyz{|}~');

      // <?php setrawcookie('f', rawurlencode("\x10")); ?>
      document.cookie = 'f=%10';
      expect(cookies.get('f')).toBe('\x10');

      // <?php setrawcookie('f', rawurlencode(' ')); ?>
      document.cookie = 'f=%20';
      expect(cookies.get('f')).toBe(' ');

      // <?php setrawcookie('f', rawurlencode('"')); ?>
      document.cookie = 'f=%22';
      expect(cookies.get('f')).toBe('"');

      // <?php setrawcookie('f', rawurlencode(',')); ?>
      document.cookie = 'f=%2C';
      expect(cookies.get('f')).toBe(',');

      // <?php setrawcookie('f', rawurlencode(';')); ?>
      document.cookie = 'f=%3B';
      expect(cookies.get('f')).toBe(';');

      // <?php setrawcookie('f', rawurlencode("\\")); ?>
      document.cookie = 'f=%5C';
      expect(cookies.get('f')).toBe('\\');

      // <?php setrawcookie('f', rawurlencode("\x7F")); ?>
      document.cookie = 'f=%7F';
      expect(cookies.get('f')).toBe('\x7F');

      // PHP cookie array notation
      // <?php setrawcookie('cookie[one]', rawurlencode("1")); ?>
      // <?php setrawcookie('cookie[two]', rawurlencode("2")); ?>
      document.cookie = 'cookie[one]=1; cookie[two]=2';
      expect(cookies.get('cookie[one]')).toBe('1');
      expect(cookies.get('cookie[two]')).toBe('2');

      // PHP will overwrite existing cookies (which is the correct behavior)
      // <?php setrawcookie('c', rawurlencode('1')); ?>
      // <?php setrawcookie('c', rawurlencode('2')); ?>
      document.cookie = 'c=2';
      expect(cookies.get('c')).toBe('2');
    });
  });
});
/* eslint-enable max-statements */
