import reduceObj from '@tinkoff/utils/object/reduce';
import type { Meta } from './Meta';
import { META_DATA_ATTR } from './constants';
import type { TagRecord } from './Meta.h';

const formatAttr = reduceObj((acc, value, key) => `${acc} ${key}="${value}"`, '');

const htmlConverter = ({ tag, attributes, innerHtml }: TagRecord) => {
  const attr = `${formatAttr(attributes)} ${META_DATA_ATTR}="true"`;

  if (innerHtml) {
    return `<${tag}${attr}>${innerHtml}</${tag}>`;
  }

  return `<${tag}${attr}>`;
};

export class Render {
  meta: Meta;

  constructor(meta: Meta) {
    this.meta = meta;
  }

  render(): string {
    return this.meta.dataCollection().map(htmlConverter).join('\n');
  }
}
