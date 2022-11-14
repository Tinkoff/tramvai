"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3899],{3905:(e,n,r)=>{r.d(n,{Zo:()=>u,kt:()=>f});var t=r(7294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=t.createContext({}),c=function(e){var n=t.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(p.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=c(r),f=o,m=d["".concat(p,".").concat(f)]||d[f]||l[f]||i;return r?t.createElement(m,s(s({ref:n},u),{},{components:r})):t.createElement(m,s({ref:n},u))}));function f(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=r.length,s=new Array(i);s[0]=d;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:o,s[1]=a;for(var c=2;c<i;c++)s[c]=r[c];return t.createElement.apply(null,s)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2417:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>u,contentTitle:()=>p,default:()=>f,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var t=r(7462),o=r(3366),i=(r(7294),r(3905)),s=["components"],a={},p=void 0,c={unversionedId:"references/tokens/server",id:"references/tokens/server",title:"server",description:"Tramvai tokens for integration and extending server module.",source:"@site/tmp-docs/references/tokens/server.md",sourceDirName:"references/tokens",slug:"/references/tokens/server",permalink:"/tramvai/docs/references/tokens/server",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/tokens/server.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"router",permalink:"/tramvai/docs/references/tokens/router"},next:{title:"build",permalink:"/tramvai/docs/references/tools/build"}},u={},l=[{value:"Tokens",id:"tokens",level:2}],d={toc:l};function f(e){var n=e.components,r=(0,o.Z)(e,s);return(0,i.kt)("wrapper",(0,t.Z)({},d,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Tramvai tokens for integration and extending ",(0,i.kt)("a",{parentName:"p",href:"/tramvai/docs/references/modules/server"},"server module"),"."),(0,i.kt)("h2",{id:"tokens"},"Tokens"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import type { Server } from 'http';\nimport { createToken } from '@tinkoff/dippy';\nimport type { Papi } from '@tramvai/papi';\n\ndeclare module '@tramvai/papi' {\n  export interface Options {\n    schema?: {\n      body?: unknown;\n      query?: unknown;\n      params?: unknown;\n      headers?: unknown;\n      response?: unknown;\n    };\n  }\n}\n\n/**\n * @description\n * Specifies base url for public papi handlers. By default equals to `/[appName]/papi`\n */\nexport const SERVER_MODULE_PAPI_PUBLIC_URL = createToken<string>('serverModulePapiPublicUrl');\n\n/**\n * @description\n * Specifies base url for private papi handlers. By default equals `/[appName]/private/papi`\n */\nexport const SERVER_MODULE_PAPI_PRIVATE_URL = createToken<string>('serverModulePapiPrivateUrl');\n\n/**\n * @description\n * Add private papi route\n */\nexport const SERVER_MODULE_PAPI_PRIVATE_ROUTE = createToken<Papi>('serverModulePapiPrivateRoute', {\n  multi: true,\n});\n\n/**\n * @description\n * Add public papi route\n */\nexport const SERVER_MODULE_PAPI_PUBLIC_ROUTE = createToken<Papi>('serverModulePapiPublicRoute', {\n  multi: true,\n});\n\n/**\n * @description\n * Settings for the static server\n */\nexport const SERVER_MODULE_STATICS_OPTIONS = createToken<ServerModuleStaticsOptions>(\n  'serverModuleStaticsOptions'\n);\n\n/**\n * @description\n * Instance of nodejs `http.Server`.\n * Can be used for adding custom logic on server, like error handling, connection settings\n *\n * @example\n  ```tsx\n  {\n    provide: commandLineListTokens.init,\n    multi: true,\n    useFactory: ({ server }) => {\n      return function serverListen() {\n        createTerminus(server, {});\n      };\n    },\n    deps: {\n      SERVER_TOKEN,\n    },\n  },\n  ```\n */\nexport const SERVER_TOKEN = createToken<Server>('server');\n\n/**\n * @description\n * Add resources for request proxying  to the app through `http-proxy-middleware`\n */\nexport const PROXY_CONFIG_TOKEN = createToken<ProxyConfig[]>('proxyConfigToken', {\n  multi: true,\n});\n\n/**\n * @description\n * Override filter function when accessing papi route `/dependenciesVersion`\n */\nexport const DEPENDENCIES_VERSION_FILTER_TOKEN = createToken<DepsFilter>(\n  'dependenciesVersionFilter'\n);\n\n/**\n * @description\n * List of the utility URLs on server (e.g. healthz and readyz)\n * Url matching is happens with a library `path-to-regexp`.\n */\nexport const UTILITY_SERVER_PATHS = createToken<string>('server utility paths', { multi: true });\n\n/**\n * @description\n * Defines port to listen for utility routes\n */\nexport const UTILITY_SERVER_PORT_TOKEN = createToken<number>('server utility server port');\n\n/**\n * @description\n * Custom function for k8s readiness, you might want to wait for something before allowing traffic to your app\\\n * https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/\n */\nexport const READINESS_PROBE_TOKEN = createToken<() => Promise<any>>('readiness-probe-fn');\n/**\n * @description\n * Custom function for k8s liveness, a function accepting a state and returning a promise indicating service health\\\n * https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/\n */\nexport const LIVENESS_PROBE_TOKEN = createToken<() => Promise<any>>('liveness-probe-fn');\n\nexport interface ServerModuleStaticsOptions {\n  path: string;\n}\n\nexport type ProxyConfig =\n  | {\n      [key: string]:\n        | string\n        | {\n            target: string;\n            [key: string]: any;\n          };\n    }\n  | {\n      context: string | string[];\n      target: string;\n      [key: string]: any;\n    };\n\nexport type DepsFilter = (\n  deps: Record<string, string>\n) => Record<string, string> | Promise<Record<string, string>>;\n\n"))))}f.isMDXComponent=!0}}]);