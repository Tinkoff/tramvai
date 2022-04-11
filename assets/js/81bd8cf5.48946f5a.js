"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6993],{3905:(e,n,t)=>{t.d(n,{Zo:()=>s,kt:()=>m});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var d=a.createContext({}),u=function(e){var n=a.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},s=function(e){var n=u(e.components);return a.createElement(d.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},p=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,d=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),p=u(t),m=r,g=p["".concat(d,".").concat(m)]||p[m]||c[m]||l;return t?a.createElement(g,i(i({ref:n},s),{},{components:t})):a.createElement(g,i({ref:n},s))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,i=new Array(l);i[0]=p;var o={};for(var d in n)hasOwnProperty.call(n,d)&&(o[d]=n[d]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var u=2;u<l;u++)i[u]=t[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294);const r=function(e){var n=e.children,t=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:(e,n,t)=>{t.d(n,{Z:()=>s});var a=t(7462),r=t(7294),l=t(2389),i=t(5773),o=t(6010);const d="tabItem_LplD";function u(e){var n,t,l,u=e.lazy,s=e.block,c=e.defaultValue,p=e.values,m=e.groupId,g=e.className,v=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:v.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),h=(0,i.lx)(f,(function(e,n){return e.value===n.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===c?c:null!=(n=null!=c?c:null==(t=v.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(l=v[0])?void 0:l.props.value;if(null!==k&&!f.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,i.UB)(),N=b.tabGroupChoices,y=b.setTabGroupChoices,E=(0,r.useState)(k),w=E[0],P=E[1],_=[],A=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var R=N[m];null!=R&&R!==w&&f.some((function(e){return e.value===R}))&&P(R)}var T=function(e){var n=e.currentTarget,t=_.indexOf(n),a=f[t].value;a!==w&&(A(n),P(a),null!=m&&y(m,a))},O=function(e){var n,t=null;switch(e.key){case"ArrowRight":var a=_.indexOf(e.currentTarget)+1;t=_[a]||_[0];break;case"ArrowLeft":var r=_.indexOf(e.currentTarget)-1;t=_[r]||_[_.length-1]}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":s},g)},f.map((function(e){var n=e.value,t=e.label,l=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===n?0:-1,"aria-selected":w===n,key:n,ref:function(e){return _.push(e)},onKeyDown:O,onFocus:T,onClick:T},l,{className:(0,o.Z)("tabs__item",d,null==l?void 0:l.className,{"tabs__item--active":w===n})}),null!=t?t:n)}))),u?(0,r.cloneElement)(v.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},v.map((function(e,n){return(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==w})}))))}function s(e){var n=(0,l.Z)();return r.createElement(u,(0,a.Z)({key:String(n)},e))}},7042:(e,n,t)=>{t.r(n),t.d(n,{frontMatter:()=>u,contentTitle:()=>s,metadata:()=>c,toc:()=>p,default:()=>g});var a=t(7462),r=t(3366),l=(t(7294),t(3905)),i=t(9877),o=t(8215),d=["components"],u={id:"client-side-rendering",title:"Client-side rendering"},s=void 0,c={unversionedId:"guides/client-side-rendering",id:"guides/client-side-rendering",title:"Client-side rendering",description:"Introduction",source:"@site/tmp-docs/guides/client-side-rendering.md",sourceDirName:"guides",slug:"/guides/client-side-rendering",permalink:"/docs/guides/client-side-rendering",editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/guides/client-side-rendering.md",tags:[],version:"current",frontMatter:{id:"client-side-rendering",title:"Client-side rendering"},sidebar:"sidebar",previous:{title:"Deployment",permalink:"/docs/guides/deploy"},next:{title:"CPU profiling",permalink:"/docs/guides/cpu-profiling"}},p=[{value:"Introduction",id:"introduction",children:[],level:2},{value:"Get started",id:"get-started",children:[],level:2},{value:"Deep dive",id:"deep-dive",children:[],level:2}],m={toc:p};function g(e){var n=e.components,t=(0,r.Z)(e,d);return(0,l.kt)("wrapper",(0,a.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"introduction"},"Introduction"),(0,l.kt)("p",null,"Tramvai doesn't have full client-side rendering mode, but has limited ability to render page content only in browser.\nIn this mode, all requests to application server will be handled as usual, but instead of real pages content rendering, we can render only light-weight fallback (spinner, skeleton, etc.) on server.\nAfter page loading in browser, full page will be rendered.\nIt is very useful to reduce the load on the application server."),(0,l.kt)("h2",{id:"get-started"},"Get started"),(0,l.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"Before using a feature, make sure you use ",(0,l.kt)("inlineCode",{parentName:"p"},"SpaRouterModule"),"!\nWith ",(0,l.kt)("inlineCode",{parentName:"p"},"NoSpaRouterModule")," you will have a cyclic redirect."))),(0,l.kt)("p",null,"\u231b Install ",(0,l.kt)("inlineCode",{parentName:"p"},"@tramvai/module-page-render-mode")," module:"),(0,l.kt)(i.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"npm",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @tramvai/module-page-render-mode\n"))),(0,l.kt)(o.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/module-page-render-mode\n")))),(0,l.kt)("p",null,"\u231b \u0421onnect module in the project:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp } from '@tramvai/core';\nimport { PageRenderModeModule } from '@tramvai/module-page-render-mode';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [ PageRenderModeModule ],\n});\n")),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/docs/references/modules/page-render-mode"},"@tramvai/module-page-render-mode documentation")),(0,l.kt)("p",null,"After that, we need to provide default fallback.\nIn this guide, it fill be empty white page."),(0,l.kt)("p",null,"\u231b Provide fallback page:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import React from 'react';\nimport { createApp } from '@tramvai/core';\nimport {\n  PageRenderModeModule,\n  // highlight-next-line\n  PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,\n} from '@tramvai/module-page-render-mode';\n\n// highlight-next-line\nconst Fallback = () => null;\n\ncreateApp({\n  name: 'tincoin',\n  modules: [ PageRenderModeModule ],\n  providers: [\n    // highlight-start\n    {\n      provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,\n      useValue: Fallback,\n    },\n    // highlight-end\n  ],\n});\n")),(0,l.kt)("p",null,"\u231b Prevent Header and Footer rendering:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import React from 'react';\nimport { createApp } from '@tramvai/core';\nimport {\n  PageRenderModeModule,\n  PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,\n  // highlight-next-line\n  PAGE_RENDER_WRAPPER_TYPE,\n} from '@tramvai/module-page-render-mode';\n\nconst Fallback = () => null;\n\ncreateApp({\n  name: 'tincoin',\n  modules: [ PageRenderModeModule ],\n  providers: [\n    {\n      provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,\n      useValue: Fallback,\n    },\n    // highlight-start\n    {\n      provide: PAGE_RENDER_WRAPPER_TYPE,\n      useValue: 'layout',\n    },\n    // highlight-end\n  ],\n});\n")),(0,l.kt)("p",null,"After that, you can run ",(0,l.kt)("inlineCode",{parentName:"p"},"client")," rendering mode for concrete pages, or for all of it.\nIn this guide, we will enable ",(0,l.kt)("inlineCode",{parentName:"p"},"client")," mode for all pages."),(0,l.kt)("p",null,"\u231b Enable ",(0,l.kt)("inlineCode",{parentName:"p"},"client")," mode:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import React from 'react';\nimport { createApp } from '@tramvai/core';\n  // highlight-next-line\nimport { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';\nimport {\n  PageRenderModeModule,\n  PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,\n  PAGE_RENDER_WRAPPER_TYPE,\n} from '@tramvai/module-page-render-mode';\n\nconst Fallback = () => null;\n\ncreateApp({\n  name: 'tincoin',\n  modules: [ PageRenderModeModule ],\n  providers: [\n    {\n      provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,\n      useValue: Fallback,\n    },\n    {\n      provide: PAGE_RENDER_WRAPPER_TYPE,\n      useValue: 'layout',\n    },\n    // highlight-start\n    {\n      provide: TRAMVAI_RENDER_MODE,\n      useValue: 'client',\n    },\n    // highlight-end\n  ],\n});\n")),(0,l.kt)("p",null,"After that, all requests to application will return white page, and original content will be rendered after main scripts will be loaded, parsed and executed."),(0,l.kt)("h2",{id:"deep-dive"},"Deep dive"),(0,l.kt)("p",null,"For achieve maximum server performance, we can cache our page fallback, and distribute it from the cdn or balancer.\nThis will completely free up the application server."),(0,l.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"When caching a fallback, your users potentially can have a outdated content.\nAlso, you will have the same meta tags for all application pages, it can affect SEO."))),(0,l.kt)("p",null,"In client-side rendering mode, you can generate static HTML from every page, but we recommended to create special static route for this.\nIt will allow you to change meta tags information.\nExample below use ",(0,l.kt)("a",{parentName:"p",href:"/docs/features/routing/file-system-pages#file-system-pages"},"file-system pages feature"),"."),(0,l.kt)("p",null,"\u231b At first, create empty fallback page:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="pages/FallbackPage.tsx"',title:'"pages/FallbackPage.tsx"'},"import React from 'react';\n\nexport const FallbackPage = () => {\n  return null;\n};\n\nexport default FallbackPage;\n")),(0,l.kt)("p",null,"\u231b And add new static route with this page to application:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const routes = [\n  {\n    name: 'fallback',\n    path: '/__secret_fallback__/',\n    config: {\n      pageComponent: '@/pages/FallbackPage',\n      meta: {\n        seo: {\n          metaTags: {\n            title: 'Some common title',\n          },\n        }\n      }\n    },\n  },\n]\n")),(0,l.kt)("p",null,"\u231b Then build your application as usual:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai build {{ appName }}\n")),(0,l.kt)("p",null,"\u231b In the end, generate static HTML only for one page (if we use default fallback for all pages, page url doesn't matter):"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai static {{ appName }} --buildType=none --onlyPages=/__secret_fallback__/\n")),(0,l.kt)("p",null,"After this steps, you can find a file ",(0,l.kt)("inlineCode",{parentName:"p"},"dist/static/__secret_fallback__/index.html"),".\nYou can serve this file from CDN or balancer, and it will be working as usual SPA."))}g.isMDXComponent=!0}}]);