// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { module, Scope } from '@tramvai/core';

@module({
  providers: [
    {
      provide: 'provide',
      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      useClass: class {},
      multi: true,
      deps: {},
    },
    {
      provide: 'test',
      useFactory: () => {},
      multi: false,
      scope: Scope.SINGLETON,
    },
    {
      provide: 'abc',
      useValue: 3,
    },
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ClassModule {}
