// @ts-ignore
// eslint-disable-next-line import/no-unresolved
var _ref0;
import { Provider } from '@tramvai/core';
export const providers: Provider[] = [
    (_ref0 = {
        provide: 'a',
        useFactory: ()=>{}
    }, Object.defineProperty(_ref0, '__stack', {
        enumerable: false,
        value: new globalThis.Error().stack
    }), _ref0)
];