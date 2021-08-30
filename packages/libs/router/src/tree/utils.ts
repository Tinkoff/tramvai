import map from '@tinkoff/utils/array/map';
import {
  PARAMETER_DELIMITER,
  HISTORY_FALLBACK_REGEXP,
  WILDCARD_REGEXP,
  PARAM_PARSER_REGEXP,
} from './constants';
import type { Parameter, ParsedPath } from './types';
import { PartType } from './types';
import type { Params } from '../types';
import { normalizeTrailingSlash } from '../utils';

export const getParts = (pathname: string) =>
  pathname
    .split('/')
    .slice(pathname.startsWith('/') ? 1 : 0, pathname.endsWith('/') ? -1 : Infinity);

export const isHistoryFallback = (part: string) => {
  return HISTORY_FALLBACK_REGEXP.test(part);
};

export const isWildcard = (part: string) => {
  return WILDCARD_REGEXP.test(part);
};

export const isParameterized = (part: string) => {
  return part.includes(PARAMETER_DELIMITER);
};

const parseParameter = (part: string): Parameter => {
  const [prefix = '', param, postfix = ''] = part.split(PARAMETER_DELIMITER);

  const match = PARAM_PARSER_REGEXP.exec(param);

  if (!match) {
    throw new Error('parameters should satisfy pattern "prefix:paramName(regexp)\\?:postfix"');
  }

  const [, paramName, regexp, optional] = match;
  const useRegexp = prefix || postfix || regexp;

  return {
    type: PartType.parameter,
    paramName,
    regexp: useRegexp
      ? new RegExp(`^${prefix}(${regexp || '.+'})${optional ? '?' : ''}${postfix}$`)
      : undefined,
    optional: !!optional && !prefix && !postfix,
  };
};

export const parse = (part: string): ParsedPath => {
  if (isHistoryFallback(part)) {
    return { type: PartType.historyFallback };
  }

  if (isWildcard(part)) {
    return { type: PartType.wildcard };
  }

  if (isParameterized(part)) {
    return parseParameter(part);
  }

  return { type: PartType.literal, value: part };
};

export const makePath = (pathname: string, params: Params) => {
  const parts = getParts(pathname);

  const result = map((part: string) => {
    if (isHistoryFallback(part) || isWildcard(part)) {
      throw new Error(
        `Pathname should be only a string with dynamic parameters, not a special string, got ${pathname}`
      );
    }

    if (isParameterized(part)) {
      const [prefix = '', param = '', postfix = ''] = part.split(PARAMETER_DELIMITER);
      const match = PARAM_PARSER_REGEXP.exec(param);

      if (!match) {
        throw new Error('parameters should satisfy pattern "prefix:paramName(regexp)\\?:postfix"');
      }

      const [, paramName, regexp, optional] = match;
      const value = params[paramName]?.toString();

      if (optional && !value) {
        return '';
      }

      if (!value) {
        throw new Error(`value for parameter for ${paramName} should be defined in params`);
      }

      if (regexp && !new RegExp(regexp).test(value)) {
        throw new Error(
          `passed parameter for ${paramName} should satisfy regxep: ${regexp}, got: ${value}`
        );
      }

      return prefix + value + postfix || part;
    }

    return part;
  }, parts).join('/');

  return normalizeTrailingSlash(`/${result}`, pathname.endsWith('/'));
};
