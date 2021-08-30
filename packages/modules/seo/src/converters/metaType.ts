import curryN from '@tinkoff/utils/function/curryN';
import type { TagRecord } from '@tinkoff/meta-tags-generate';

export const metaInnerHtml = curryN(
  2,
  (tag: string, innerHtml: string): TagRecord => innerHtml && { tag, innerHtml }
);
export const metaName = curryN(
  2,
  (name: string, content: string): TagRecord =>
    content && { tag: 'meta', attributes: { name, content } }
);
export const metaProperty = curryN(
  2,
  (property: string, content: string): TagRecord =>
    content && { tag: 'meta', attributes: { property, content } }
);
export const metaLink = curryN(
  2,
  (rel: string, href: string): TagRecord => href && { tag: 'link', attributes: { rel, href } }
);
