import { createAction } from '@tramvai/core';
import { set } from '../store';

export const customAction = createAction({
  name: 'customAction',
  fn: (context) => {
    console.log('execute customAction');
    return context.dispatch(set('customAction'));
  },
  // можно задавать свои опции, которые потом используются в своих conditions проверках
  conditions: {
    custom: true,
  },
});
