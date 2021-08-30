import pick from '@tinkoff/utils/object/pick';
import type { BaseStore as BaseStoreInterface } from '@tramvai/types-actions-state-context';
import { SimpleEmitter } from './SimpleEmitter';

export { BaseStoreConstructor } from '@tramvai/types-actions-state-context';

/**
 * @deprecated метод устарел, в замен этого API используй createReducer, который новее и лучше маштабируется
 */
export abstract class BaseStore<State> extends SimpleEmitter implements BaseStoreInterface<State> {
  static storeName: string;

  state: Readonly<State> = Object.create(null);

  hydrateKeys: Record<keyof State, boolean> = Object.create(null);

  dispatcher?: Readonly<Record<string, any>>;

  static handlers: Record<string, Function | string>;

  getState() {
    return this.state;
  }

  dehydrate(): Partial<State> | void {
    return pick(Object.keys(this.hydrateKeys), this.state) as Partial<State>;
  }

  rehydrate(state: State) {
    this.setStateSilently(state);
  }

  protected writeHydrateKeys<K extends keyof State>(state: Pick<State, K> | State) {
    Object.keys(state).forEach((key) => {
      this.hydrateKeys[key as K] = true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  protected shouldStateUpdate<K extends keyof State>(nextState: Pick<State, K> | State): boolean {
    return !!Object.keys(nextState).length;
  }

  protected setState<K extends keyof State>(state: Pick<State, K> | State, force = false) {
    if (force || this.shouldStateUpdate(state)) {
      this.setStateSilently(state);

      this.emit('change');
    }
  }

  protected setStateSilently<K extends keyof State>(state: Pick<State, K> | State) {
    this.state = { ...this.state, ...state };

    this.writeHydrateKeys(state);
  }

  protected replaceState(state: State) {
    this.replaceStateSilently(state);

    this.emit('change');
  }

  // @deprecated нужно использовать replaceState
  protected replaceStateSilently(state: State) {
    this.state = state;

    this.hydrateKeys = Object.create(null);
    this.writeHydrateKeys(state);
  }
}
