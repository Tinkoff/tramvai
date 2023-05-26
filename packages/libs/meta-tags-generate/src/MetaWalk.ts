import eachObj from '@tinkoff/utils/object/each';
import type { TagRecord } from './Meta.h';

export type WalkItem = { value: string | TagRecord; priority: number };

export class MetaWalk {
  state: Map<string, WalkItem>;

  constructor() {
    this.state = new Map();
  }

  eachMeta(func: (value: WalkItem, key: string) => void) {
    this.state.forEach((value, key) => func(value, key));
  }

  updateMeta(priority: number, metaObj: Record<string, string | TagRecord>) {
    eachObj((value, name) => {
      if (!value && value !== null) {
        return;
      }

      const stateMeta = this.state.get(name);

      if (!stateMeta || priority >= stateMeta.priority) {
        if (value === null) {
          this.state.delete(name);
        } else {
          this.state.set(name, { value, priority });
        }
      }
    }, metaObj);

    return this;
  }

  get(key: string) {
    return this.state.get(key);
  }

  reset() {
    this.state.clear();
  }
}
