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

  if (response.status === 500) {
    const pre = parsed.parsed.querySelector('body > pre');
    const [message, ...stack] = pre.innerText.split('&nbsp; &nbsp;');

    throw new Error(`Получена ошибка: ${message}
Проверьте логи сервера в терминале для подробностей об ошибке
Cтек ошибки: ${stack.join('\n\t')}
`);
  }

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
              .replace(/\\\\/g, '\\')
          );
        }
      }

      return null;
    },
  };
};
