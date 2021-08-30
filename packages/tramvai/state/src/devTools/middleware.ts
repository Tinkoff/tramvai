import pick from '@tinkoff/utils/object/pick';

import type { Middleware } from '../dispatcher/dispatcher.h';
import { devTools } from './devTools';
import { DISPATCH } from './constants';

interface Options {
  pickState?: string[]; // список ключей которые будут отображаться в сторе девтулз
}

export const middleware = ({ pickState }: Options = {}): Middleware => (api) => (next) => {
  const getState =
    pickState && pickState.length ? () => pick(pickState, api.getState()) : api.getState;

  // TODO: типизировать message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  devTools.subscribe((message: any) => {
    if (message.type === 'DISPATCH' && message.state) {
      switch (message.payload.type) {
        case 'RESET':
        case 'COMMIT':
        case 'ROLLBACK':
        case 'JUMP_TO_STATE':
        case 'JUMP_TO_ACTION':
        case 'TOGGLE_ACTION':
        case 'IMPORT_STATE':
        default:
        // TODO: имплементировать все возможные действия из DevTools
      }
    } else if (message.type === 'ACTION' && message.payload) {
      try {
        // eslint-disable-next-line no-new-func
        const action = new Function(`return ${message.payload}`)();
        api.dispatch(action);
      } catch (e) {
        devTools.error(e.message);
      }
    }
  });

  devTools.init(getState());

  return (event) => {
    const result = next(event);

    devTools.send(
      {
        type: `${DISPATCH} ${event.type}`,
        event,
      },
      getState()
    );

    return result;
  };
};
