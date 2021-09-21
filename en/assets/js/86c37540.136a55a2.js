(self.webpackChunk=self.webpackChunk||[]).push([[2318],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>c,kt:()=>m});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),s=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),u=s(n),m=r,h=u["".concat(l,".").concat(m)]||u[m]||d[m]||o;return n?a.createElement(h,i(i({ref:t},c),{},{components:n})):a.createElement(h,i({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=u;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:r,i[1]=p;for(var s=2;s<o;s++)i[s]=n[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5859:(e,t,n)=>{"use strict";n.r(t),n.d(t,{frontMatter:()=>p,contentTitle:()=>l,metadata:()=>s,toc:()=>c,default:()=>u});var a=n(2122),r=n(9756),o=(n(7294),n(3905)),i=["components"],p={id:"introduction",title:"\u0412\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 papi"},l=void 0,s={unversionedId:"features/papi/introduction",id:"features/papi/introduction",isDocsHomePage:!1,title:"\u0412\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 papi",description:"Papi - API routes for the tramvai application. The functionality is included in the module @tramvai/module-server",source:"@site/i18n/en/docusaurus-plugin-content-docs/current/features/papi/introduction.md",sourceDirName:"features/papi",slug:"/features/papi/introduction",permalink:"/en/docs/features/papi/introduction",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/features/papi/introduction.md",version:"current",frontMatter:{id:"introduction",title:"\u0412\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 papi"},sidebar:"docs",previous:{title:"createAction",permalink:"/en/docs/references/tramvai/create-action"},next:{title:"\u041a\u0430\u043a \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a papi?",permalink:"/en/docs/how-to/how-create-papi"}},c=[{value:"Explanation",id:"explanation",children:[]},{value:"How to",id:"how-to",children:[{value:"How to get data from papi",id:"how-to-get-data-from-papi",children:[]},{value:"How can I get data from DI in papi routes",id:"how-can-i-get-data-from-di-in-papi-routes",children:[]},{value:"How to add a new papi route in the application",id:"how-to-add-a-new-papi-route-in-the-application",children:[]}]}],d={toc:c};function u(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Papi - API routes for the ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai")," application. The functionality is included in the module ",(0,o.kt)("a",{parentName:"p",href:"/en/docs/references/modules/server"},"@tramvai/module-server")),(0,o.kt)("h2",{id:"explanation"},"Explanation"),(0,o.kt)("p",null,"Often, an application needs microservices that can process user requests and return JSON responses. It is to address these cases that PAPIs were developed. PAPi allows you to implement request handlers that clients can request and receive a response in an arbitrary format, for example, JSON. PAPI allows you to quickly and cheaply implement handlers without raising additional microservices."),(0,o.kt)("p",null,"Papi related sections"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#How-to-get-data-from-papi"},"How to get data from papi")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#How-can-I-get-data-from-DI-in-papi-routes"},"How can I get data from DI in papi routes")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#-How-to-add-a-new-papi-route-in-the-application"},"How to add a new papi route in the application"))),(0,o.kt)("h2",{id:"how-to"},"How to"),(0,o.kt)("h3",{id:"how-to-get-data-from-papi"},"How to get data from papi"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"papi")," is available at ",(0,o.kt)("inlineCode",{parentName:"p"},"/${appInfo.appName}/papi"),". This url was chosen because it would divide many different papi services into 1 application domain."),(0,o.kt)("p",null,"For the example above with adding a route, the resulting url will look like this: ",(0,o.kt)("inlineCode",{parentName:"p"},"/${appInfo.appName}/papi/test")," where appName is the name passed to",(0,o.kt)("inlineCode",{parentName:"p"}," createApp")),(0,o.kt)("p",null,"To make a request, you need to use ",(0,o.kt)("inlineCode",{parentName:"p"},"PAPI_SERVICE")," from the module ",(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/module-http-client"),", which automatically on the client will make an http request to papi and on the server will simply call the handler function"),(0,o.kt)("h3",{id:"how-can-i-get-data-from-di-in-papi-routes"},"How can I get data from DI in papi routes"),(0,o.kt)("p",null,"For the papi handler, it is possible to set the dependencies that it needs to work. Thus for each call a separate child di-container will be created, which will allow using both ",(0,o.kt)("inlineCode",{parentName:"p"},"SIGNLETON")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"REQUEST")," dependencies."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module, provide } from '@tramvai/core';\nimport { CREATE_CACHE_TOKEN } from '@tramvai/module-common';\nimport { HTTP_CLIENT } from '@tramvai/module-http-client';\nimport { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/module-server';\nimport { createPapiMethod } from '@tramvai/papi';\n\n@Module({\n  providers: [\n    provide({\n      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,\n      multi: true,\n      useFactory: ({ createCache }) => {\n        const cache = createCache(); // cache must be common for all handler calls, so we call it outside of createPapiMethod\n\n        return createPapiMethod({\n          path: '/my/papi',\n          method: 'post',\n          async handler({ httpClient }) {\n            // use what was requested in deps from createPapiMethod\n            if (cache.has('test')) {\n              return 'test';\n            }\n\n            const { payload } = await httpClient.get('fake');\n            return payload;\n          },\n          deps: {\n            httpClient: HTTP_CLIENT, // the same dependency must be recreated for each call and they must be independent\n          },\n        });\n      },\n      deps: {\n        createCache: CREATE_CACHE_TOKEN, // this is a dependency from the root container, which will be created only once\n      },\n    }),\n  ],\n})\nexport class PapiTestModule {}\n")),(0,o.kt)("h3",{id:"how-to-add-a-new-papi-route-in-the-application"},"How to add a new papi route in the application"),(0,o.kt)("p",null,"There are two ways to define routes. 1 - based on the file structure, 2 - task through providers"),(0,o.kt)("h4",{id:"using-the-file-api-approach"},"Using the file api approach"),(0,o.kt)("p",null,"The easiest way to create a PAPI route is to create a directory ",(0,o.kt)("inlineCode",{parentName:"p"},"papi")," in the root of the project in which to put TS files with handlers. The name of the files will be the URL to the route."),(0,o.kt)("p",null,"For example: we want to create a new papi handler that reads the body of the requests and summarizes the received values. To do this, create a file /papi/getSum.ts with the content:"),(0,o.kt)("p",null,(0,o.kt)("details",null,(0,o.kt)("summary",null,"\u0441\u043e\u0434\u0435\u0440\u0436\u0438\u043c\u043e\u0435 getSum.ts"),(0,o.kt)("p",null,(0,o.kt)("pre",{parentName:"p"},(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},'import { Request, Response } from \'@tramvai/papi\';\nimport { CREATE_CACHE_TOKEN } from \'@tramvai/module-common\';\n\n// \u0432 tramvai.json \u043c\u044b \u0434\u043e\u0431\u0430\u0432\u0438\u043b\u0438 \u0443\u043a\u0430\u0437\u0430\u043d\u0438\u0435 \u043d\u0430 \u0434\u0438\u0440\u0435\u043a\u0442\u043e\u0440\u0438\u044e \u0441 \u0444\u0430\u0439\u043b\u043e\u0432\u044b\u043c \u0430\u043f\u0438\n//       "commands": {\n//         "build": {\n//           "options": {\n//             "server": "server-add-file-api/index.ts",\n//             "serverApiDir": "server-add-file-api/papi"\n//           }\n//         }\n//       }\n// \u0438 \u0442\u0435\u043f\u0435\u0440\u044c \u043a\u0430\u0436\u0434\u044b\u0439 \u0444\u0430\u0439\u043b \u0432 \u044d\u0442\u043e\u0439 \u0434\u0438\u0440\u0435\u043a\u0442\u043e\u0440\u0438\u0438 \u0431\u0443\u0434\u0435\u0442 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u043e\u043c \u043a\u0430\u043a\u043e\u0433\u043e-\u0442\u043e \u0443\u0440\u043b\u0430 \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438 \u043e\u0442 \u0438\u043c\u0435\u043d\u0438 \u0441\u0430\u043c\u043e\u0433\u043e \u0444\u0430\u0439\u043b\u0430\n// /${appName}/papi/${fileName} \u0442.\u0435. \u0434\u043b\u044f \u0442\u0435\u043a\u0443\u0448\u0435\u0433\u043e \u0444\u0430\u0439\u043b\u0430 \u0443\u0440\u043b \u0431\u0443\u0434\u0435\u0442 /server/papi/getSum\n\n// \u044d\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u0443\u044f \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u0443\u044e rootDeps \u043c\u044b \u043c\u043e\u0436\u0435\u043c \u0437\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438 \u0438\u0437 \u0440\u0443\u0442\u043e\u0432\u043e\u0433\u043e DI \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435\n// \u044d\u0442\u0438 \u0437\u0430\u043f\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438 \u0431\u0443\u0434\u0443\u0442 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u044b \u0432 handler \u0442\u0440\u0435\u0442\u044c\u0438\u043c \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u043c\nexport const rootDeps = {\n  createCache: CREATE_CACHE_TOKEN,\n};\n\n// \u0435\u0441\u043b\u0438 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438 \u043f\u0440\u0438 \u044d\u0442\u043e\u043c \u043d\u0430\u0434\u043e \u043a\u0430\u043a-\u0442\u043e \u0438\u0437\u043d\u0430\u0447\u0430\u043b\u044c\u043d\u043e \u043f\u0440\u043e\u0438\u043d\u0438\u0446\u0438\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c, \u0442\u043e \u043c\u043e\u0436\u043d\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c\n// mapDeps \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0431\u0443\u0434\u0435\u0442 \u0432\u044b\u0437\u0432\u0430\u043d \u043e\u0434\u0438\u043d \u0440\u0430\u0437, \u043f\u043e\u043b\u0443\u0447\u0438\u0442 \u0432 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u0430\u0440\u0433\u0443\u043c\u0435\u043d\u0442\u0430 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438 \u0438\u0437 deps, \u0438\n// \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 \u044d\u0442\u043e\u0439 \u0444\u0443\u043d\u043a\u0446\u0438\u0438 \u0431\u0443\u0434\u0435\u0442 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d \u0432\u043c\u0435\u0441\u0442\u043e \u0442\u0440\u0435\u0442\u044c\u0435\u0433\u043e \u0430\u0440\u0433\u0443\u043c\u0435\u043d\u0442\u0430 \u0432 handler\nexport const mapRootDeps = ({ createCache }: typeof rootDeps) => {\n  return {\n    cache: createCache(\'memory\'),\n  };\n};\n\n// handler \u044d\u0442\u043e \u043d\u0430\u0448 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0431\u0443\u0434\u0435\u0442 \u0432\u044b\u0437\u044b\u0432\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043a\u0430\u0436\u0434\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441\n// \u0442\u043e\u0436\u0435 \u0441\u0430\u043c\u043e\u0435 \u0431\u0443\u0434\u0435\u0442 \u0435\u0441\u043b\u0438 \u0441\u0434\u0435\u043b\u0430\u0442\u044c export default\nexport const handler = (req: Request, res: Response, { cache }: ReturnType<typeof mapRootDeps>) => {\n  const {\n    body: { a, b },\n    method,\n  } = req;\n\n  if (method !== \'POST\') {\n    throw new Error(\'only post methods\');\n  }\n\n  if (!a || !b) {\n    return {\n      error: true,\n      message: \'body parameters a and b should be set\',\n    };\n  }\n\n  const key = `${a},${b}`;\n\n  if (cache.has(key)) {\n    return { error: false, fromCache: true, result: cache.get(key) };\n  }\n\n  const result = +a + +b;\n\n  cache.set(key, result);\n\n  return { error: false, fromCache: false, result };\n};\n\n'))))),(0,o.kt)("p",null,"This file can be requested using the client papi, or by calling the url ",(0,o.kt)("inlineCode",{parentName:"p"},"/${appName}/papi/getSum")),(0,o.kt)("h4",{id:"using-providers"},"Using providers"),(0,o.kt)("p",null,"It is necessary to add a multi provider ",(0,o.kt)("inlineCode",{parentName:"p"},"SERVER_MODULE_PAPI_PUBLIC_ROUTE")," in which to add new papi routes"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createPapiMethod } from '@tramvai/papi';\nimport { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';\nimport { provide } from '@tramvai/core';\n\n@Module({\n  providers: [\n    provide({\n      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,\n      multi: true,\n      useValue: createPapiMethod ({\n        method: 'get', // method, can be post, all and so on\n        path: '/test', // path where the route will be available\n        async handler(req, res): Promise<any> {\n          // function that will be called if requests for url come\n          return new Promise({ test: true });\n        },\n      }),\n    }),\n  ],\n})\nexport class PapiTestModule {}\n")),(0,o.kt)("p",null,"And after that the test route will be available"))}u.isMDXComponent=!0}}]);