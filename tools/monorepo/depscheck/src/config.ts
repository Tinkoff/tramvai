import pickBy from '@tinkoff/utils/object/pickBy';
import keyBy from '@tinkoff/utils/object/keyBy';
import compose from '@tinkoff/utils/function/compose';
// @ts-ignore
import { defaultOptions as depcheckDefaultOptions } from 'depcheck/dist/constants';
import type { Config } from './types';
import { parseCssModule } from './parsers/cssModules';
import { toLowerFirst } from './utils';

export function getDepcheckConfig(config: Config) {
  const testRe = /^depcheck-?/;
  return {
    ...compose(
      keyBy((v, k: string) => toLowerFirst(k.replace(testRe, ''))),
      pickBy((v, k) => testRe.test(k))
    )(config),
    parsers: {
      ...depcheckDefaultOptions.parsers,
      '*.css': parseCssModule,
    },
  };
}

export function getCollectorConfig(config: Config) {
  const testRe = /^collectorConfig|^collector-config-/;
  return compose(
    keyBy((v, k: string) => toLowerFirst(k.replace(testRe, ''))),
    pickBy((v, k) => testRe.test(k))
  )(config);
}
