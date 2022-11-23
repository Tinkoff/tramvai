import { lazy } from '@tramvai/react';
lazy({
    chunkName () {
        return "cmp";
    },
    requireSync (props) {
        return __webpack_require__(this.resolve(props));
    },
    isReady (props) {
        const key = this.resolve(props);
        return !!__webpack_modules__[key];
    },
    importAsync: ()=>import(/* webpackChunkName: "cmp" */ './cmp'),
    requireAsync (props) {
        return this.importAsync(props).then((resolved)=>{
            return resolved;
        });
    },
    resolve () {
        return require.resolveWeak('./cmp');
    }
});
