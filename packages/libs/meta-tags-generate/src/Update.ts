import eachObj from '@tinkoff/utils/object/each';
import type { Meta } from './Meta';
import { META_DATA_ATTR } from './constants';
import type { TagRecord } from './Meta.h';

const create = ({ tag, attributes, innerHtml }: TagRecord) => {
  const newElement = document.createElement(tag);

  if (innerHtml) {
    newElement.innerHTML = innerHtml;
  }

  attributes &&
    eachObj((value, key) => {
      newElement.setAttribute(key, value || '');
    }, attributes);

  newElement.setAttribute(META_DATA_ATTR, 'true');

  return newElement;
};

export class Update {
  meta: Meta;

  constructor(meta: Meta) {
    this.meta = meta;
  }

  update() {
    const head = document.head || document.querySelector('head');
    const addTags = this.meta.dataCollection().map(create);
    const removeTags = head.querySelectorAll(`[${META_DATA_ATTR}]`);

    const fragment = document.createDocumentFragment();

    [].slice.call(removeTags).forEach((tag) => head.removeChild(tag));
    addTags.forEach((tag) => fragment.appendChild(tag));

    head.insertBefore(fragment, head.firstChild);
  }
}
