// @ts-ignore
// eslint-disable-next-line import/no-unresolved
var _ref, _ref1, _ref2;
import { Module, Scope } from '@tramvai/core';
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
@Module({
    providers: [
        (_ref = {
            provide: 'provide',
            // eslint-disable-next-line @typescript-eslint/no-extraneous-class
            useClass: class {
            },
            multi: true,
            deps: {}
        }, Object.defineProperty(_ref, '__stack', {
            enumerable: false,
            value: new globalThis.Error().stack
        }), _ref),
        (_ref1 = {
            provide: 'test',
            useFactory: ()=>{},
            multi: false,
            scope: Scope.SINGLETON
        }, Object.defineProperty(_ref1, '__stack', {
            enumerable: false,
            value: new globalThis.Error().stack
        }), _ref1),
        (_ref2 = {
            provide: 'abc',
            useValue: 3
        }, Object.defineProperty(_ref2, '__stack', {
            enumerable: false,
            value: new globalThis.Error().stack
        }), _ref2)
    ]
})
export class ClassModule {
}
