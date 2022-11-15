"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4069],{3905:(e,t,r)=>{r.d(t,{Zo:()=>d,kt:()=>u});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},d=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,d=p(e,["components","mdxType","originalType","parentName"]),h=s(r),u=a,m=h["".concat(l,".").concat(u)]||h[u]||c[u]||o;return r?n.createElement(m,i(i({ref:t},d),{},{components:r})):n.createElement(m,i({ref:t},d))}));function u(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=h;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:a,i[1]=p;for(var s=2;s<o;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}h.displayName="MDXCreateElement"},3631:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>u,frontMatter:()=>p,metadata:()=>s,toc:()=>c});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],p={id:"how-create-papi",title:"How to create a papi handler?"},l=void 0,s={unversionedId:"how-to/how-create-papi",id:"how-to/how-create-papi",title:"How to create a papi handler?",description:"Let's consider on the basis of the case: it is necessary to create a separate api service which, according to an url like $/papi/getSum will return the sum of the passed parameters a and b",source:"@site/tmp-docs/how-to/how-create-papi.md",sourceDirName:"how-to",slug:"/how-to/how-create-papi",permalink:"/docs/how-to/how-create-papi",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/how-to/how-create-papi.md",tags:[],version:"current",frontMatter:{id:"how-create-papi",title:"How to create a papi handler?"},sidebar:"sidebar",previous:{title:"How to create a module?",permalink:"/docs/how-to/how-create-module"},next:{title:"How to debug modules?",permalink:"/docs/how-to/how-debug-modules"}},d={},c=[{value:"Automatic handler creation",id:"automatic-handler-creation",level:2},{value:"Creating a handler via provider",id:"creating-a-handler-via-provider",level:2},{value:"Additional links",id:"additional-links",level:3}],h={toc:c};function u(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},h,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Let's consider on the basis of the case: it is necessary to create a separate api service which, according to an url like ",(0,o.kt)("inlineCode",{parentName:"p"},"${APP_ID}/papi/getSum")," will return the sum of the passed parameters a and b"),(0,o.kt)("h2",{id:"automatic-handler-creation"},"Automatic handler creation"),(0,o.kt)("p",null,"Based on the configuration parameter ",(0,o.kt)("inlineCode",{parentName:"p"},"application.commands.build.options.serverApiDir")," in tramvai.json (by default folder ",(0,o.kt)("inlineCode",{parentName:"p"},"./src/api"),") the directory where the papi handlers are stored is determined. Create a new file in this folder with the name of our new handler, i.e. ",(0,o.kt)("inlineCode",{parentName:"p"},"getSum.ts")," for our example. The default export from the file will be used as a handler, create it:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createPapiMethod } from '@tramvai/papi';\n\nexport default createPapiMethod ({\n  async handler() {\n    return 'hello';\n  },\n})\n")),(0,o.kt)("p",null,"We restart the server so that the new handler is added to the papi list. The result of the function call will be used as the body of the response, so now if we turn to the address ",(0,o.kt)("inlineCode",{parentName:"p"},"http://localhost:3000/tincoin/papi/getSum"),", then in the response we will receive an object with the property ",(0,o.kt)("inlineCode",{parentName:"p"},"payload: 'hello'"),"."),(0,o.kt)("p",null,"Next, let's add logic to our handler:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createPapiMethod } from '@tramvai/papi';\nimport { PAPI_CACHE_TOKEN } from '../tokens'; // one of the app-defined tokens\n\n// eslint-disable-next-line import/no-default-export\nexport default createPapiMethod({\n  async handler({ body, requestManager }) {\n    const { cache } = this.deps;\n    const method = requestManager.getMethod();\n    const { a, b } = body;\n\n    if (method !== 'POST') {\n      throw new Error('only post methods');\n    }\n\n    if (!a || !b) {\n      return {\n        error: true,\n        message: 'body parameters a and b should be set',\n      };\n    }\n\n    const key = `${a},${b}`;\n\n    if (cache.has(key)) {\n      return { error: false, fromCache: true, result: cache.get(key) };\n    }\n\n    const result = +a + +b;\n\n    cache.set(key, result);\n\n    return { error: false, fromCache: false, result };\n  },\n  deps: {\n    cache: PAPI_CACHE_TOKEN,\n  },\n});\n")),(0,o.kt)("p",null,"There is no need to restart the build, @tramvai/cli will rebuild everything itself after saving the changes to disk. Now you can make a POST request to ",(0,o.kt)("inlineCode",{parentName:"p"},"http://localhost:3000/tincoin/papi/getSum"),", pass the parameters ",(0,o.kt)("inlineCode",{parentName:"p"},"a")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"b")," and get the result."),(0,o.kt)("h2",{id:"creating-a-handler-via-provider"},"Creating a handler via provider"),(0,o.kt)("p",null,"If you need to use other application dependencies from di in the handler, you can add a provider with the ",(0,o.kt)("inlineCode",{parentName:"p"},"SERVER_MODULE_PAPI_PUBLIC_ROUTE")," token:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"// ...\nimport { createPapiMethod } from '@tramvai/papi';\nimport { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';\nimport { provide } from '@tramvai/core';\n\ncreateApp({\n  // ...\n  providers: [\n    // ...\n    provide({\n      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,\n      multi: true,\n      useFactory: () => {\n        return createPapiMethod({\n          method: 'get',\n          path: '/ping',\n          async handler() {\n            this.log.error('/ping requested'); // log with the error level to see the log for sure\n            return 'pong';\n          },\n        });\n      },\n    }),\n  ],\n});\n")),(0,o.kt)("p",null,"Now you can make a request to the address ",(0,o.kt)("inlineCode",{parentName:"p"},"http://localhost:3000/tincoin/papi/ping"),", in the response we will receive an object with the property ",(0,o.kt)("inlineCode",{parentName:"p"},"payload: 'pong'"),",  in the terminal with the running process ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai start ${APP_ID}")," we will see the error log ",(0,o.kt)("inlineCode",{parentName:"p"},"/ping requested"),"."),(0,o.kt)("h3",{id:"additional-links"},"Additional links"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/references/tramvai/papi"},"@tramvai/papi documentation")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/references/modules/server"},"ServerModule documentation"))))}u.isMDXComponent=!0}}]);