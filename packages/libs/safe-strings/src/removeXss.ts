import reduce from '@tinkoff/utils/array/reduce';

const xssPossibleTags = [/<link[^>]+>/gi, /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi];

/**
 * @deprecated cover a limited number of cases, use `encodeForHTMLContext` instead
 */
export const removeXss = (referrer = '') =>
  reduce((newReferrer, regexp) => newReferrer.replace(regexp, ''), referrer, xssPossibleTags);
