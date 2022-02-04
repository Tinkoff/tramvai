import type { ParseOptions } from './parseHtml';
import { parseHtml } from './parseHtml';
import type { requestFactory } from './request';

export const renderFactory = (request: ReturnType<typeof requestFactory>) => async (
  path: string,
  {
    method = 'get',
    parserOptions,
  }: { method?: 'get' | 'post' | 'put'; parserOptions?: ParseOptions } = {}
) => {
  const response = await request(path, { method });
  const parsed = parseHtml(response.text, parserOptions);

  return {
    ...parsed,
    get initialState() {
      const parsedWithScripts = parseHtml(response.text, {}).parsed;
      const scripts = parsedWithScripts.querySelectorAll('body > script');

      for (const script of scripts) {
        if (script.innerHTML.startsWith('var initialState')) {
          return JSON.parse(
            script.innerHTML
              .replace("var initialState = '", '')
              .replace(/'$/, '')
              .replace(/'/g, "\\\\'")
              .replace(/\\\\/g, '\\')
          );
        }
      }

      return null;
    },
  };
};
