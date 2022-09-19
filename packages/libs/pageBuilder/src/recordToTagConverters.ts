import reduceObj from '@tinkoff/utils/object/reduce';
import mapObj from '@tinkoff/utils/object/map';
import prop from '@tinkoff/utils/object/prop';
import { StorageRecord } from './constants/records';

type PageResource = {
  payload: string | null;
  attrs?: Record<string, string | null>;
};

const VOID_TAGS = new Set(['link']);

const formatAttr = reduceObj((acc, value: string | null, key) => {
  if (key && value) {
    return `${acc} ${key}="${value}"`;
  }

  if (value === null) {
    return acc;
  }

  return `${acc} ${key}`;
}, '');

const format = ({
  tag,
  attributes,
  innerHtml,
}: {
  tag: string;
  attributes?: Record<string, string>;
  innerHtml?: string;
}) => {
  const attr = `${formatAttr(attributes)}`;

  if (VOID_TAGS.has(tag)) {
    return `<${tag}${attr}>`;
  }

  if (innerHtml) {
    return `<${tag}${attr}>${innerHtml}</${tag}>`;
  }

  return `<${tag}${attr}></${tag}>`;
};

const converters = {
  [StorageRecord.asIs]: prop('payload'),
  [StorageRecord.iconLink]: ({ payload, attrs }: PageResource) => ({
    tag: 'link',
    attributes: {
      ...attrs,
      href: payload,
    },
  }),
  [StorageRecord.meta]: prop('payload'),
  [StorageRecord.inlineScript]: ({ payload, attrs }: PageResource) => {
    // проверям инлайновые скрипты на es5 т.к. пока поддерживаем старые браузеры
    if (process.env.NODE_ENV === 'development' && typeof window === 'undefined' && payload) {
      try {
        require('acorn').parse(payload, { ecmaVersion: 5 });
      } catch (e) {
        console.error('ES5 incompatibility in inline script!', '\n', payload, '\n', e);
      }
    }

    return {
      tag: 'script',
      innerHtml: payload,
      attributes: attrs,
    };
  },
  [StorageRecord.script]: ({ payload, attrs }: PageResource) => ({
    tag: 'script',
    attributes: {
      defer: 'defer',
      charset: 'utf-8',
      crossorigin: 'anonymous',
      ...attrs,
      src: payload,
    },
  }),
  [StorageRecord.preconnectLink]: ({ payload, attrs }: PageResource) => ({
    tag: 'link',
    attributes: {
      ...attrs,
      rel: 'preconnect',
      href: payload,
    },
  }),
  [StorageRecord.preloadLink]: ({ payload, attrs }: PageResource) => ({
    tag: 'link',
    attributes: {
      charset: 'utf-8',
      ...attrs,
      rel: 'preload',
      href: payload,
    },
  }),
  [StorageRecord.inlineStyle]: ({ payload }: PageResource) => ({
    tag: 'style',
    attributes: {
      type: 'text/css',
    },
    innerHtml: payload,
  }),
  [StorageRecord.style]: ({ payload, attrs }: PageResource) => ({
    tag: 'link',
    attributes: {
      ...attrs,
      rel: 'stylesheet',
      href: payload,
    },
  }),
};

export const recordToTagConverters = mapObj(
  (converter) =>
    (...args: unknown[]) => {
      const result = converter(...args);
      return typeof result === 'string' ? result : format(result);
    },
  converters as any
);
