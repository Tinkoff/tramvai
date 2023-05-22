import type { ParseOptions } from './parseHtml';
import { parseHtml } from './parseHtml';
import type { requestFactory } from './request';

export const renderFactory =
  (
    request: ReturnType<typeof requestFactory>,
    {
      replaceDynamicStrings = {},
    }: {
      replaceDynamicStrings?: Record<string, string>;
    } = {}
  ) =>
  async (
    path: string,
    {
      method = 'get',
      parserOptions,
    }: {
      method?: 'get' | 'post' | 'put';
      parserOptions?: ParseOptions;
    } = {}
  ) => {
    const response = await request(path, { method });
    let { text } = response;

    for (const key in replaceDynamicStrings) {
      text = text.replace(new RegExp(key, 'g'), replaceDynamicStrings[key]);
    }

    const parsed = parseHtml(text, parserOptions);

    if (!parsed) {
      throw new Error(`Cannot parse response
  got response:
    status: ${response.statusCode}
    content: ${response.text}`);
    }

    return {
      ...parsed,
      get initialState() {
        const parsedWithScripts = parseHtml(text, {})?.parsed;

        if (!parsedWithScripts) {
          return;
        }

        return JSON.parse(
          parsedWithScripts.querySelector('#__TRAMVAI_STATE__')?.textContent ?? 'null'
        );
      },
    };
  };
