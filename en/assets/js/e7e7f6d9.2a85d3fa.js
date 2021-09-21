(self.webpackChunk=self.webpackChunk||[]).push([[8731],{3905:(e,t,r)=>{"use strict";r.d(t,{Zo:()=>l,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),u=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=u(e.components);return n.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=u(r),f=o,m=d["".concat(c,".").concat(f)]||d[f]||p[f]||i;return r?n.createElement(m,a(a({ref:t},l),{},{components:r})):n.createElement(m,a({ref:t},l))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var u=2;u<i;u++)a[u]=r[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},7447:(e,t,r)=>{"use strict";r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>c,metadata:()=>u,toc:()=>l,default:()=>d});var n=r(2122),o=r(9756),i=(r(7294),r(3905)),a=["components"],s={id:"routing",title:"Introduction"},c=void 0,u={unversionedId:"features/routing",id:"features/routing",isDocsHomePage:!1,title:"Introduction",description:"At the lowest level, routing is based on the @tinkoff/router library, which provides convenient hooks for all stages of the router lifecycle. Special modules are involved in integrating the router into the application. It is expected that all application routes are described in the admin area, but it is possible to set static routes at the application code level.",source:"@site/i18n/en/docusaurus-plugin-content-docs/current/features/routing.md",sourceDirName:"features",slug:"/features/routing",permalink:"/en/docs/features/routing",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/features/routing.md",version:"current",frontMatter:{id:"routing",title:"Introduction"},sidebar:"docs",previous:{title:"\u0420\u0430\u0431\u043e\u0442\u0430 \u0441 React",permalink:"/en/docs/features/react"},next:{title:"router",permalink:"/en/docs/references/modules/router"}},l=[],p={toc:l};function d(e){var t=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"At the lowest level, routing is based on the ",(0,i.kt)("a",{parentName:"p",href:"/en/docs/references/libs/router"},"@tinkoff/router")," library, which provides convenient hooks for all stages of the router lifecycle. Special modules are involved in integrating the router into the application. It is expected that all application routes are described in the admin area, but it is possible to set static routes at the application code level."),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/en/docs/references/modules/router"},"NoSpaRouterModule")," creates a router instance, initializes a router for routing and synchronizes it with a router, registers actions, bundles, validators, redirects and other features to the corresponding router hooks."),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/en/docs/references/modules/router"},"SpaRouterModule")," switches the router to use the History API on the client."),(0,i.kt)("p",null,"To use all these features in the application, it is enough to install and enable ",(0,i.kt)("a",{parentName:"p",href:"/en/docs/references/modules/router"},"@tramvai/module-router")))}d.isMDXComponent=!0}}]);