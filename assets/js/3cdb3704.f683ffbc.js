"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7591],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),u=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=u(n),d=r,v=m["".concat(i,".").concat(d)]||m[d]||p[d]||o;return n?a.createElement(v,l(l({ref:t},c),{},{components:n})):a.createElement(v,l({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,l[1]=s;for(var u=2;u<o;u++)l[u]=n[u];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(7462),r=n(7294),o=n(2389),l=n(5773),s=n(6010);const i="tabItem_LplD";function u(e){var t,n,o,u=e.lazy,c=e.block,p=e.defaultValue,m=e.values,d=e.groupId,v=e.className,f=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=m?m:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),y=(0,l.lx)(g,(function(e,t){return e.value===t.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===p?p:null!=(t=null!=p?p:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(o=f[0])?void 0:o.props.value;if(null!==b&&!g.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,l.UB)(),h=k.tabGroupChoices,T=k.setTabGroupChoices,x=(0,r.useState)(b),P=x[0],N=x[1],w=[],O=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var E=h[d];null!=E&&E!==P&&g.some((function(e){return e.value===E}))&&N(E)}var I=function(e){var t=e.currentTarget,n=w.indexOf(t),a=g[n].value;a!==P&&(O(t),N(a),null!=d&&T(d,a))},Z=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=w.indexOf(e.currentTarget)+1;n=w[a]||w[0];break;case"ArrowLeft":var r=w.indexOf(e.currentTarget)-1;n=w[r]||w[w.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":c},v)},g.map((function(e){var t=e.value,n=e.label,o=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:P===t?0:-1,"aria-selected":P===t,key:t,ref:function(e){return w.push(e)},onKeyDown:Z,onFocus:I,onClick:I},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":P===t})}),null!=n?n:t)}))),u?(0,r.cloneElement)(f.filter((function(e){return e.props.value===P}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==P})}))))}function c(e){var t=(0,o.Z)();return r.createElement(u,(0,a.Z)({key:String(t)},e))}},5214:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>u,contentTitle:()=>c,metadata:()=>p,toc:()=>m,default:()=>v});var a=n(7462),r=n(3366),o=(n(7294),n(3905)),l=n(9877),s=n(8215),i=["components"],u={},c=void 0,p={unversionedId:"references/tramvai/storybook-addon",id:"references/tramvai/storybook-addon",title:"storybook-addon",description:"Storybook addon for tramvai apps",source:"@site/tmp-docs/references/tramvai/storybook-addon.md",sourceDirName:"references/tramvai",slug:"/references/tramvai/storybook-addon",permalink:"/docs/references/tramvai/storybook-addon",editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/tramvai/storybook-addon.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"unit",permalink:"/docs/references/tramvai/test/unit"},next:{title:"base",permalink:"/docs/references/cli/base"}},m=[{value:"Installation",id:"installation",children:[],level:2},{value:"Features",id:"features",children:[],level:2},{value:"How to",id:"how-to",children:[{value:"Access to DI container",id:"access-to-di-container",children:[],level:3},{value:"Router hooks and components",id:"router-hooks-and-components",children:[],level:3},{value:"React Query",id:"react-query",children:[],level:3},{value:"Page actions running",id:"page-actions-running",children:[],level:3},{value:"Http clients with real requests",id:"http-clients-with-real-requests",children:[],level:3}],level:2}],d={toc:m};function v(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Storybook addon for tramvai apps"),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"You need to install ",(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/storybook-addon"),":"),(0,o.kt)(l.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @tramvai/storybook-addon\n"))),(0,o.kt)(s.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/storybook-addon\n")))),(0,o.kt)("p",null,"And connect addon in the storybook configuration file:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js",metastring:'title=".storybook/main.js"',title:'".storybook/main.js"'},'module.exports = {\n  addons: ["@tramvai/storybook-addon"]\n}\n')),(0,o.kt)("h2",{id:"features"},"Features"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Providers for DI container"),(0,o.kt)("li",{parentName:"ul"},"Providers for router"),(0,o.kt)("li",{parentName:"ul"},"Providers for ",(0,o.kt)("inlineCode",{parentName:"li"},"react-query")),(0,o.kt)("li",{parentName:"ul"},"Page actions support"),(0,o.kt)("li",{parentName:"ul"},"tramvai ",(0,o.kt)("inlineCode",{parentName:"li"},"babel")," configuration"),(0,o.kt)("li",{parentName:"ul"},"tramvai ",(0,o.kt)("inlineCode",{parentName:"li"},"postcss")," configuration")),(0,o.kt)("h2",{id:"how-to"},"How to"),(0,o.kt)("h3",{id:"access-to-di-container"},"Access to DI container"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"page",label:"page.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { LOGGER_TOKEN } from '@tramvai/tokens-common';\n\nexport const Page = () => {\n  const logger = useDi(LOGGER_TOKEN);\n\n  logger.info('render');\n\n  return (\n    <h1>Page</h1>\n  );\n}\n"))),(0,o.kt)(s.Z,{value:"story",label:"page.stories.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';\nimport { Page } from './page';\n\n// You can pass to DI container any reducers, providers and modules\nconst parameters: TramvaiStoriesParameters = {\n  tramvai: {\n    stores: [],\n    initialState: {},\n    providers: [],\n    modules: [],\n  },\n};\n\nexport default {\n  title: 'Page',\n  component: Page,\n  parameters,\n};\n\nexport const PageStory = () => <Page />;\n")))),(0,o.kt)("h3",{id:"router-hooks-and-components"},"Router hooks and components"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"page",label:"page.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Link, useUrl } from '@tramvai/module-router';\n\nexport const Page = () => {\n  const url = useUrl();\n\n  return (\n    <>\n      <h1>Page at {url.pathname}</h1>\n      <p>\n        <Link url=\"/third/\">to third page</Link>\n      </p>\n    </>\n  );\n}\n"))),(0,o.kt)(s.Z,{value:"story",label:"page.stories.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';\nimport { Page } from './page';\n\n// You can pass to router current route and url\nconst parameters: TramvaiStoriesParameters = {\n  tramvai: {\n    currentRoute: { name: 'second', path: '/second/' },\n  },\n};\n\nexport default {\n  title: 'Page',\n  component: Page,\n  parameters,\n};\n\nexport const PageStory = () => <Page />;\n")))),(0,o.kt)("h3",{id:"react-query"},"React Query"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"page",label:"page.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createQuery, useQuery } from '@tramvai/react-query';\n\n\nconst query = createQuery({\n  key: 'base',\n  fn: async () => {\n    return { foo: 'bar' };\n  },\n});\n\nexport const Page = () => {\n  const { data, isLoading } = useQuery(query);\n\n  return (\n    <>\n      <h1>Page</h1>\n      <p>\n        {isLoading ? 'Loading...' : data.foo}\n      </p>\n    </>\n  );\n}\n"))),(0,o.kt)(s.Z,{value:"story",label:"page.stories.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';\nimport { Page } from './page';\n\n// You can pass to router QueryClient default options\nconst parameters: TramvaiStoriesParameters = {\n  tramvai: {\n    reactQueryDefaultOptions: {\n      queries: {\n        refetchOnMount: false,\n        refetchOnReconnect: false,\n        refetchOnWindowFocus: false,\n      },\n    },\n  },\n};\n\nexport default {\n  title: 'Page',\n  component: Page,\n  parameters,\n};\n\nexport const PageStory = () => <Page />;\n")))),(0,o.kt)("h3",{id:"page-actions-running"},"Page actions running"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"page",label:"page.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { declareAction } from '@tramvai/core';\n\nconst serverAction = declareAction({\n  name: 'server-action',\n  fn() {\n    console.log('server action');\n  },\n  conditions: {\n    onlyServer: true,\n  },\n});\n\nconst browserAction = declareAction({\n  name: 'browser-action',\n  fn() {\n    console.log('browser action');\n  },\n  conditions: {\n    onlyBrowser: true,\n  },\n});\n\nexport const Page = () => {\n  return (\n    <h1>Page</h1>\n  );\n}\n\nPage.actions = [serverAction, browserAction];\n"))),(0,o.kt)(s.Z,{value:"story",label:"page.stories.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';\nimport { Page } from './page';\n\n// Actions with `onlyBrowser` condition will be executed\nconst parameters: TramvaiStoriesParameters = {\n  tramvai: {\n    actions: Page.actions,\n  },\n};\n\nexport default {\n  title: 'Page',\n  component: Page,\n  parameters,\n};\n\nexport const PageStory = () => <Page />;\n")))),(0,o.kt)("h3",{id:"http-clients-with-real-requests"},"Http clients with real requests"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"page",label:"page.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { declareAction } from '@tramvai/core';\n\nconst httpRequestAction = declareAction({\n  name: 'http-request-action',\n  async fn() {\n    return this.deps.httpClient.get('/');\n  },\n  deps: {\n    httpClient: HTTP_CLIENT,\n  },\n});\n\nexport const Page = () => {\n  return (\n    <h1>Page</h1>\n  );\n}\n\nPage.actions = [httpRequestAction];\n"))),(0,o.kt)(s.Z,{value:"story",label:"page.stories.tsx",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { HttpClientModule } from '@tramvai/module-http-client';\nimport type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';\nimport { Page } from './page';\n\n// HttpClientModule is required for real requests\nconst parameters: TramvaiStoriesParameters = {\n  tramvai: {\n    actions: Page.actions,\n    modules: [HttpClientModule],\n  },\n};\n\nexport default {\n  title: 'Page',\n  component: Page,\n  parameters,\n};\n\nexport const PageStory = () => <Page />;\n")))))}v.isMDXComponent=!0}}]);