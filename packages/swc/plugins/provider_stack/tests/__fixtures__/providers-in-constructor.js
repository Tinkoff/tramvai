const DI_TOKEN = "token";
export class Container {
    constructor(){
        var _ref;
        this.register((_ref = {
            provide: DI_TOKEN,
            useValue: this
        }, Object.defineProperty(_ref, '__stack', {
            enumerable: false,
            value: new globalThis.Error().stack
        }), _ref));
    }
    register(provider) {}
}
