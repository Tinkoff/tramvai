import identity from '@tinkoff/utils/function/identity';
import isArray from '@tinkoff/utils/is/array';
import has from '@tinkoff/utils/object/has';
import { MetaWalk } from './MetaWalk';
import type { TagRecord, ListSources, TransformValue, Converter } from './Meta.h';

const defaultConverter = (value: TagRecord | string): TagRecord | null =>
  has('tag', value) ? (value as TagRecord) : null;

export class Meta {
  private listSources: ListSources;

  private transformValue: TransformValue;

  private converters: Record<string, Converter>;

  metaWalk: MetaWalk;

  constructor({
    list,
    transformValue = identity,
    converters = {},
    metaWalk,
  }: {
    list: ListSources;
    transformValue?: TransformValue;
    converters?: Record<string, Converter>;
    metaWalk?: MetaWalk;
  }) {
    this.listSources = list;
    this.transformValue = transformValue;
    this.converters = converters;

    this.metaWalk = metaWalk ?? new MetaWalk();
  }

  dataCollection(...args: any[]) {
    this.listSources.map((fn) => fn(this.metaWalk, ...args));

    let result: TagRecord[] = [];

    this.metaWalk.eachMeta((val, key) => {
      const value = this.transformValue(val);
      const converter = this.converters[key];
      const res = (converter || defaultConverter)(value.value);

      if (res) {
        result = result.concat(isArray(res) ? res.filter(identity) : res);
      }
    });

    this.metaWalk.reset();

    return result;
  }
}
