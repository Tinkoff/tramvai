import testString from '@tinkoff/utils/string/test';
import eachObj from '@tinkoff/utils/object/each';
import each from '@tinkoff/utils/array/each';

export const isAbsoluteUrl = testString(/^(?:[a-z]+:)?\/\//i);
export const isInvalidUrl = (url: string) => {
  if (url.length < 2) {
    return false;
  }

  for (let index = 0; index < url.length; index++) {
    switch (url[index]) {
      case '?':
        return true;
      case '/':
        break;
      default:
        return false;
    }
  }

  return true;
};

const getDefaultBaseUrl = () =>
  typeof window === 'undefined' ? 'http://localhost/' : window.location.href;

export type Query = Record<string, string | string[]>;
export type UrlString = string | URL;
export type Url = Omit<URL, 'toJSON' | 'searchParams'> & {
  query: Query;
  path: string;
  toString: () => string;
};
export type FormatParams = Partial<Omit<Url, 'toString' | 'searchParams'>>;

export const getPath = (url: { pathname: string; search: string; hash: string }) => {
  return url.pathname + url.search + url.hash;
};

export const convertRawUrl = (url: URL): Url => {
  const query = Object.create(null);

  url.searchParams.forEach((value, key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!Object.prototype.hasOwnProperty.call(query, key)) {
      query[key] = value;
    } else if (Array.isArray(query[key])) {
      query[key].push(value);
    } else {
      query[key] = [query[key], value];
    }
  });

  const str = url.toString();
  const path = getPath(url);

  const result = {
    href: path,
    origin: url.origin,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    port: url.port,
    pathname: url.pathname,
    path,
    search: url.search,
    hash: url.hash,
    query,
  };

  if (url.host !== 'localhost') {
    Object.assign(result, {
      href: url.href,
      host: url.host,
      hostname: url.hostname,
    });
  }

  Object.defineProperty(result, 'toString', {
    value: () => str,
    enumerable: false,
  });

  return result as Url;
};
export const rawParse = (url: string, baseUrl: UrlString = getDefaultBaseUrl()) => {
  return new URL(isInvalidUrl(url) ? url.replace(/^\/+/, '/') : url, baseUrl);
};
export const parse = (url: string) => {
  return convertRawUrl(rawParse(url));
};

export const rawResolveUrl = (baseUrl: UrlString, url: string) => {
  const absoluteBaseUrl = rawParse(baseUrl.toString());

  return rawParse(url, absoluteBaseUrl);
};

export const resolveUrl = (baseUrl: UrlString, url: string) => {
  return convertRawUrl(rawResolveUrl(baseUrl, url));
};

export const resolve = (baseUrl: string, url: string) => {
  const absoluteBaseUrl = rawParse(baseUrl);
  const parsed = rawParse(url, absoluteBaseUrl);

  if (isAbsoluteUrl(baseUrl)) {
    return parsed.href;
  }

  return getPath(parsed);
};

const pathPattern = /^(\/[^?\s]*)(\?[^\s]*)?(#[^s]*)?$/;

export const fromPath = (path: string) => {
  const exec = pathPattern.exec(path);

  if (exec) {
    const [_, pathname, search = '', hash = ''] = exec;

    return {
      pathname,
      search,
      hash,
    };
  }
};

const fillSearchParamsWithQuery = (searchParams: URLSearchParams, query: Query) => {
  eachObj((vs, k) => {
    if (Array.isArray(vs)) {
      searchParams.delete(k);
      each((v) => searchParams.append(k, v), vs);
    } else if (typeof vs === 'undefined') {
      searchParams.delete(k);
    } else {
      searchParams.set(k, vs);
    }
  }, query);
};

export const addQuery = (url: UrlString, query: Query) => {
  const parsed = rawParse(url.toString());

  fillSearchParamsWithQuery(parsed.searchParams, query);

  return convertRawUrl(parsed);
};

/* eslint-disable no-param-reassign */
export const rawAssignUrl = (url: URL, params: FormatParams) => {
  const { href, path, query, origin, port, username, password, ...rest } = params;

  if (path) {
    const parsedPath = fromPath(path);

    if (parsedPath) {
      Object.assign(url, parsedPath);
    }
  }

  //
  // проблема в Edge:
  //
  // даже если в `username` или `password` пустая строка,
  // `Object.assign(url, rest)` обновляет эти свойства в url,
  // и браузер запрещает доступ к некоторым полям,
  // что вызывает ошибку при чтении данных через `url.toString()`
  //
  // пример похожей проблемы - https://stackoverflow.com/questions/52737606/why-do-i-get-permission-denied-on-constructing-url-in-edge
  //
  if (username) {
    url.username = username;
  }
  if (password) {
    url.password = password;
  }

  // убираем на всякий случай все параметры которые могут вызвать ошибку при присваивании
  // в объект Url, например, чтобы явно не скрывать их при работе с результатом вызова parse
  Object.assign(url, rest);

  if (typeof port !== 'undefined') {
    url.port = port;

    // в некоторых браузерах встречается баг, что если port === '0', то в порте выставляется "0" что в итоге приводит к невалидному урлу
    // выставляем порт по умолчанию в зависимости от протокола https://url.spec.whatwg.org/#default-port
    if (url.port === '0') {
      url.port = url.protocol === 'http:' ? '80' : '443';
    }
  }

  if (query) {
    const searchParams = new URLSearchParams(params.search);

    fillSearchParamsWithQuery(searchParams, query);

    url.search = searchParams.toString();
  }

  return url;
};
/* eslint-enable no-param-reassign */

export const format = (params: FormatParams) => {
  const url = rawParse('');

  return convertRawUrl(rawAssignUrl(url, params)).href;
};
