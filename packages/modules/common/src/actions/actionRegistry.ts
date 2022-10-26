import uniq from '@tinkoff/utils/array/uniq';
import difference from '@tinkoff/utils/array/difference';
import toArray from '@tinkoff/utils/array/toArray';
import flatten from '@tinkoff/utils/array/flatten';
import type { Action } from '@tramvai/core';
import type { ActionsRegistry as Interface } from '@tramvai/tokens-common';

export const GLOBAL_PARAMETER = '@@global';

export class ActionRegistry implements Interface {
  private actions: Map<string, Action[]>;

  constructor({ actionsList }: { actionsList: Action[] }) {
    this.actions = new Map([[GLOBAL_PARAMETER, flatten<Action>(actionsList)]]);
  }

  add(type: string, actions: Action | Action[]) {
    const normalized = toArray(actions);

    this.actions.set(
      type,
      uniq(this.actions.has(type) ? [...this.actions.get(type)!, ...normalized] : normalized)
    );
  }

  get(type: string, addingActions?: Action[]): Action[] {
    return uniq([...(this.actions.get(type) || []), ...(addingActions || [])]);
  }

  getGlobal(): Action[] | undefined {
    return this.actions.get(GLOBAL_PARAMETER);
  }

  remove(type: string, actions?: Action | Action[]) {
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
