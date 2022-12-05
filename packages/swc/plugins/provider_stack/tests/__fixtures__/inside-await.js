var _ref0, _ref1;
export const func = async ()=>{
    await Promise.resolve([
        (_ref0 = {
            provide: 'a',
            useValue: 'a'
        }, Object.defineProperty(_ref0, '__stack', {
            enumerable: false,
            value: new globalThis.Error().stack
        }), _ref0),
        (_ref1 = {
            provide: 'b',
            useValue: 'b'
        }, Object.defineProperty(_ref1, '__stack', {
            enumerable: false,
            value: new globalThis.Error().stack
        }), _ref1)
    ]);
};
