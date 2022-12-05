// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { Provider, Scope, Error } from '@tramvai/core';

export const providers: Provider[] = [
  {
    provide: 'a',
    useValue: 1,
  },
  {
    provide: 'b',
    multi: true,
    deps: {},
    useFactory: () => {
      console.log(Error);
    },
  },
  {
    provide: 'c',
    scope: Scope.SINGLETON,
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    useClass: class {},
  },
];
