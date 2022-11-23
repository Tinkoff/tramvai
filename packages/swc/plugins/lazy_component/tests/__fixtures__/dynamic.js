import { lazy } from '@tramvai/react';
lazy({
    chunkName (props) {
        return `inner-${props.name}-js`.replace(/[^a-zA-Z0-9_!§$()=\-^°]+/g, "-");
    },
    requireSync (props) {
        return __webpack_require__(this.resolve(props));
    },
    isReady (props) {
        const key = this.resolve(props);
        return !!__webpack_modules__[key];
    },
    importAsync: (props)=>import(/* webpackChunkName: "inner-[request]" */ `./inner/${props.name}.js`),
    requireAsync (props) {
        return this.importAsync(props).then((resolved)=>{
            return resolved;
        });
    },
    resolve (props) {
        return require.resolveWeak(`./inner/${props.name}.js`);
    }
});
