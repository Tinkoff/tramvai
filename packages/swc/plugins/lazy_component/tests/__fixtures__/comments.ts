import { lazy } from '@tramvai/react';

lazy(() => import(/* webpackChunkName: 'main' */'./inner/first'))
lazy(() => import(/* stupid comments */'./inner/second'))
lazy(() => import(/* webpackPreload: true */'./inner/third'))

lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "component"  */'./cmp'))
