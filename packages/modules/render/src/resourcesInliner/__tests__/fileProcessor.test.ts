import { URL_OCCURRENCES_RE, processFile } from '../fileProcessor';

describe('Конечный автомат загруки css ресурсов', () => {
  describe('Регулярное выражение для поиска включений url в css коде', () => {
    it('Видит url, заключенный в кавычки', () => {
      const code = "url('pragmatica/v5/pragmatica-extralight-v4.woff2')";

      expect(code.match(URL_OCCURRENCES_RE).length).toBe(1);
    });
    it('Видит url, не заключенный в кавычки', () => {
      const code = 'url(pragmatica/v5/pragmatica-extralight-v4.woff2)';

      expect(code.match(URL_OCCURRENCES_RE).length).toBe(1);
    });
    it('Видит абсолютный url', () => {
      const code =
        "url(https://www.cdn.domain.com/fonts/pragmatica/v5/pragmatica-extralight-v4.woff2)format('woff2')";

      expect(code.match(URL_OCCURRENCES_RE).length).toBe(1);
    });
    it('Видит относительный url', () => {
      const code = "url(pragmatica/v5/pragmatica-extralight-v4.woff2)format('woff2')";

      expect(code.match(URL_OCCURRENCES_RE).length).toBe(1);
    });
    it('Видит множественные вхождения url в font-face', () => {
      const cssCode =
        "@font-face {font-family: 'pragmatica';" +
        "src: url('pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')," +
        "url('pragmatica/v5/pragmatica-extralight-v4.eot') format('eot')," +
        "url('pragmatica/v5/pragmatica-extralight-v4.woff') format('woff')," +
        "url('pragmatica/v5/pragmatica-extralight-v4.ttf') format('ttf');" +
        'font-weight: 200; font-style: normal;}';
      const matches = cssCode.match(URL_OCCURRENCES_RE);

      expect(matches).toEqual([
        "url('pragmatica/v5/pragmatica-extralight-v4.woff2')",
        "url('pragmatica/v5/pragmatica-extralight-v4.eot')",
        "url('pragmatica/v5/pragmatica-extralight-v4.woff')",
        "url('pragmatica/v5/pragmatica-extralight-v4.ttf')",
      ]);
    });
    it('Видит url в background-image', () => {
      const cssCode =
        '.some-class{' +
        'background-image:url(//static.domain.com/dist/portal-new/compiled/cb3fbc4d721e1cf72b08c3f2af6ef0ba.png);' +
        '}';
      const matches = cssCode.match(URL_OCCURRENCES_RE);

      expect(matches).toEqual([
        'url(//static.domain.com/dist/portal-new/compiled/cb3fbc4d721e1cf72b08c3f2af6ef0ba.png)',
      ]);
    });
  });
  describe('Функция замены относительных url в коде на абсолютные', () => {
    const hostUrl = 'https://cdn.domain.com/';

    it('Заменяет http url на https для относительного url', () => {
      const resourceUrl = 'http://cdn.domain.com/fonts1.css';
      const before = "src: url('pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')";
      const after = processFile(
        {
          slot: 'body:end',
          type: 'style',
          payload: resourceUrl,
        },
        before
      );

      expect(after).toBe(
        `src: url('${hostUrl}pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')`
      );
    });

    it('Корректно обновляет путь для относительного url', () => {
      const resourceUrl = `${hostUrl}fonts1.css`;
      const before = "src: url('pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')";
      const after = processFile(
        {
          slot: 'body:end',
          type: 'style',
          payload: resourceUrl,
        },
        before
      );

      expect(after).toBe(
        `src: url('${hostUrl}pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')`
      );
    });

    it('Корректно обновляет путь для относительного url, в котором путь на одну иерархию ниже', () => {
      const resourceUrlWithAdditionalPath = `${hostUrl}some_dir/fonts.css`;
      const before = "src: url('../pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')";
      const after = processFile(
        {
          slot: 'body:end',
          type: 'style',
          payload: resourceUrlWithAdditionalPath,
        },
        before
      );

      expect(after).toBe(
        "src: url('https://cdn.domain.com/pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')"
      );
    });
    it('Корректно обновляет путь для относительного url БЕЗ кавычек', () => {
      const resourceUrl = `${hostUrl}fonts2.css`;
      const before = "src: url(pragmatica/v5/pragmatica-extralight-v4.woff2)format('woff2')";
      const after = processFile(
        {
          slot: 'body:end',
          type: 'style',
          payload: resourceUrl,
        },
        before
      );

      expect(after).toBe(
        `src: url(${hostUrl}pragmatica/v5/pragmatica-extralight-v4.woff2)format('woff2')`
      );
    });
    it('НЕ обновляет путь для абсолютно url c http', () => {
      const resourceUrl = `${hostUrl}fonts3.css`;
      const before =
        "src: url('http://domain.com/pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')";
      const after = processFile(
        {
          slot: 'body:end',
          type: 'style',
          payload: resourceUrl,
        },
        before
      );

      expect(after).toBe(before);
    });
    it('НЕ обновляет путь для абсолютно url c https', () => {
      const resourceUrl = `${hostUrl}fonts4.css`;
      const before =
        "src: url('https://domain.com/pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')";
      const after = processFile(
        {
          slot: 'body:end',
          type: 'style',
          payload: resourceUrl,
        },
        before
      );

      expect(after).toBe(before);
    });
    it('НЕ обновляет путь для абсолютно url, начинающегося с //', () => {
      const resourceUrl = `${hostUrl}fonts5.css`;
      const before = "background-image:url('//static.domain.com/flags/1/GBR.svg')";
      const after = processFile(
        {
          slot: 'body:end',
          type: 'style',
          payload: resourceUrl,
        },
        before
      );

      expect(after).toBe(before);
    });
    it('Корректно обновляет несколько путей', () => {
      const testUrl = 'https://cdn.domain.com';
      const css =
        "@font-face {font-family: 'pragmatica';" +
        "src: url('pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')," +
        "url('pragmatica/v5/pragmatica-extralight-v4.eot') format('eot')," +
        "url('pragmatica/v5/pragmatica-extralight-v4.woff') format('woff')," +
        "url('pragmatica/v5/pragmatica-extralight-v4.ttf') format('ttf');" +
        'font-weight: 200; font-style: normal;}';
      const after = processFile(
        {
          slot: 'body:end',
          type: 'style',
          payload: testUrl,
        },
        css
      );

      expect(after).toBe(
        '@font-face {' +
          "font-family: 'pragmatica';" +
          "src: url('https://cdn.domain.com/pragmatica/v5/pragmatica-extralight-v4.woff2')format('woff2')," +
          "url('https://cdn.domain.com/pragmatica/v5/pragmatica-extralight-v4.eot') format('eot')," +
          "url('https://cdn.domain.com/pragmatica/v5/pragmatica-extralight-v4.woff') format('woff')," +
          "url('https://cdn.domain.com/pragmatica/v5/pragmatica-extralight-v4.ttf') format('ttf');" +
          'font-weight: 200; font-style: normal;}'
      );
    });
  });
});
