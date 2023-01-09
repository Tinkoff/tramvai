/**
 * @jest-environment jsdom
 */
import { Cookies } from './cookies';

/* eslint-disable max-statements */
describe('Cookies real environment', () => {
  let cookies: Cookies;

  beforeEach(() => {
    cookies = new Cookies();

    // Remove temporary cookies
    const cookiesMock = ['banana', 'b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2', 'a', 'b', 'c', 'd', 'e', 'f'];
    for (let i = 0; i < cookiesMock.length; i++) {
      document.cookie = `${cookiesMock[i]}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }
  });

  afterEach(() => {
    // Remove temporary cookies
    const cookiesMock = ['banana', 'b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2', 'a', 'b', 'c', 'd', 'e', 'f'];
    for (let i = 0; i < cookiesMock.length; i++) {
      document.cookie = `${cookiesMock[i]}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }
  });

  it('Get/set/erase basics', () => {
    // Test get (when no cookie has been set)
    expect(cookies.get('banana')).toBeUndefined();

    // Test set
    cookies.set('banana', 'yellow');
    expect(cookies.get('banana')).toBe('yellow');

    // Test erase
    cookies.erase('banana');
    expect(cookies.get('banana')).toBeUndefined();
  });

  it('Get/set/erase cookie using expire option', () => {
    // Test get (when no cookie has been set)
    expect(cookies.get('banana')).toBeUndefined();

    // Test set with the expires option set
    cookies.set('banana', 'yellow', { expires: 100 });
    expect(cookies.get('banana')).toBe('yellow');

    // Test erase
    cookies.erase('banana');
    expect(cookies.get('banana')).toBeUndefined();
  });

  it('Set cookie using all possible options', () => {
    cookies.set('banana', 'yellow', {
      expires: 30,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httpOnly: true,
    });
    // Note that the cookie won't be set because the domain/path/secure options are
    // not correct for the PhantomJS session
    expect(cookies.get('banana')).toBeUndefined();
  });

  it('Set empty cookie', () => {
    cookies.set('banana', '');
    expect(cookies.get('banana')).toBe('');
  });

  it('Erase non-existing cookie', () => {
    // Shouldn't raise any error
    expect(cookies.erase('orange')).toBeUndefined();
  });

  it('Verify cookie name encoding and decoding', () => {
    cookies.set('báñâñâ', 'yellow');
    expect(cookies.get('báñâñâ')).toBe('yellow');

    // Check whether all US-ASCII CHARS are identical before encoding and after decoding
    for (let i = 0; i < 256; i++) {
      const name = `cookie${String.fromCharCode(i)}`;

      // Set cookie
      cookies.set(name, 'value');

      // Get cookie
      expect(cookies.get(name)).toBe('value');
      expect(cookies.all()[name]).toBe('value');

      // Erase cookie
      cookies.erase(name);
      expect(cookies.get(name)).toBeUndefined();
    }
  });

  it('Verify cookie value encoding and decoding', () => {
    // Should apply URI encoding
    cookies.set('banana', '¿yéllów?');
    expect(cookies.get('banana')).toBe('¿yéllów?');
    expect(cookies.all().banana).toBe('¿yéllów?');

    // Should not modify the original value
    const value = '¿yéllów?';
    cookies.set('banana', value);
    expect(cookies.get('banana')).toBe('¿yéllów?');
    expect(value).toBe('¿yéllów?');

    // Check whether all characters allowed to be escaped by rfc6265 are identical before encoding and after decoding
    cookies.set('a', '!');
    expect(cookies.get('a')).toBe('!');
    cookies.set('b', "#$%&'()*+");
    expect(cookies.get('b')).toBe("#$%&'()*+");
    cookies.set('c', '-./0123456789:');
    expect(cookies.get('c')).toBe('-./0123456789:');
    cookies.set('d', '<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');
    expect(cookies.get('d')).toBe('<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');
    cookies.set('e', ']^_`abcdefghijklmnopqrstuvwxyz{|}~');
    expect(cookies.get('e')).toBe(']^_`abcdefghijklmnopqrstuvwxyz{|}~');

    // Check whether all characters that must be escaped by rfc6265 are identical before encoding and after decoding
    cookies.set('f', '\x10');
    expect(cookies.get('f')).toBe('\x10');
    cookies.set('f', ' ');
    expect(cookies.get('f')).toBe(' ');
    cookies.set('f', '"');
    expect(cookies.get('f')).toBe('"');
    cookies.set('f', ',');
    expect(cookies.get('f')).toBe(',');
    cookies.set('f', ';');
    expect(cookies.get('f')).toBe(';');
    cookies.set('f', '\\');
    expect(cookies.get('f')).toBe('\\');
    cookies.set('f', '\x7F');
    expect(cookies.get('f')).toBe('\x7F');
  });

  it('Verify retrieval of multiple cookies', () => {
    cookies.set('a', '1');
    cookies.set('b', '2');
    cookies.set('c', '3');
    expect(cookies.get('a')).toBe('1');
    expect(cookies.get('b')).toBe('2');
    expect(cookies.get('c')).toBe('3');
    expect(cookies.all()).toEqual({ a: '1', b: '2', c: '3' });
  });

  it('Verify retrieval of multiple cookies with separator characters in the value', () => {
    cookies.set('a', '=1=');
    cookies.set('b', ':2:');
    cookies.set('c', ';3;');
    expect(cookies.get('a')).toBe('=1=');
    expect(cookies.get('b')).toBe(':2:');
    expect(cookies.get('c')).toBe(';3;');
    expect(cookies.all()).toEqual({ a: '=1=', b: ':2:', c: ';3;' });
  });
});
/* eslint-enable max-statements */
