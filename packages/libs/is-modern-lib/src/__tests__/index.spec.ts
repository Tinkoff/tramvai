import { isModernLib, isLegacyLib, modernLibs } from '../index';

const rules = {
  'find-modern-libs': { regexp: isModernLib, except: false },
  'find-legacy-libs': { regexp: isLegacyLib, except: true },
};

describe('isModernLib', () => {
  function testLibsMatching(target: 'find-modern-libs' | 'find-legacy-libs') {
    const { regexp, except } = rules[target];

    describe(`${target}`, () => {
      it('Match target packages', () => {
        modernLibs.forEach((lib) => {
          expect(
            regexp.test(
              `/user/application/node_modules/${
                lib.startsWith('@') && !lib.includes('/') ? `${lib}/package/` : lib
              }/index.js`
            )
          ).toBe(!except);
        });
      });

      it('Ignore unknown scoped package', () => {
        expect(regexp.test(`/user/application/node_modules/@scope/package/index.js`)).toBe(
          !!except
        );
      });

      it('Ignore unknown package', () => {
        expect(regexp.test(`/user/application/node_modules/package/index.js`)).toBe(!!except);
      });

      it('Handle non-modern libs nested in modern lib node_modules', () => {
        expect(
          regexp.test(
            `forms\\debit\\node_modules\\@tinkoff-boxy\\mmf\\node_modules\\@babel\\parser\\lib\\index.js`
          )
        ).toBe(!!except);
      });
    });
  }

  testLibsMatching('find-modern-libs');

  testLibsMatching('find-legacy-libs');
});
