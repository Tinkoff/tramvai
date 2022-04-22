"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5749],{3905:(e,n,a)=>{a.d(n,{Zo:()=>u,kt:()=>m});var t=a(7294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function l(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function o(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?l(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function i(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},l=Object.keys(e);for(t=0;t<l.length;t++)a=l[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)a=l[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var d=t.createContext({}),p=function(e){var n=t.useContext(d),a=n;return e&&(a="function"==typeof e?e(n):o(o({},n),e)),a},u=function(e){var n=p(e.components);return t.createElement(d.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},s=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,l=e.originalType,d=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),s=p(a),m=r,f=s["".concat(d,".").concat(m)]||s[m]||c[m]||l;return a?t.createElement(f,o(o({ref:n},u),{},{components:a})):t.createElement(f,o({ref:n},u))}));function m(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=s;var i={};for(var d in n)hasOwnProperty.call(n,d)&&(i[d]=n[d]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var p=2;p<l;p++)o[p]=a[p];return t.createElement.apply(null,o)}return t.createElement.apply(null,a)}s.displayName="MDXCreateElement"},8215:(e,n,a)=>{a.d(n,{Z:()=>r});var t=a(7294);const r=function(e){var n=e.children,a=e.hidden,r=e.className;return t.createElement("div",{role:"tabpanel",hidden:a,className:r},n)}},9877:(e,n,a)=>{a.d(n,{Z:()=>u});var t=a(7462),r=a(7294),l=a(2389),o=a(5773),i=a(6010);const d="tabItem_LplD";function p(e){var n,a,l,p=e.lazy,u=e.block,c=e.defaultValue,s=e.values,m=e.groupId,f=e.className,g=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=s?s:g.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),v=(0,o.lx)(k,(function(e,n){return e.value===n.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===c?c:null!=(n=null!=c?c:null==(a=g.find((function(e){return e.props.default})))?void 0:a.props.value)?n:null==(l=g[0])?void 0:l.props.value;if(null!==b&&!k.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+k.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var h=(0,o.UB)(),N=h.tabGroupChoices,y=h.setTabGroupChoices,E=(0,r.useState)(b),w=E[0],C=E[1],R=[],P=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var D=N[m];null!=D&&D!==w&&k.some((function(e){return e.value===D}))&&C(D)}var O=function(e){var n=e.currentTarget,a=R.indexOf(n),t=k[a].value;t!==w&&(P(n),C(t),null!=m&&y(m,t))},F=function(e){var n,a=null;switch(e.key){case"ArrowRight":var t=R.indexOf(e.currentTarget)+1;a=R[t]||R[0];break;case"ArrowLeft":var r=R.indexOf(e.currentTarget)-1;a=R[r]||R[R.length-1]}null==(n=a)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},f)},k.map((function(e){var n=e.value,a=e.label,l=e.attributes;return r.createElement("li",(0,t.Z)({role:"tab",tabIndex:w===n?0:-1,"aria-selected":w===n,key:n,ref:function(e){return R.push(e)},onKeyDown:F,onFocus:O,onClick:O},l,{className:(0,i.Z)("tabs__item",d,null==l?void 0:l.className,{"tabs__item--active":w===n})}),null!=a?a:n)}))),p?(0,r.cloneElement)(g.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},g.map((function(e,n){return(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==w})}))))}function u(e){var n=(0,l.Z)();return r.createElement(p,(0,t.Z)({key:String(n)},e))}},6893:(e,n,a)=>{a.r(n),a.d(n,{frontMatter:()=>p,contentTitle:()=>u,metadata:()=>c,toc:()=>s,default:()=>f});var t=a(7462),r=a(3366),l=(a(7294),a(3905)),o=a(9877),i=a(8215),d=["components"],p={},u=void 0,c={unversionedId:"references/modules/page-render-mode",id:"references/modules/page-render-mode",title:"page-render-mode",description:"Enable different rendering modes for specific pages:",source:"@site/tmp-docs/references/modules/page-render-mode.md",sourceDirName:"references/modules",slug:"/references/modules/page-render-mode",permalink:"/docs/references/modules/page-render-mode",editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/modules/page-render-mode.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"mocker",permalink:"/docs/references/modules/mocker"},next:{title:"react-query-devtools",permalink:"/docs/references/modules/react-query-devtools"}},s=[{value:"Installation",id:"installation",children:[],level:2},{value:"Usage",id:"usage",children:[{value:"Rendering mode",id:"rendering-mode",children:[{value:"Default mode",id:"default-mode",children:[],level:4},{value:"Mode for specifig pages",id:"mode-for-specifig-pages",children:[],level:4}],level:3},{value:"Fallback",id:"fallback",children:[{value:"Default fallback",id:"default-fallback",children:[],level:4},{value:"Fallback for specific pages",id:"fallback-for-specific-pages",children:[],level:4}],level:3}],level:2},{value:"How-to",id:"how-to",children:[{value:"How to prevent Header and Footer Rendering",id:"how-to-prevent-header-and-footer-rendering",children:[],level:3}],level:2},{value:"Troubleshooting",id:"troubleshooting",children:[{value:"Fallback name conflicts",id:"fallback-name-conflicts",children:[],level:3}],level:2}],m={toc:s};function f(e){var n=e.components,a=(0,r.Z)(e,d);return(0,l.kt)("wrapper",(0,t.Z)({},m,a,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Enable different rendering modes for specific pages:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"ssr")),(0,l.kt)("p",{parentName:"li"},"SSR mode - provides default ",(0,l.kt)("inlineCode",{parentName:"p"},"tramvai")," behaviour, render full page on server-side.")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"client")),(0,l.kt)("p",{parentName:"li"},"Client mode - render only fallback for page component, then render full page on browser, after hydration.\nThis mode can significally improve server rendering performance, but not recommended for pages with high SEO impact.\nBy default, Header and Footer will be rendered as usual."))),(0,l.kt)("h2",{id:"installation"},"Installation"),(0,l.kt)("p",null,"You need to install ",(0,l.kt)("inlineCode",{parentName:"p"},"@tramvai/module-page-render-mode")),(0,l.kt)(o.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,l.kt)(i.Z,{value:"npm",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/module-page-render-mode\n"))),(0,l.kt)(i.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/module-page-render-mode\n")))),(0,l.kt)("p",null,"And connect in the project"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp } from '@tramvai/core';\nimport { PageRenderModeModule } from '@tramvai/module-page-render-mode';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [ PageRenderModeModule ],\n});\n")),(0,l.kt)("h2",{id:"usage"},"Usage"),(0,l.kt)("h3",{id:"rendering-mode"},"Rendering mode"),(0,l.kt)("p",null,"By default, this module connection has no changes, because default rendering mode is ",(0,l.kt)("inlineCode",{parentName:"p"},"ssr"),".\nYou can change this mode for all pages or for specific pages only."),(0,l.kt)("h4",{id:"default-mode"},"Default mode"),(0,l.kt)("p",null,"For global rendering mode changing, use token ",(0,l.kt)("inlineCode",{parentName:"p"},"TRAMVAI_RENDER_MODE")," from ",(0,l.kt)("inlineCode",{parentName:"p"},"@tramvai/tokens-render"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';\n\nconst provider = {\n  provide: TRAMVAI_RENDER_MODE,\n  useValue: 'client',\n};\n")),(0,l.kt)("h4",{id:"mode-for-specifig-pages"},"Mode for specifig pages"),(0,l.kt)("p",null,"For specific pages available two options:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"setting mode in route config:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const routes = [\n  {\n    name: 'main',\n    path: '/',\n    config: {\n      bundle: 'mainDefault',\n      pageComponent: 'pageDefault',\n      pageRenderMode: 'client',\n    },\n  },\n]\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"setting mode in page component static property:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"const PageComponent = () => <div>Page</div>;\n\nPageComponent.renderMode = 'client';\n\nexport default PageComponent;\n")))),(0,l.kt)("h3",{id:"fallback"},"Fallback"),(0,l.kt)("p",null,"Standard behaviour for SPA applications - render some fallback with spinner or page skeleton before application was rendered.\nYou can set default fallback for all pages with ",(0,l.kt)("inlineCode",{parentName:"p"},"client")," render mode, or only for specific pages."),(0,l.kt)("h4",{id:"default-fallback"},"Default fallback"),(0,l.kt)("p",null,"For setting default fallback, use token ",(0,l.kt)("inlineCode",{parentName:"p"},"PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT } from '@tramvai/module-page-render-mode';\n\nconst DefaultFallback = () => <div>Loading...</div>;\n\nconst provider = {\n  provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,\n  useValue: DefaultFallback,\n};\n")),(0,l.kt)("h4",{id:"fallback-for-specific-pages"},"Fallback for specific pages"),(0,l.kt)("p",null,"For specific pages available few options:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"add fallback to page component static property, use name ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackDefault"),":"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"const PageComponent = () => <div>Page</div>;\n\nconst PageFallback = () => <div>Loading...</div>;\n\nPageComponent.components = {\n  'pageRenderFallbackDefault': PageFallback,\n};\n\nexport default PageComponent;\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"add default fallback to bundle, use name ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackDefault"),":"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"const DefaultFallback = () => <div>Loading...</div>;\n\nconst mainDefaultBundle = createBundle({\n  name: 'mainDefault',\n  components: {\n    'pageRenderFallbackDefault': DefaultFallback,\n  },\n});\n\nexport default mainDefaultBundle;\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"and you can add fallback in route config, use key ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackComponent")," with any fallback name you provided in bundle or page component:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const routes = [\n  {\n    name: 'main',\n    path: '/',\n    config: {\n      bundle: 'mainDefault',\n      pageComponent: 'pageDefault',\n      pageRenderFallbackComponent: 'myOwnFallbackComponent',\n    },\n  },\n];\n")))),(0,l.kt)("h2",{id:"how-to"},"How-to"),(0,l.kt)("h3",{id:"how-to-prevent-header-and-footer-rendering"},"How to prevent Header and Footer Rendering"),(0,l.kt)("p",null,"By default, Header and Footer will be rendered as usual, because this module provide Page component wrapper.\nIf you want to make less work on server, use token ",(0,l.kt)("inlineCode",{parentName:"p"},"PAGE_RENDER_WRAPPER_TYPE")," with ",(0,l.kt)("inlineCode",{parentName:"p"},"layout")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"content")," value, e.g.:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const providers = [\n  {\n    provide: PAGE_RENDER_WRAPPER_TYPE,\n    useValue: 'layout',\n  },\n];\n")),(0,l.kt)("p",null,"With ",(0,l.kt)("inlineCode",{parentName:"p"},"client")," rendering mode, all layout will be rendered in browser."),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"PAGE_RENDER_WRAPPER_TYPE")," value will be passed to ",(0,l.kt)("a",{parentName:"p",href:"/docs/references/modules/render#basic-layout"},"default layout"),", where the library ",(0,l.kt)("a",{parentName:"p",href:"/docs/references/libs/tinkoff-layout#wrappers"},"@tinkoff/layout-factory")," is used."),(0,l.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,l.kt)("h3",{id:"fallback-name-conflicts"},"Fallback name conflicts"),(0,l.kt)("p",null,"You might have a potential issue with conflict existing components and render fallback component names - ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackComponent")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackDefault"),".\nFor avoiding this issues, just change fallback name prefix using token ",(0,l.kt)("inlineCode",{parentName:"p"},"PAGE_RENDER_FALLBACK_COMPONENT_PREFIX"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { PAGE_RENDER_FALLBACK_COMPONENT_PREFIX } from '@tramvai/module-page-render-mode';\n\nconst provider = {\n  provide: PAGE_RENDER_FALLBACK_COMPONENT_PREFIX,\n  useValue: 'myOwnRenderFallback',\n};\n")))}f.isMDXComponent=!0}}]);