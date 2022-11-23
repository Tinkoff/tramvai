import { lazy } from '@tramvai/react';
lazy({
    chunkName () {
        return "inner-path-cmp";
    },
    requireSync (props) {
        return __webpack_require__(this.resolve(props));
    },
    isReady (props) {
        const key = this.resolve(props);
        return !!__webpack_modules__[key];
    },
    importAsync: ()=>import(/* webpackChunkName: "inner-path-cmp" */ './inner/path/cmp'),
    requireAsync (props) {
        return this.importAsync(props).then((resolved)=>{
            return resolved;
        });
    },
    resolve () {
        return require.resolveWeak('./inner/path/cmp');
    }
});
