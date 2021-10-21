import { createAction } from '@tramvai/core';
import { set } from '../store';

export const customAction = createAction({
  name: 'customAction',
  fn: (context) => {
    console.log('execute customAction');
    return context.dispatch(set('customAction'));
  },
  // you can set your own options, which are then used in their conditions checks
  conditions: {
    custom: true,
  },
});
