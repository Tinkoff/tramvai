// @ts-ignore
// eslint-disable-next-line import/no-unresolved
var _ref, _ref1, _ref2;
import { Provider, Scope } from '@tramvai/core';
export const providers: Provider[] = [
    (_ref = {
        provide: 'a',
        useValue: 1
    }, Object.defineProperty(_ref, '__stack', {
        enumerable: false,
        value: new globalThis.Error().stack
    }), _ref),
    (_ref1 = {
        provide: 'b',
        multi: true,
        deps: {},
        useFactory: ()=>{}
    }, Object.defineProperty(_ref1, '__stack', {
        enumerable: false,
        value: new globalThis.Error().stack
    }), _ref1),
    (_ref2 = {
        provide: 'c',
        scope: Scope.SINGLETON,
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        useClass: class {
        }
    }, Object.defineProperty(_ref2, '__stack', {
        enumerable: false,
        value: new globalThis.Error().stack
    }), _ref2)
];
