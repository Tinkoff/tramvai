import uniq from '@tinkoff/utils/array/uniq';
import difference from '@tinkoff/utils/array/difference';
import toArray from '@tinkoff/utils/array/toArray';
import flatten from '@tinkoff/utils/array/flatten';
import type { PageAction } from '@tramvai/core';
import type { ActionsRegistry as Interface } from '@tramvai/tokens-common';

export const GLOBAL_PARAMETER = '@@global';

export class ActionRegistry implements Interface {
  private actions: Map<string, PageAction[]>;

  constructor({ actionsList }: { actionsList: PageAction[] }) {
    this.actions = new Map([[GLOBAL_PARAMETER, flatten<PageAction>(actionsList)]]);
  }

  add(type: string, actions: PageAction | PageAction[]) {
    const normalized = toArray(actions);

    this.actions.set(
      type,
      uniq(this.actions.has(type) ? [...this.actions.get(type)!, ...normalized] : normalized)
    );
  }

  get(type: string, addingActions?: PageAction[]): PageAction[] {
    return uniq([...(this.actions.get(type) || []), ...(addingActions || [])]);
  }

  getGlobal(): PageAction[] | undefined {
    return this.actions.get(GLOBAL_PARAMETER);
  }

  remove(type: string, actions?: PageAction | PageAction[]) {
    if (!actions) {
      this.actions.delete(type);
      return;
    }

    const normalized = toArray(actions);

    if (this.actions.has(type)) {
      this.actions.set(type, difference(this.actions.get(type)!, normalized));
    }
  }
}
