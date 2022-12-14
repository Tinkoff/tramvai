"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5866],{3905:(e,t,a)=>{a.d(t,{Zo:()=>d,kt:()=>m});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),s=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},d=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,d=p(e,["components","mdxType","originalType","parentName"]),u=s(a),m=r,h=u["".concat(l,".").concat(m)]||u[m]||c[m]||i;return a?n.createElement(h,o(o({ref:t},d),{},{components:a})):n.createElement(h,o({ref:t},d))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=u;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:r,o[1]=p;for(var s=2;s<i;s++)o[s]=a[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},5680:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>m,frontMatter:()=>p,metadata:()=>s,toc:()=>c});var n=a(7462),r=a(3366),i=(a(7294),a(3905)),o=["components"],p={id:"introduction",title:"Papi introducton"},l=void 0,s={unversionedId:"features/papi/introduction",id:"features/papi/introduction",title:"Papi introducton",description:"Papi - API routes for the tramvai application. The functionality is included in the module @tramvai/module-server with the help of @tramvai/papi",source:"@site/tmp-docs/features/papi/introduction.md",sourceDirName:"features/papi",slug:"/features/papi/introduction",permalink:"/docs/features/papi/introduction",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/features/papi/introduction.md",tags:[],version:"current",frontMatter:{id:"introduction",title:"Papi introducton"},sidebar:"sidebar",previous:{title:"tramvai-integration",permalink:"/docs/references/tramvai/state/tramvai-integration"},next:{title:"Automatic migrations",permalink:"/docs/features/migration"}},d={},c=[{value:"Explanation",id:"explanation",level:2},{value:"How to",id:"how-to",level:2},{value:"How to create papi",id:"how-to-create-papi",level:3},{value:"How to get data from papi",id:"how-to-get-data-from-papi",level:3},{value:"How can I get data from DI in papi routes",id:"how-can-i-get-data-from-di-in-papi-routes",level:3},{value:"How to add a new papi route in the application",id:"how-to-add-a-new-papi-route-in-the-application",level:3},{value:"Using the file api approach",id:"using-the-file-api-approach",level:4},{value:"Using providers",id:"using-providers",level:4}],u={toc:c};function m(e){var t=e.components,a=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Papi - API routes for the ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai")," application. The functionality is included in the module ",(0,i.kt)("a",{parentName:"p",href:"/docs/references/modules/server"},"@tramvai/module-server")," with the help of ",(0,i.kt)("a",{parentName:"p",href:"/docs/references/tramvai/papi"},"@tramvai/papi")),(0,i.kt)("h2",{id:"explanation"},"Explanation"),(0,i.kt)("p",null,"Often, an application needs microservices that can process user requests and return JSON responses. It is to address these cases that PAPIs were developed. PAPi allows you to implement request handlers that clients can request and receive a response in an arbitrary format, for example, JSON. PAPI allows you to quickly and cheaply implement handlers without raising additional microservices."),(0,i.kt)("h2",{id:"how-to"},"How to"),(0,i.kt)("h3",{id:"how-to-create-papi"},"How to create papi"),(0,i.kt)("p",null,"See examples on ",(0,i.kt)("a",{parentName:"p",href:"/docs/how-to/how-create-papi"},"how to create papi")," and ",(0,i.kt)("a",{parentName:"p",href:"/docs/references/tramvai/papi"},"@tramvai/papi")),(0,i.kt)("h3",{id:"how-to-get-data-from-papi"},"How to get data from papi"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"papi")," is available at ",(0,i.kt)("inlineCode",{parentName:"p"},"/${appInfo.appName}/papi"),". This url was chosen because it would divide many different papi services into 1 application domain."),(0,i.kt)("p",null,"For the example above with adding a route, the resulting url will look like this: ",(0,i.kt)("inlineCode",{parentName:"p"},"/${appInfo.appName}/papi/test")," where appName is the name passed to ",(0,i.kt)("inlineCode",{parentName:"p"},"createApp")),(0,i.kt)("p",null,"To make a request, you need to use ",(0,i.kt)("inlineCode",{parentName:"p"},"PAPI_SERVICE")," from the module ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/module-http-client"),", which automatically on the client will make an http request to papi and on the server will simply call the handler function"),(0,i.kt)("h3",{id:"how-can-i-get-data-from-di-in-papi-routes"},"How can I get data from DI in papi routes"),(0,i.kt)("p",null,"For the papi handler, it is possible to set the dependencies that it needs to work. Thus for each call a separate child di-container will be created, which will allow using both ",(0,i.kt)("inlineCode",{parentName:"p"},"SIGNLETON")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"REQUEST")," dependencies."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module, provide } from '@tramvai/core';\nimport { CREATE_CACHE_TOKEN } from '@tramvai/module-common';\nimport { HTTP_CLIENT } from '@tramvai/module-http-client';\nimport { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/module-server';\nimport { createPapiMethod } from '@tramvai/papi';\n\n@Module({\n  providers: [\n    provide({\n      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,\n      multi: true,\n      useFactory: ({ createCache }) => {\n        const cache = createCache(); // cache must be common for all handler calls, so we call it outside of createPapiMethod\n\n        return createPapiMethod({\n          path: '/my/papi',\n          method: 'post',\n          async handler({ httpClient }) {\n            // use what was requested in deps from createPapiMethod\n            if (cache.has('test')) {\n              return 'test';\n            }\n\n            const { payload } = await httpClient.get('fake');\n            return payload;\n          },\n          deps: {\n            httpClient: HTTP_CLIENT, // the same dependency must be recreated for each call and they must be independent\n          },\n        });\n      },\n      deps: {\n        createCache: CREATE_CACHE_TOKEN, // this is a dependency from the root container, which will be created only once\n      },\n    }),\n  ],\n})\nexport class PapiTestModule {}\n")),(0,i.kt)("h3",{id:"how-to-add-a-new-papi-route-in-the-application"},"How to add a new papi route in the application"),(0,i.kt)("p",null,"There are two ways to define routes. 1 - based on the file structure, 2 - task through providers"),(0,i.kt)("h4",{id:"using-the-file-api-approach"},"Using the file api approach"),(0,i.kt)("p",null,"The easiest way to create a PAPI route is to create a directory ",(0,i.kt)("inlineCode",{parentName:"p"},"papi")," in the root of the project in which to put TS files with handlers. The name of the files will be the URL to the route."),(0,i.kt)("p",null,"For example: we want to create a new papi handler that reads the body of the requests and summarizes the received values. To do this, create a file /papi/getSum.ts with the content:"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"papi/getSum.ts content"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},'import { createPapiMethod } from \'@tramvai/papi\';\nimport { PAPI_CACHE_TOKEN } from \'../tokens\';\n\n// in tramvai.json we\'ve added option to setup file-based papi\n//       "commands": {\n//         "build": {\n//           "options": {\n//             "server": "server-add-file-api/index.ts",\n//             "serverApiDir": "server-add-file-api/papi"\n//           }\n//         }\n//       }\n//\n// And thanks to that option any file in that directory will become papi handler for url based on filename\n// /${appName}/papi/${fileName} i.e. for current file it\'ll be /server/papi/getSum\n\n// eslint-disable-next-line import/no-default-export\nexport default createPapiMethod({\n  // handler function will be called for any request to url that handled by this papi\n  async handler({ body, requestManager }) {\n    const { cache } = this.deps;\n    const method = requestManager.getMethod();\n    const { a, b } = body;\n\n    if (method !== \'POST\') {\n      throw new Error(\'only post methods\');\n    }\n\n    if (!a || !b) {\n      return {\n        error: true,\n        message: \'body parameters a and b should be set\',\n      };\n    }\n\n    const key = `${a},${b}`;\n\n    if (cache.has(key)) {\n      return { error: false, fromCache: true, result: cache.get(key) };\n    }\n\n    const result = +a + +b;\n\n    cache.set(key, result);\n\n    return { error: false, fromCache: false, result };\n  },\n  deps: {\n    // Singleton tokens that should outlive function handler scope should be defined in the app itself\n    cache: PAPI_CACHE_TOKEN,\n  },\n});\n\n'))))),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"index.ts content"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createApp, provide, Scope } from '@tramvai/core';\nimport { CREATE_CACHE_TOKEN } from '@tramvai/tokens-common';\nimport { PAPI_CACHE_TOKEN } from './tokens';\nimport { modules } from '../common';\n\ncreateApp({\n  name: 'server',\n  modules: [...modules],\n  bundles: {},\n  providers: [\n    provide({\n      provide: PAPI_CACHE_TOKEN,\n      // Singleton provider that might be used by papi handlers and that will be initialized only once on app start\n      scope: Scope.SINGLETON,\n      useFactory: ({ createCache }) => {\n        return createCache('memory');\n      },\n      deps: {\n        createCache: CREATE_CACHE_TOKEN,\n      },\n    }),\n  ],\n});\n\n"))))),(0,i.kt)("p",null,"This file can be requested using the client papi, or by calling the url ",(0,i.kt)("inlineCode",{parentName:"p"},"/${appName}/papi/getSum")),(0,i.kt)("h4",{id:"using-providers"},"Using providers"),(0,i.kt)("p",null,"It is necessary to add a multi provider ",(0,i.kt)("inlineCode",{parentName:"p"},"SERVER_MODULE_PAPI_PUBLIC_ROUTE")," in which to add new papi routes"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createPapiMethod } from '@tramvai/papi';\nimport { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';\nimport { provide } from '@tramvai/core';\n\n@Module({\n  providers: [\n    provide({\n      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,\n      multi: true,\n      useValue: createPapiMethod({\n        method: 'get', // method, can be post, all and so on\n        path: '/test', // path where the route will be available\n        async handler() {\n          // function that will be called if requests for url come\n          return { test: true };\n        },\n      }),\n    }),\n  ],\n})\nexport class PapiTestModule {}\n")),(0,i.kt)("p",null,"And after that the test route will be available"))}m.isMDXComponent=!0}}]);