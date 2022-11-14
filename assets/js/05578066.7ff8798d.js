"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5749],{3905:(e,a,n)=>{n.d(a,{Zo:()=>d,kt:()=>m});var t=n(7294);function r(e,a,n){return a in e?Object.defineProperty(e,a,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[a]=n,e}function l(e,a){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);a&&(t=t.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),n.push.apply(n,t)}return n}function o(e){for(var a=1;a<arguments.length;a++){var n=null!=arguments[a]?arguments[a]:{};a%2?l(Object(n),!0).forEach((function(a){r(e,a,n[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(n,a))}))}return e}function i(e,a){if(null==e)return{};var n,t,r=function(e,a){if(null==e)return{};var n,t,r={},l=Object.keys(e);for(t=0;t<l.length;t++)n=l[t],a.indexOf(n)>=0||(r[n]=e[n]);return r}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)n=l[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=t.createContext({}),s=function(e){var a=t.useContext(p),n=a;return e&&(n="function"==typeof e?e(a):o(o({},a),e)),n},d=function(e){var a=s(e.components);return t.createElement(p.Provider,{value:a},e.children)},c={inlineCode:"code",wrapper:function(e){var a=e.children;return t.createElement(t.Fragment,{},a)}},u=t.forwardRef((function(e,a){var n=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),u=s(n),m=r,f=u["".concat(p,".").concat(m)]||u[m]||c[m]||l;return n?t.createElement(f,o(o({ref:a},d),{},{components:n})):t.createElement(f,o({ref:a},d))}));function m(e,a){var n=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=u;var i={};for(var p in a)hasOwnProperty.call(a,p)&&(i[p]=a[p]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return t.createElement.apply(null,o)}return t.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5162:(e,a,n)=>{n.d(a,{Z:()=>o});var t=n(7294),r=n(6010);const l="tabItem_Ymn6";function o(e){var a=e.children,n=e.hidden,o=e.className;return t.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,o),hidden:n},a)}},5488:(e,a,n)=>{n.d(a,{Z:()=>m});var t=n(7462),r=n(7294),l=n(6010),o=n(2389),i=n(7392),p=n(7094),s=n(2466);const d="tabList__CuJ",c="tabItem_LNqP";function u(e){var a,n,o=e.lazy,u=e.block,m=e.defaultValue,f=e.values,g=e.groupId,k=e.className,v=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=f?f:v.map((function(e){var a=e.props;return{value:a.value,label:a.label,attributes:a.attributes}})),h=(0,i.l)(b,(function(e,a){return e.value===a.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var N=null===m?m:null!=(a=null!=m?m:null==(n=v.find((function(e){return e.props.default})))?void 0:n.props.value)?a:v[0].props.value;if(null!==N&&!b.some((function(e){return e.value===N})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+N+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=(0,p.U)(),E=y.tabGroupChoices,w=y.setTabGroupChoices,C=(0,r.useState)(N),P=C[0],_=C[1],R=[],T=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=g){var O=E[g];null!=O&&O!==P&&b.some((function(e){return e.value===O}))&&_(O)}var D=function(e){var a=e.currentTarget,n=R.indexOf(a),t=b[n].value;t!==P&&(T(a),_(t),null!=g&&w(g,String(t)))},x=function(e){var a,n=null;switch(e.key){case"ArrowRight":var t,r=R.indexOf(e.currentTarget)+1;n=null!=(t=R[r])?t:R[0];break;case"ArrowLeft":var l,o=R.indexOf(e.currentTarget)-1;n=null!=(l=R[o])?l:R[R.length-1]}null==(a=n)||a.focus()};return r.createElement("div",{className:(0,l.Z)("tabs-container",d)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},k)},b.map((function(e){var a=e.value,n=e.label,o=e.attributes;return r.createElement("li",(0,t.Z)({role:"tab",tabIndex:P===a?0:-1,"aria-selected":P===a,key:a,ref:function(e){return R.push(e)},onKeyDown:x,onFocus:D,onClick:D},o,{className:(0,l.Z)("tabs__item",c,null==o?void 0:o.className,{"tabs__item--active":P===a})}),null!=n?n:a)}))),o?(0,r.cloneElement)(v.filter((function(e){return e.props.value===P}))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},v.map((function(e,a){return(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==P})}))))}function m(e){var a=(0,o.Z)();return r.createElement(u,(0,t.Z)({key:String(a)},e))}},6893:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>u,contentTitle:()=>d,default:()=>g,frontMatter:()=>s,metadata:()=>c,toc:()=>m});var t=n(7462),r=n(3366),l=(n(7294),n(3905)),o=n(5488),i=n(5162),p=["components"],s={},d=void 0,c={unversionedId:"references/modules/page-render-mode",id:"references/modules/page-render-mode",title:"page-render-mode",description:"Enable different rendering modes for specific pages:",source:"@site/tmp-docs/references/modules/page-render-mode.md",sourceDirName:"references/modules",slug:"/references/modules/page-render-mode",permalink:"/tramvai/docs/references/modules/page-render-mode",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/modules/page-render-mode.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"mocker",permalink:"/tramvai/docs/references/modules/mocker"},next:{title:"react-query",permalink:"/tramvai/docs/references/modules/react-query"}},u={},m=[{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:2},{value:"Rendering mode",id:"rendering-mode",level:3},{value:"Default mode",id:"default-mode",level:4},{value:"Mode for specifig pages",id:"mode-for-specifig-pages",level:4},{value:"Fallback",id:"fallback",level:3},{value:"Default fallback",id:"default-fallback",level:4},{value:"Fallback for specific pages",id:"fallback-for-specific-pages",level:4},{value:"Static pages",id:"static-pages",level:3},{value:"Options",id:"options",level:4},{value:"How-to",id:"how-to",level:2},{value:"How to prevent Header and Footer Rendering",id:"how-to-prevent-header-and-footer-rendering",level:3},{value:"How to clear static page cache",id:"how-to-clear-static-page-cache",level:3},{value:"How to disable background requests for static pages",id:"how-to-disable-background-requests-for-static-pages",level:3},{value:"How to enable 5xx requests caching for static pages",id:"how-to-enable-5xx-requests-caching-for-static-pages",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"Fallback name conflicts",id:"fallback-name-conflicts",level:3}],f={toc:m};function g(e){var a=e.components,n=(0,r.Z)(e,p);return(0,l.kt)("wrapper",(0,t.Z)({},f,n,{components:a,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Enable different rendering modes for specific pages:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"ssr")),(0,l.kt)("p",{parentName:"li"},"SSR mode - provides default ",(0,l.kt)("inlineCode",{parentName:"p"},"tramvai")," behaviour, render full page on server-side.")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"client")),(0,l.kt)("p",{parentName:"li"},"Client mode - render only fallback for page component, then render full page on browser, after hydration."),(0,l.kt)("p",{parentName:"li"},"This mode can significally improve server rendering performance, but not recommended for pages with high SEO impact."),(0,l.kt)("p",{parentName:"li"},"By default, Header and Footer will be rendered as usual.")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"static")),(0,l.kt)("p",{parentName:"li"},"Static mode - in-memory cache for page HTML markup."),(0,l.kt)("p",{parentName:"li"},"Response for first request for specific page, without ",(0,l.kt)("inlineCode",{parentName:"p"},"Cookie")," header, will be cached directly, and sended as response to next requests for this page. Otherwise, unpersonalized request for the same page will be triggered at background, and result will be cached."),(0,l.kt)("p",{parentName:"li"},"5xx responses will not be cached by default, but this behaviour are configurable."),(0,l.kt)("p",{parentName:"li"},"Any responses from cache will have ",(0,l.kt)("inlineCode",{parentName:"p"},"X-Tramvai-Static-Page-From-Cache")," header."),(0,l.kt)("p",{parentName:"li"},"Additional metric with name ",(0,l.kt)("inlineCode",{parentName:"p"},"static_pages_cache_hit")," will be added with cache hits counter."),(0,l.kt)("p",{parentName:"li"},"Response from cache will be sended from ",(0,l.kt)("inlineCode",{parentName:"p"},"customer_start")," command line, and next lines execution will be aborted."),(0,l.kt)("p",{parentName:"li"},"Cache will be segmented by page path and method, request hostname, device type and browser (modern or default group)."))),(0,l.kt)("h2",{id:"installation"},"Installation"),(0,l.kt)("p",null,"You need to install ",(0,l.kt)("inlineCode",{parentName:"p"},"@tramvai/module-page-render-mode")),(0,l.kt)(o.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,l.kt)(i.Z,{value:"npm",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/module-page-render-mode\n"))),(0,l.kt)(i.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/module-page-render-mode\n")))),(0,l.kt)("p",null,"And connect in the project"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp } from '@tramvai/core';\nimport { PageRenderModeModule } from '@tramvai/module-page-render-mode';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [PageRenderModeModule],\n});\n")),(0,l.kt)("h2",{id:"usage"},"Usage"),(0,l.kt)("h3",{id:"rendering-mode"},"Rendering mode"),(0,l.kt)("p",null,"By default, this module connection has no changes, because default rendering mode is ",(0,l.kt)("inlineCode",{parentName:"p"},"ssr"),". You can change this mode for all pages or for specific pages only."),(0,l.kt)("h4",{id:"default-mode"},"Default mode"),(0,l.kt)("p",null,"For global rendering mode changing, use token ",(0,l.kt)("inlineCode",{parentName:"p"},"TRAMVAI_RENDER_MODE")," from ",(0,l.kt)("inlineCode",{parentName:"p"},"@tramvai/tokens-render"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';\n\nconst provider = {\n  provide: TRAMVAI_RENDER_MODE,\n  useValue: 'client',\n};\n")),(0,l.kt)("h4",{id:"mode-for-specifig-pages"},"Mode for specifig pages"),(0,l.kt)("p",null,"For specific pages available two options:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"setting mode in route config:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const routes = [\n  {\n    name: 'main',\n    path: '/',\n    config: {\n      bundle: 'mainDefault',\n      pageComponent: 'pageDefault',\n      pageRenderMode: 'client',\n    },\n  },\n];\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"setting mode in page component static property:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"const PageComponent = () => <div>Page</div>;\n\nPageComponent.renderMode = 'client';\n\nexport default PageComponent;\n")))),(0,l.kt)("h3",{id:"fallback"},"Fallback"),(0,l.kt)("p",null,"Standard behaviour for SPA applications - render some fallback with spinner or page skeleton before application was rendered. You can set default fallback for all pages with ",(0,l.kt)("inlineCode",{parentName:"p"},"client")," render mode, or only for specific pages."),(0,l.kt)("h4",{id:"default-fallback"},"Default fallback"),(0,l.kt)("p",null,"For setting default fallback, use token ",(0,l.kt)("inlineCode",{parentName:"p"},"PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT } from '@tramvai/module-page-render-mode';\n\nconst DefaultFallback = () => <div>Loading...</div>;\n\nconst provider = {\n  provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,\n  useValue: DefaultFallback,\n};\n")),(0,l.kt)("h4",{id:"fallback-for-specific-pages"},"Fallback for specific pages"),(0,l.kt)("p",null,"For specific pages available few options:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"add fallback to page component static property, use name ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackDefault"),":"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { PageComponent } from '@tramvai/react';\n\nconst Page: PageComponent = () => <div>Page</div>;\n\nconst PageFallback = () => <div>Loading...</div>;\n\nPage.components = {\n  pageRenderFallbackDefault: PageFallback,\n};\n\nexport default Page;\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"add default fallback to bundle, use name ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackDefault"),":"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"const DefaultFallback = () => <div>Loading...</div>;\n\nconst mainDefaultBundle = createBundle({\n  name: 'mainDefault',\n  components: {\n    pageRenderFallbackDefault: DefaultFallback,\n  },\n});\n\nexport default mainDefaultBundle;\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"and you can add fallback in route config, use key ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackComponent")," with any fallback name you provided in bundle or page component:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const routes = [\n  {\n    name: 'main',\n    path: '/',\n    config: {\n      bundle: 'mainDefault',\n      pageComponent: 'pageDefault',\n      pageRenderFallbackComponent: 'myOwnFallbackComponent',\n    },\n  },\n];\n")))),(0,l.kt)("h3",{id:"static-pages"},"Static pages"),(0,l.kt)("h4",{id:"options"},"Options"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"ttl")," parameter spicified page response cache time. Default - ",(0,l.kt)("inlineCode",{parentName:"li"},"60000")," ms."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"maxSize")," parameter spicified maximum cached urls count (can be up to 4 pages per url for different segments). Default - ",(0,l.kt)("inlineCode",{parentName:"li"},"1000"),". For apps with heavy HTML and a lot of urls memory usage can be increased significantly.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const provider = {\n  provide: STATIC_PAGES_OPTIONS_TOKEN,\n  useValue: {\n    ttl: 60 * 1000,\n    maxSize: 1000,\n  },\n};\n")),(0,l.kt)("h2",{id:"how-to"},"How-to"),(0,l.kt)("h3",{id:"how-to-prevent-header-and-footer-rendering"},"How to prevent Header and Footer Rendering"),(0,l.kt)("p",null,"By default, Header and Footer will be rendered as usual, because this module provide Page component wrapper. If you want to make less work on server, use token ",(0,l.kt)("inlineCode",{parentName:"p"},"PAGE_RENDER_WRAPPER_TYPE")," with ",(0,l.kt)("inlineCode",{parentName:"p"},"layout")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"content")," value, e.g.:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const providers = [\n  {\n    provide: PAGE_RENDER_WRAPPER_TYPE,\n    useValue: 'layout',\n  },\n];\n")),(0,l.kt)("p",null,"With ",(0,l.kt)("inlineCode",{parentName:"p"},"client")," rendering mode, all layout will be rendered in browser."),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"PAGE_RENDER_WRAPPER_TYPE")," value will be passed to ",(0,l.kt)("a",{parentName:"p",href:"/tramvai/docs/references/modules/render#basic-layout"},"default layout"),", where the library ",(0,l.kt)("a",{parentName:"p",href:"/tramvai/docs/references/libs/tinkoff-layout#wrappers"},"@tinkoff/layout-factory")," is used."),(0,l.kt)("h3",{id:"how-to-clear-static-page-cache"},"How to clear static page cache"),(0,l.kt)("p",null,"If you want to clear all cache, make POST request to special papi endpoint without body - ",(0,l.kt)("inlineCode",{parentName:"p"},"/{appName}/private/papi/revalidate/"),"."),(0,l.kt)("p",null,"For specific page, just add ",(0,l.kt)("inlineCode",{parentName:"p"},"path")," parameter to request body, e.g. for ",(0,l.kt)("inlineCode",{parentName:"p"},"/static/")," - ",(0,l.kt)("inlineCode",{parentName:"p"},"{ path: 'static' }"),"."),(0,l.kt)("h3",{id:"how-to-disable-background-requests-for-static-pages"},"How to disable background requests for static pages"),(0,l.kt)("p",null,"For example, you want to cache only requests without cookies, without extra requests into the application:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const provider = {\n  provide: STATIC_PAGES_BACKGROUND_FETCH_ENABLED,\n  useValue: () => false,\n};\n")),(0,l.kt)("h3",{id:"how-to-enable-5xx-requests-caching-for-static-pages"},"How to enable 5xx requests caching for static pages"),(0,l.kt)("p",null,"For example, 5xx responses are expected behaviour:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const provider = {\n  provide: STATIC_PAGES_CACHE_5xx_RESPONSE,\n  useValue: () => true,\n};\n")),(0,l.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,l.kt)("h3",{id:"fallback-name-conflicts"},"Fallback name conflicts"),(0,l.kt)("p",null,"You might have a potential issue with conflict existing components and render fallback component names - ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackComponent")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"pageRenderFallbackDefault"),". For avoiding this issues, just change fallback name prefix using token ",(0,l.kt)("inlineCode",{parentName:"p"},"PAGE_RENDER_FALLBACK_COMPONENT_PREFIX"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { PAGE_RENDER_FALLBACK_COMPONENT_PREFIX } from '@tramvai/module-page-render-mode';\n\nconst provider = {\n  provide: PAGE_RENDER_FALLBACK_COMPONENT_PREFIX,\n  useValue: 'myOwnRenderFallback',\n};\n")))}g.isMDXComponent=!0}}]);