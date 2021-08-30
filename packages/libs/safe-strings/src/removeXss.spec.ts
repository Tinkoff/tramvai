import { removeXss } from './removeXss';

describe('removeXss', () => {
  describe('should escape', () => {
    const scriptReferrer =
      "https://tinkoff.ru/login/?redirectTo=<script>alert('XSS')</script>&redirectType=";
    const linkReferrer =
      "https://tinkoff.ru/login/?redirectTo=<link href='https://www.mediawiki.org/wiki/Preventing_XSS_Attacks_through_CSS_Whitelisting' />&redirectType=";
    const preventedReferrer = 'https://tinkoff.ru/login/?redirectTo=&redirectType=';

    const check = (actualReferrer) => {
      expect(removeXss(actualReferrer)).toEqual(preventedReferrer);
    };

    // eslint-disable-next-line jest/expect-expect
    it('script tag on server', () => {
      return check(scriptReferrer);
    });

    // eslint-disable-next-line jest/expect-expect
    it('link tag on server', () => {
      return check(linkReferrer);
    });
  });
});
