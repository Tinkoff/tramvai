import { lazy } from '@tramvai/react';
lazy({
    chunkName () {
        return "main";
    },
    requireSync (props) {
        return __webpack_require__(this.resolve(props));
    },
    isReady (props) {
        const key = this.resolve(props);
        return !!__webpack_modules__[key];
    },
    importAsync: ()=>import(/* webpackChunkName: "main" */ './inner/first'),
    requireAsync (props) {
        return this.importAsync(props).then((resolved)=>{
            return resolved;
        });
    },
    resolve () {
        return require.resolveWeak('./inner/first');
    }
});
lazy({
    chunkName () {
        return "inner-second";
    },
    requireSync (props) {
        return __webpack_require__(this.resolve(props));
    },
    isReady (props) {
        const key = this.resolve(props);
        return !!__webpack_modules__[key];
    },
    importAsync: ()=>import(/* stupid comments */ /* webpackChunkName: "inner-second" */ './inner/second'),
    requireAsync (props) {
        return this.importAsync(props).then((resolved)=>{
            return resolved;
        });
    },
    resolve () {
        return require.resolveWeak('./inner/second');
    }
});
lazy({
    chunkName () {
        return "inner-third";
    },
    requireSync (props) {
        return __webpack_require__(this.resolve(props));
    },
    isReady (props) {
        const key = this.resolve(props);
        return !!__webpack_modules__[key];
    },
    importAsync: ()=>import(/* webpackPreload: true */ /* webpackChunkName: "inner-third" */ './inner/third'),
    requireAsync (props) {
        return this.importAsync(props).then((resolved)=>{
            return resolved;
        });
    },
    resolve () {
        return require.resolveWeak('./inner/third');
    }
});
lazy({
    chunkName () {
        return "component";
    },
    requireSync (props) {
        return __webpack_require__(this.resolve(props));
    },
    isReady (props) {
        const key = this.resolve(props);
        return !!__webpack_modules__[key];
    },
    importAsync: ()=>import(/* webpackChunkName: "component", webpackPrefetch: true */ './cmp'),
    requireAsync (props) {
        return this.importAsync(props).then((resolved)=>{
            return resolved;
        });
    },
    resolve () {
        return require.resolveWeak('./cmp');
    }
});
