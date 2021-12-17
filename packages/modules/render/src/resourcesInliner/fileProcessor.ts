import { resolve } from '@tinkoff/url';
import startsWith from '@tinkoff/utils/string/startsWith';
import type { PageResource } from '@tramvai/tokens-render';
import { ResourceType } from '@tramvai/tokens-render';

export const URL_OCCURRENCES_RE = /(url\((['"]?))(.*?)(\2\))/gi;

const isAbsoluteUrl = (resourceUrl) =>
  ['http://', 'https://', '//'].some((prefix) => startsWith(prefix, resourceUrl));

const toHttpsUrl = (resourceUrl) => {
  if (resourceUrl.indexOf('//localhost') !== -1) {
    return resourceUrl;
  }

  if (startsWith('http://', resourceUrl)) {
    return resourceUrl.replace('http://', 'https://');
  }
  if (startsWith('//', resourceUrl)) {
    return resourceUrl.replace('//', 'https://');
  }

  return resourceUrl;
};

const urlReplacerCreator = (resourceUrl) => (str, leftGroup, _, extractedUrl, rightGroup) => {
  return isAbsoluteUrl(extractedUrl)
    ? str
    : `${leftGroup}${resolve(toHttpsUrl(resourceUrl), extractedUrl)}${rightGroup}`;
};

export const processFile = (resource: PageResource, file: string) => {
  if (resource.type === ResourceType.style) {
    return file.replace(URL_OCCURRENCES_RE, urlReplacerCreator(resource.payload));
  }
  return file;
};
