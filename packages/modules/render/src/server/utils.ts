import type { HTML_ATTRS } from '@tramvai/tokens-render';

export const formatAttributes = (
  htmlAttrs: Array<typeof HTML_ATTRS>,
  target: 'html' | 'body' | 'app'
) => {
  if (!htmlAttrs) {
    return '';
  }

  const targetAttrs = htmlAttrs.filter((item) => item.target === target);
  const collectedAttrs = targetAttrs.reduce((acc, item) => ({ ...acc, ...item.attrs }), {});

  const attrsString = Object.keys(collectedAttrs).reduce((acc, name) => {
    if (collectedAttrs[name] === true) {
      return `${acc} ${name}`;
    }

    return `${acc} ${name}="${collectedAttrs[name]}"`;
  }, '');

  return attrsString.trim();
};
