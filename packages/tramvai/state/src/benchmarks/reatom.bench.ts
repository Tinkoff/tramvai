import range from '@tinkoff/utils/array/range';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Atom } from '@reatom/core';
import { declareAction, declareAtom, combine, createStore } from '@reatom/core';

const generateAtom = (name) => {
  const atomName = `${name} atom`;

  const action = declareAction<number>(`${name} update event`);

  const atom = declareAtom(atomName, 0, (on) => [on(action, (state, payload) => payload)]);

  return {
    action,
    atom,
    name: atomName,
  };
};

const atomsAndActions = range(0, 100).map((id) => generateAtom(id));
const atomsSlice = atomsAndActions.reduce((slice, { atom, name }) => {
  // eslint-disable-next-line no-param-reassign
  slice[name] = atom;
  return slice;
}, {} as Record<string, Atom<any>>);
const actions = atomsAndActions.map(({ action }) => action);
const preloadedStore = createStore(combine(atomsSlice));
let currentPayload = 1;

export const reatom = {
  createAtoms() {
    range(0, 100).map((id) => generateAtom(id));
  },
  createStore() {
    createStore(combine(atomsSlice));
  },
  dispatchOne() {
    preloadedStore.dispatch(actions[0](currentPayload++));
  },
  dispatchMany() {
    actions.forEach((action) => {
      preloadedStore.dispatch(action(currentPayload++));
    });
  },
  subscriptions() {
    atomsAndActions.forEach(({ atom }) => {
      let state = preloadedStore.getState(atom);

      preloadedStore.subscribe(atom, () => {
        const nextState = preloadedStore.getState(atom);

        if (state !== nextState) {
          state = nextState;
        }
      });
    });

    preloadedStore.dispatch(actions[0](currentPayload++));
  },
};
