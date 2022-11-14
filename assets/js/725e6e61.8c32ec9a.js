"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[702],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,s=e.originalType,l=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),f=u(r),m=a,y=f["".concat(l,".").concat(m)]||f[m]||p[m]||s;return r?n.createElement(y,i(i({ref:t},c),{},{components:r})):n.createElement(y,i({ref:t},c))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=r.length,i=new Array(s);i[0]=f;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var u=2;u<s;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},5495:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>u,toc:()=>p});var n=r(7462),a=r(3366),s=(r(7294),r(3905)),i=["components"],o={},l=void 0,u={unversionedId:"references/libs/measure-fastify-requests",id:"references/libs/measure-fastify-requests",title:"measure-fastify-requests",description:"Library for measuring RED metrics in the fastify app",source:"@site/tmp-docs/references/libs/measure-fastify-requests.md",sourceDirName:"references/libs",slug:"/references/libs/measure-fastify-requests",permalink:"/tramvai/docs/references/libs/measure-fastify-requests",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/measure-fastify-requests.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"measure-express-requests",permalink:"/tramvai/docs/references/libs/measure-express-requests"},next:{title:"meta-tags-generate",permalink:"/tramvai/docs/references/libs/meta-tags-generate"}},c={},p=[{value:"Example",id:"example",level:2}],f={toc:p};function m(e){var t=e.components,r=(0,a.Z)(e,i);return(0,s.kt)("wrapper",(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Library for measuring RED metrics in the fastify app"),(0,s.kt)("h2",{id:"example"},"Example"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-ts"},"import fastify from 'fastify';\nimport { fastifyMeasureRequests } from '@tinkoff/measure-fastify-requests';\nimport { Counter, Histogram } from 'prom-client';\n\nconst app = fastify();\n\napp.register(fastifyMeasureRequests, {\n  metrics: {\n    counter: (opt) => new Counter(opt),\n    histogram: (opt) => new Histogram(opt),\n  },\n});\n")),(0,s.kt)("p",null,"In the prom-client registry new metrics will be available:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("inlineCode",{parentName:"li"},"http_requests_total")," - number of incoming requests;"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("inlineCode",{parentName:"li"},"http_requests_errors")," - number of errors in the incoming requests;"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("inlineCode",{parentName:"li"},"http_requests_execution_time")," - histogram with the request handler execution time.")))}m.isMDXComponent=!0}}]);