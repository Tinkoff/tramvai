import reduce from '@tinkoff/utils/array/reduce';

const xssPossibleTags = [/<link[^>]+>/gi, /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi];

export const removeXss = (referrer = '') =>
  reduce((newReferrer, regexp) => newReferrer.replace(regexp, ''), referrer, xssPossibleTags);
