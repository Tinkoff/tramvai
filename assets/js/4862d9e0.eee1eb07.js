(self.webpackChunk=self.webpackChunk||[]).push([[792],{3905:(e,n,t)=>{"use strict";t.d(n,{Zo:()=>u,kt:()=>m});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=r.createContext({}),d=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=d(e.components);return r.createElement(p.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},c=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=d(t),m=o,v=c["".concat(p,".").concat(m)]||c[m]||s[m]||a;return t?r.createElement(v,i(i({ref:n},u),{},{components:t})):r.createElement(v,i({ref:n},u))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=c;var l={};for(var p in n)hasOwnProperty.call(n,p)&&(l[p]=n[p]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var d=2;d<a;d++)i[d]=t[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}c.displayName="MDXCreateElement"},9128:(e,n,t)=>{"use strict";t.r(n),t.d(n,{frontMatter:()=>l,contentTitle:()=>p,metadata:()=>d,toc:()=>u,default:()=>c});var r=t(2122),o=t(9756),a=(t(7294),t(3905)),i=["components"],l={id:"env",title:"env"},p=void 0,d={unversionedId:"references/modules/env",id:"references/modules/env",isDocsHomePage:!1,title:"env",description:"\u041c\u043e\u0434\u0443\u043b\u044c env \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0441\u044f \u0434\u043b\u044f \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u044b\u0445 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432 \u0438\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u044f \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0439 \u0432 \u0440\u0430\u043d\u0442\u0430\u0439\u043c\u0435 \u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u044d\u0442\u0438\u0445 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432 \u043a\u043b\u0438\u0435\u043d\u0442\u0443. \u0421 \u0437\u0430\u0440\u0430\u043d\u0435\u0435 \u0441\u043e\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u043d\u044b\u043c\u0438 \u0441\u043f\u0438\u0441\u043a\u043e\u043c \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0445 \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u043c, \u0434\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435\u043c \u0438 \u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u0435\u0439 \u043f\u0440\u0438 \u0441\u0442\u0430\u0440\u0442\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f",source:"@site/tmp-docs/references/modules/env.md",sourceDirName:"references/modules",slug:"/references/modules/env",permalink:"/docs/references/modules/env",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/modules/env.md",version:"current",frontMatter:{id:"env",title:"env"},sidebar:"docs",previous:{title:"deps-graph",permalink:"/docs/references/modules/deps-graph"},next:{title:"error-interceptor",permalink:"/docs/references/modules/error-interceptor"}},u=[{value:"\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435",id:"\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435",children:[]},{value:"Explanation",id:"explanation",children:[{value:"\u0414\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438 \u0433\u0435\u043d\u0435\u0440\u0438\u0440\u0443\u0435\u043c\u044b\u0439 \u0441\u043f\u0438\u0441\u043e\u043a \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0445 ENV \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445",id:"\u0434\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438-\u0433\u0435\u043d\u0435\u0440\u0438\u0440\u0443\u0435\u043c\u044b\u0439-\u0441\u043f\u0438\u0441\u043e\u043a-\u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0445-env-\u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445",children:[]},{value:"\u0412\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u044f \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0445 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432",id:"\u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u044f-\u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0445-\u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432",children:[]},{value:"\u0424\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u0438 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435",id:"\u0444\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c-\u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442-\u043d\u0430-\u0441\u0435\u0440\u0432\u0435\u0440\u0435-\u0438-\u0432-\u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435",children:[]},{value:"\u041f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0439 \u0434\u043b\u044f env \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445",id:"\u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442-\u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f-\u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0439-\u0434\u043b\u044f-env-\u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445",children:[]}]},{value:"API",id:"api",children:[]},{value:"How to",id:"how-to",children:[{value:"\u041a\u0430\u043a \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435 \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438",id:"\u043a\u0430\u043a-\u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c-\u0434\u0430\u043d\u043d\u044b\u0435-\u0432-\u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438",children:[]},{value:"\u041a\u0430\u043a \u043c\u043e\u0436\u043d\u043e \u043f\u0440\u043e\u0441\u0442\u043e \u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043f\u0440\u0438 \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e\u0439 \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u043a\u0435",id:"\u043a\u0430\u043a-\u043c\u043e\u0436\u043d\u043e-\u043f\u0440\u043e\u0441\u0442\u043e-\u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c-\u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b-\u043f\u0440\u0438-\u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e\u0439-\u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u043a\u0435",children:[]},{value:"\u041a\u0430\u043a \u043f\u0440\u0438 \u0434\u0435\u043f\u043b\u043e\u044f\u0445 \u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c ENV \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044e",id:"\u043a\u0430\u043a-\u043f\u0440\u0438-\u0434\u0435\u043f\u043b\u043e\u044f\u0445-\u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c-env-\u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b-\u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044e",children:[]}]}],s={toc:u};function c(e){var n=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u041c\u043e\u0434\u0443\u043b\u044c env \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0441\u044f \u0434\u043b\u044f \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u044b\u0445 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432 \u0438\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u044f \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0439 \u0432 \u0440\u0430\u043d\u0442\u0430\u0439\u043c\u0435 \u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u044d\u0442\u0438\u0445 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432 \u043a\u043b\u0438\u0435\u043d\u0442\u0443. \u0421 \u0437\u0430\u0440\u0430\u043d\u0435\u0435 \u0441\u043e\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u043d\u044b\u043c\u0438 \u0441\u043f\u0438\u0441\u043a\u043e\u043c \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0445 \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u043c, \u0434\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435\u043c \u0438 \u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u0435\u0439 \u043f\u0440\u0438 \u0441\u0442\u0430\u0440\u0442\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f"),(0,a.kt)("h2",{id:"\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435"},"\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435"),(0,a.kt)("p",null,"\u0423\u0436\u0435 \u043f\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u0432\u043d\u0443\u0442\u0440\u0438 @tramvai/module-common \u0438 \u043d\u0435 \u043d\u0443\u0436\u043d\u043e \u0443\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0442\u044c, \u0435\u0441\u043b\u0438 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d module-common."),(0,a.kt)("p",null,"\u0418\u043d\u0430\u0447\u0435, \u043d\u0443\u0436\u043d\u043e \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c ",(0,a.kt)("inlineCode",{parentName:"p"},"@tramvai/module-environment")),(0,a.kt)("h2",{id:"explanation"},"Explanation"),(0,a.kt)("h3",{id:"\u0434\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438-\u0433\u0435\u043d\u0435\u0440\u0438\u0440\u0443\u0435\u043c\u044b\u0439-\u0441\u043f\u0438\u0441\u043e\u043a-\u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0445-env-\u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445"},"\u0414\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438 \u0433\u0435\u043d\u0435\u0440\u0438\u0440\u0443\u0435\u043c\u044b\u0439 \u0441\u043f\u0438\u0441\u043e\u043a \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0445 ENV \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445"),(0,a.kt)("p",null,"\u0412\u0441\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0435 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u0440\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438 \u0432 DI \u0442\u043e\u043a\u0435\u043d\u0430 ",(0,a.kt)("inlineCode",{parentName:"p"},"ENV_USED_TOKEN")," \u0438 \u043f\u0440\u0435\u0434\u043f\u043e\u043b\u0430\u0433\u0430\u0435\u0442\u0441\u044f, \u0447\u0442\u043e \u043a\u0430\u0436\u0434\u044b\u0439 \u043c\u043e\u0434\u0443\u043b\u044c \u043f\u043e \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0442\u0435 ENV \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0435\u043c\u0443 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b. \u0412 \u0442\u0430\u043a\u043e\u043c \u0441\u043b\u0443\u0447\u0430\u0435 \u043f\u0440\u0438 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0438 \u043c\u043e\u0434\u0443\u043b\u044f, \u0431\u0443\u0434\u0435\u0442 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u044f \u0432\u0441\u0435\u0445 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0445 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b \u0434\u043b\u044f \u0440\u0430\u0431\u043e\u0442\u044b \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { provide } from '@tramvai/core';\n\n@Module({\n  providers: [\n    provide({\n      provide: ENV_USED_TOKEN,\n      useValue: [\n        { key: 'DEBUG_MODULE', optional: true },\n        { key: 'DEBUG_MODULE_URL', optional: true },\n      ],\n      multi: true,\n    }),\n  ],\n})\nexport class MyModule {}\n")),(0,a.kt)("p",null,"\u0412 \u0432\u044b\u0448\u0435 \u043f\u0440\u0438\u043c\u0435\u0440\u0435, \u043c\u043e\u0434\u0443\u043b\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0435\u0442 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e env \u0442\u043e\u043a\u0435\u043d\u043e\u0432, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0431\u0443\u0434\u0443\u0442 \u043f\u0440\u043e\u0438\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u044b \u0438 \u0431\u0443\u0434\u0443\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u0432 ",(0,a.kt)("inlineCode",{parentName:"p"},"environmentManager.get('DEBUG_MODULE')"),". \u041f\u0440\u0438 \u044d\u0442\u043e\u043c, \u0431\u044b\u043b \u043f\u0435\u0440\u0435\u0434\u0430\u043d \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440 ",(0,a.kt)("inlineCode",{parentName:"p"},"optional")," \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0443\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442, \u0447\u0442\u043e \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u043d\u0435 \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0434\u043b\u044f \u0440\u0430\u0431\u043e\u0442\u044b \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f."),(0,a.kt)("h3",{id:"\u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u044f-\u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0445-\u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432"},"\u0412\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u044f \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0445 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432"),(0,a.kt)("p",null,"\u041f\u0440\u0438 \u0441\u0442\u0430\u0440\u0442\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u043f\u0440\u043e\u0438\u0441\u0445\u043e\u0434\u0438\u0442 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0442\u0435\u0445 \u0442\u043e\u043a\u0435\u043d\u043e\u0432, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0431\u044b\u043b\u0438 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u044b \u0432 DI \u0438 \u0431\u044b\u043b\u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u044b \u0432 ENV \u043f\u0440\u0438 \u0437\u0430\u043f\u0443\u0441\u043a\u0435. \u0415\u0441\u043b\u0438 \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u043d\u0435 \u0431\u044b\u043b\u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u044b \u0432\u0441\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u043c\u044b\u0435 ENV \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435, \u0442\u043e \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0443\u043f\u0430\u0434\u0435\u0442."),(0,a.kt)("p",null,"\u0422\u0430\u043a-\u0436\u0435 \u0435\u0441\u0442\u044c \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u044c \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432\u0430\u043b\u0438\u0434\u0430\u0442\u043e\u0440\u044b \u0434\u043b\u044f ENV \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0439, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0437\u0430\u043f\u0443\u0441\u0442\u044f\u0442\u0441\u044f \u043f\u0440\u0438 \u0438\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { provide } from '@tramvai/core';\n\n@Module({\n  providers: [\n    provide({\n      provide: ENV_USED_TOKEN,\n      useValue: [\n        {\n          key: 'MY_ENV',\n          validator: (env) => {\n            if (!env.includes('https')) {\n              return '\u041d\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u0444\u043e\u0440\u043c\u0430\u0442 \u0441\u0441\u044b\u043b\u043a\u0438. \u0421\u0441\u044b\u043b\u043a\u0430 \u0434\u043e\u043b\u0436\u043d\u0430 \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u0442\u044c https';\n            }\n          },\n        },\n      ],\n      multi: true,\n    }),\n  ],\n})\nexport class MyModule {}\n")),(0,a.kt)("h3",{id:"\u0444\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c-\u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442-\u043d\u0430-\u0441\u0435\u0440\u0432\u0435\u0440\u0435-\u0438-\u0432-\u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435"},"\u0424\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u0438 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435"),(0,a.kt)("p",null,"\u0412\u0441\u0435 ENV \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0431\u0443\u0434\u0443\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u043a\u0430\u043a \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435, \u0442\u0430\u043a \u0438 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0431\u0435\u0437 \u043a\u0430\u043a\u0438\u0445 \u043b\u0438\u0431\u043e \u0434\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0438 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043a. \u0412 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u044e\u0442\u0441\u044f env \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0438\u043c\u0435\u044e\u0442 ",(0,a.kt)("inlineCode",{parentName:"p"},"dehydrate: true")),(0,a.kt)("h3",{id:"\u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442-\u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f-\u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0439-\u0434\u043b\u044f-env-\u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445"},"\u041f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0439 \u0434\u043b\u044f env \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445"),(0,a.kt)("p",null,"\u0422\u0430\u043a-\u043a\u0430\u043a \u0435\u0441\u0442\u044c \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u044c \u043f\u0435\u0440\u0435\u0437\u0430\u043f\u0438\u0441\u044b\u0432\u0430\u0442\u044c \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u044f \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445, \u0442\u043e \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0437\u0430\u043c\u0435\u043d\u044f\u0442\u0441\u044f \u043f\u043e \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u043c \u043f\u0440\u0430\u0432\u0438\u043b\u0430\u043c"),(0,a.kt)("p",null,"\u041f\u0440\u0430\u0432\u0438\u043b\u0430 \u0437\u0430\u043c\u0435\u043d\u044b, \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u044b \u0432 \u043f\u043e\u0440\u044f\u0434\u043a\u0435 \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442\u0430, \u043e\u0442 \u043c\u0435\u043d\u044c\u0448\u0435\u0433\u043e \u043a \u0432\u044b\u0441\u043e\u043a\u043e\u043c\u0443:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0437\u0430\u0434\u0430\u043d\u043d\u044b\u0435 \u0432 \u0442\u043e\u043a\u0435\u043d\u0430\u0445 ",(0,a.kt)("inlineCode",{parentName:"li"},"{ key: 'ENV_PARAM', value: 'env value' }")),(0,a.kt)("li",{parentName:"ul"},"\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0437\u0430\u043f\u0438\u0441\u0430\u043d\u043d\u044b\u0435 \u0432 \u0444\u0430\u0439\u043b\u0435 ",(0,a.kt)("inlineCode",{parentName:"li"},"env.development.js")),(0,a.kt)("li",{parentName:"ul"},"\u041f\u0435\u0440\u0435\u0434\u0430\u0447\u0430 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432 \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f ",(0,a.kt)("inlineCode",{parentName:"li"},"MY_ENV=j node server.js"))),(0,a.kt)("h2",{id:"api"},"API"),(0,a.kt)("p",null,(0,a.kt)("details",null,(0,a.kt)("summary",null,"\u042d\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u0443\u0435\u043c\u044b\u0435 \u0442\u043e\u043a\u0435\u043d\u044b \u0438 TS \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\n\nexport interface EnvironmentManager {\n  get(name: string): string;\n  getInt(name: string, def: number): number;\n  getAll(): Record<string, string>;\n  update(result: Record<string, string>): void;\n  clientUsed(): Record<string, string>;\n  updateClientUsed(result: Record<string, string>): void;\n}\n\n/**\n * @description\n * \u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c `environmentManager` c \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043a\u043e\u0442\u043e\u0440\u043e\u0433\u043e \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435 env \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u0438 \u043a\u043b\u0438\u0435\u043d\u0442\u0435\n */\nexport const ENV_MANAGER_TOKEN = createToken<EnvironmentManager>('environmentManager');\n\n/**\n * @description\n * \u0421\u043f\u0438\u0441\u043e\u043a \u0442\u043e\u043a\u0435\u043d\u043e\u0432 \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b \u043c\u043e\u0434\u0443\u043b\u044e \u0438\u043b\u0438 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044e.\n * \u041f\u043e\u0437\u0434\u043d\u0435\u0435 \u0432\u0441\u0435 \u0442\u043e\u043a\u0435\u043d\u044b \u0438\u0437 \u044d\u0442\u043e\u0433\u043e \u0441\u043f\u0438\u0441\u043a\u0430 \u0431\u0443\u0434\u0443\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u0447\u0435\u0440\u0435\u0437 `environmentManager`\n * \u0424\u043e\u0440\u043c\u0430\u0442 \u0442\u043e\u043a\u0435\u043d\u0430 ENV_USED_TOKEN:\n    - `key` - \u0438\u0434\u0435\u043d\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0440 env \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0439. \u041f\u043e\u0434 \u044d\u0442\u0438\u043c \u043a\u043b\u044e\u0447\u0435\u043c \u0431\u0443\u0434\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e \u0432 `environmentManager` \u0438 \u0431\u0443\u0434\u0435\u0442 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u043e \u0438\u0437 \u0432\u043d\u0435\u0448\u043d\u0438\u0445 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u043e\u0432\n    - `value` - \u043f\u0440\u0435\u0434\u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u043e\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u0442\u043e\u043a\u0435\u043d\u0430 `key` \u0441 \u043d\u0438\u0437\u043a\u0438\u043c \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442\u043e\u043c\n    - `optional` - \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043b\u0438 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440 \u043e\u043f\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u043c \u0434\u043b\u044f \u0440\u0430\u0431\u043e\u0442\u044b \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f. \u0415\u0441\u043b\u0438 `true`, \u0442\u043e \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u043d\u0435 \u0431\u0443\u0434\u0435\u0442 \u043f\u0430\u0434\u0430\u0442\u044c, \u0435\u0441\u043b\u0438 \u043d\u0435 \u0431\u044b\u043b\u043e \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043e \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435\n    - `validator` - \u0444\u0443\u043d\u043a\u0446\u0438\u044f \u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u043e\u0433\u043e \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u044f. \u0415\u0441\u043b\u0438 \u0444\u0443\u043d\u043a\u0446\u0438\u044f \u0432\u0435\u0440\u043d\u0435\u0442 \u0442\u0435\u043a\u0441\u0442, \u0442\u043e \u0432\u044b\u043a\u0438\u043d\u0435\u0442\u0441\u044f \u043e\u0448\u0438\u0431\u043a\u0430\n    - `dehydrate` - \u0435\u0441\u043b\u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043e `false`, \u0442\u043e env \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440 \u043d\u0435 \u043f\u0435\u0440\u0435\u0434\u0430\u0441\u0442\u0441\u044f \u043a\u043b\u0438\u0435\u043d\u0442\u0443 \u0438 \u043c\u043e\u0436\u043d\u043e \u0431\u0443\u0434\u0435\u0442 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u043d\u043e\u0439 \u0441\u0442\u043e\u0440\u043e\u043d\u0435\n *\n * @example\n  ```tsx\n  interface EnvParameter {\n    key: string;\n    value?: string;\n    optional?: boolean;\n    validator?: (value: string) => boolean | string;\n    dehydrate?: boolean;\n  }\n  ```\n */\nexport interface EnvParameter {\n  key: string;\n  value?: string;\n  optional?: boolean;\n  validator?: (value: string) => boolean | string;\n  dehydrate?: boolean;\n}\n\nexport const ENV_USED_TOKEN = createToken<EnvParameter[]>('envUsed', { multi: true });\n\n"))))),(0,a.kt)("h2",{id:"how-to"},"How to"),(0,a.kt)("h3",{id:"\u043a\u0430\u043a-\u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c-\u0434\u0430\u043d\u043d\u044b\u0435-\u0432-\u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438"},"\u041a\u0430\u043a \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435 \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438"),(0,a.kt)("p",null,"\u0414\u043e\u043f\u0443\u0441\u0442\u0438\u043c \u043c\u044b \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043b\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0439 ENV \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440 ",(0,a.kt)("inlineCode",{parentName:"p"},"CONFIG_API")," \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u0442\u043e\u043a\u0435\u043d\u0430 ",(0,a.kt)("inlineCode",{parentName:"p"},"ENV_USED_TOKEN"),", \u0442\u0435\u043f\u0435\u0440\u044c \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438 \u043d\u0443\u0436\u043d\u043e \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c environmentManager \u0438 \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { provide } from '@tramvai/core';\n\n@Module({\n  providers: [\n    provide({\n      provide: 'MY_SERVICE',\n      useClass: class MyService {\n        constructor({ environmentManager }) {\n          console.log(environmentManager.get('CONFIG_API'));\n        }\n      },\n      deps: {\n        environmentManager: ENV_MANAGER_TOKEN,\n      },\n    }),\n  ],\n})\nexport class MyModule {}\n")),(0,a.kt)("p",null,"\u042d\u0442\u043e\u0442 \u043a\u043e\u0434 \u0431\u0443\u0434\u0435\u0442 \u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u043a\u0430\u043a \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435, \u0442\u0430\u043a \u0438 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435"),(0,a.kt)("h3",{id:"\u043a\u0430\u043a-\u043c\u043e\u0436\u043d\u043e-\u043f\u0440\u043e\u0441\u0442\u043e-\u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c-\u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b-\u043f\u0440\u0438-\u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e\u0439-\u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u043a\u0435"},"\u041a\u0430\u043a \u043c\u043e\u0436\u043d\u043e \u043f\u0440\u043e\u0441\u0442\u043e \u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043f\u0440\u0438 \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e\u0439 \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u043a\u0435"),(0,a.kt)("p",null,"\u0414\u043b\u044f \u044d\u0442\u043e\u0433\u043e \u0441\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u0444\u0430\u0439\u043b ",(0,a.kt)("inlineCode",{parentName:"p"},"env.development.js")," \u0432 \u043a\u043e\u0440\u043d\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u0438 \u043f\u0440\u043e\u043f\u0438\u0448\u0438\u0442\u0435 \u0432\u0441\u0435 ENV \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0434\u043b\u044f \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f. \u041f\u0440\u0438 \u0438\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f, \u0431\u0443\u0434\u0435\u0442 \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u043d \u044d\u0442\u043e\u0442 \u0444\u0430\u0439\u043b."),(0,a.kt)("h4",{id:"\u043e\u0441\u043e\u0431\u0435\u043d\u043d\u043e\u0441\u0442\u0438-\u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f-envdevelopmenjs-\u0432-production-\u0441\u0431\u043e\u0440\u043a\u0435"},"\u041e\u0441\u043e\u0431\u0435\u043d\u043d\u043e\u0441\u0442\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f env.developmen.js \u0432 production \u0441\u0431\u043e\u0440\u043a\u0435"),(0,a.kt)("p",null,"\u041f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 ",(0,a.kt)("a",{parentName:"p",href:"https://12factor.net/ru/config"},"\u0434\u0432\u0435\u043d\u0430\u0434\u0446\u0430\u0442\u0438 \u0444\u0430\u043a\u0442\u043e\u0440\u043e\u0432")," \u0445\u0440\u0430\u043d\u0438\u0442 \u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044e \u0432 \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0445 \u043e\u043a\u0440\u0443\u0436\u0435\u043d\u0438\u044f, \u043f\u043e\u044d\u0442\u043e\u043c\u0443 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e \u043f\u0440\u0438 ",(0,a.kt)("inlineCode",{parentName:"p"},"process.env.NODE_ENV === 'production'")," EnvironmentManger \u043d\u0435 \u0431\u0443\u0434\u0435\u0442 \u0441\u0447\u0438\u0442\u044b\u0432\u0430\u0442\u044c \u0444\u0430\u0439\u043b ",(0,a.kt)("inlineCode",{parentName:"p"},"env.development.js"),"."),(0,a.kt)("p",null,"\u0415\u0441\u043b\u0438 \u0436\u0435 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e \u043f\u0440\u043e\u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0441 ",(0,a.kt)("inlineCode",{parentName:"p"},"NODE_ENV=production"),", \u043c\u043e\u0436\u043d\u043e \u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c \u0444\u043b\u0430\u0433 ",(0,a.kt)("inlineCode",{parentName:"p"},"DANGEROUS_UNSAFE_ENV_FILES='true'")," \u0447\u0442\u043e\u0431\u044b EnvironmentManger \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u043b \u0444\u0430\u0439\u043b ",(0,a.kt)("inlineCode",{parentName:"p"},"env.development.js")," \u0438 \u043d\u0435 \u043f\u0440\u0438\u0448\u043b\u043e\u0441\u044c \u0432\u0432\u043e\u0434\u0438\u0442\u044c \u0432\u0441\u0435 \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0440\u0443\u043a\u0430\u043c\u0438."),(0,a.kt)("h3",{id:"\u043a\u0430\u043a-\u043f\u0440\u0438-\u0434\u0435\u043f\u043b\u043e\u044f\u0445-\u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c-env-\u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b-\u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044e"},"\u041a\u0430\u043a \u043f\u0440\u0438 \u0434\u0435\u043f\u043b\u043e\u044f\u0445 \u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c ENV \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044e"),(0,a.kt)("p",null,"\u0414\u043b\u044f \u044d\u0442\u043e\u0433\u043e \u043f\u0440\u0438 \u0437\u0430\u043f\u0443\u0441\u043a\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u043f\u0435\u0440\u0435\u0434\u0430\u0439\u0442\u0435 ENV \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b. \u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u0432 Docker \u043c\u043e\u0436\u043d\u043e \u044d\u0442\u043e \u0441\u0434\u0435\u043b\u0430\u0442\u044c \u0447\u0435\u0440\u0435\u0437 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440 -e ",(0,a.kt)("inlineCode",{parentName:"p"},"docker run -e MY_ENV_VAR=/ my-image")))}c.isMDXComponent=!0}}]);