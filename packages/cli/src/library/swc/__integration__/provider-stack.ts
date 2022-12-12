import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { TEST_TOKEN } from './create-token-pure';

export const providers: Provider[] = [
  provide({
    provide: TEST_TOKEN,
    useValue: 'test',
  }),
];
