import { lazy } from '@tramvai/react';
// @TODO: this test is not working properly on swc
// as there is no react-refresh plugin
// after enabling react-refresh update the snapshot
// and compare with original babel plugin snapshot
const MainPage = lazy({
    chunkName () {
        return "inner-first";
    },
    requireSync (props) {
        return __webpack_require__(this.resolve(props));
    },
    isReady (props) {
        const key = this.resolve(props);
        return !!__webpack_modules__[key];
    },
    importAsync: ()=>import(/* webpackChunkName: "inner-first" */ './inner/first'),
    requireAsync (props) {
        return this.importAsync(props).then((resolved)=>{
            return resolved;
        });
    },
    resolve () {
        return require.resolveWeak('./inner/first');
    }
});
