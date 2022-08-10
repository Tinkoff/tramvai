import { declareAction } from '@tramvai/core';
import { set } from '../store';

export const customAction = declareAction({
  name: 'customAction',
  fn() {
    console.log('execute customAction');
    return this.dispatch(set('customAction'));
  },
  // you can set your own options, which are then used in their conditions checks
  conditions: {
    custom: true,
  },
});
