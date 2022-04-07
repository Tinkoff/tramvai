import type { Options as ParserOptions } from 'node-html-parser';
import { parse } from 'node-html-parser';

export type ParseOptions = Partial<ParserOptions>;

export const parseHtml = (
  html: string,
  parserOptions: ParseOptions = { blockTextElements: { script: false, style: false } }
) => {
  if (!html) {
    return null;
  }

  const parsed = parse(html, parserOptions);

  return {
    parsed,
    body: parsed.querySelector('body')?.innerHTML,
    head: parsed.querySelector('head')?.innerHTML,
    application: parsed.querySelector('.application')?.innerHTML,
  };
};
