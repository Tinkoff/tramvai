export const func = async ()=>{
    var _ref, _ref1;
    await Promise.resolve([
        (_ref = {
            provide: 'a',
            useValue: 'a'
        }, Object.defineProperty(_ref, '__stack', {
            enumerable: false,
            value: new globalThis.Error().stack
        }), _ref),
        (_ref1 = {
            provide: 'b',
            useValue: 'b'
        }, Object.defineProperty(_ref1, '__stack', {
            enumerable: false,
            value: new globalThis.Error().stack
        }), _ref1)
    ]);
};
