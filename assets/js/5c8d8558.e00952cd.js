"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4806],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),u=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=u(e.components);return r.createElement(s.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},c=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=u(t),m=a,k=c["".concat(s,".").concat(m)]||c[m]||d[m]||o;return t?r.createElement(k,i(i({ref:n},p),{},{components:t})):r.createElement(k,i({ref:n},p))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=c;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var u=2;u<o;u++)i[u]=t[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}c.displayName="MDXCreateElement"},5162:(e,n,t)=>{t.d(n,{Z:()=>i});var r=t(7294),a=t(6010);const o="tabItem_Ymn6";function i(e){var n=e.children,t=e.hidden,i=e.className;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(o,i),hidden:t},n)}},4866:(e,n,t)=>{t.d(n,{Z:()=>T});var r=t(7462),a=t(7294),o=t(6010),i=t(2466),l=t(6550),s=t(1980),u=t(7392),p=t(12);function d(e){return function(e){return a.Children.map(e,(function(e){if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')}))}(e).map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes,default:n.default}}))}function c(e){var n=e.values,t=e.children;return(0,a.useMemo)((function(){var e=null!=n?n:d(t);return function(e){var n=(0,u.l)(e,(function(e,n){return e.value===n.value}));if(n.length>0)throw new Error('Docusaurus error: Duplicate values "'+n.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.')}(e),e}),[n,t])}function m(e){var n=e.value;return e.tabValues.some((function(e){return e.value===n}))}function k(e){var n=e.queryString,t=void 0!==n&&n,r=e.groupId,o=(0,l.k6)(),i=function(e){var n=e.queryString,t=void 0!==n&&n,r=e.groupId;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=r?r:null}({queryString:t,groupId:r});return[(0,s._X)(i),(0,a.useCallback)((function(e){if(i){var n=new URLSearchParams(o.location.search);n.set(i,e),o.replace(Object.assign({},o.location,{search:n.toString()}))}}),[i,o])]}function v(e){var n,t,r,o,i=e.defaultValue,l=e.queryString,s=void 0!==l&&l,u=e.groupId,d=c(e),v=(0,a.useState)((function(){return function(e){var n,t=e.defaultValue,r=e.tabValues;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:r}))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+t+'" but none of its children has the corresponding value. Available values are: '+r.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");return t}var a=null!=(n=r.find((function(e){return e.default})))?n:r[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:i,tabValues:d})})),f=v[0],g=v[1],h=k({queryString:s,groupId:u}),y=h[0],N=h[1],b=(n=function(e){return e?"docusaurus.tab."+e:null}({groupId:u}.groupId),t=(0,p.Nk)(n),r=t[0],o=t[1],[r,(0,a.useCallback)((function(e){n&&o.set(e)}),[n,o])]),T=b[0],O=b[1],E=function(){var e=null!=y?y:T;return m({value:e,tabValues:d})?e:null}();return(0,a.useLayoutEffect)((function(){E&&g(E)}),[E]),{selectedValue:f,selectValue:(0,a.useCallback)((function(e){if(!m({value:e,tabValues:d}))throw new Error("Can't select invalid tab value="+e);g(e),N(e),O(e)}),[N,O,d]),tabValues:d}}var f=t(2389);const g="tabList__CuJ",h="tabItem_LNqP";function y(e){var n=e.className,t=e.block,l=e.selectedValue,s=e.selectValue,u=e.tabValues,p=[],d=(0,i.o5)().blockElementScrollPositionUntilNextRender,c=function(e){var n=e.currentTarget,t=p.indexOf(n),r=u[t].value;r!==l&&(d(n),s(r))},m=function(e){var n,t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":var r,a=p.indexOf(e.currentTarget)+1;t=null!=(r=p[a])?r:p[0];break;case"ArrowLeft":var o,i=p.indexOf(e.currentTarget)-1;t=null!=(o=p[i])?o:p[p.length-1]}null==(n=t)||n.focus()};return a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":t},n)},u.map((function(e){var n=e.value,t=e.label,i=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:l===n?0:-1,"aria-selected":l===n,key:n,ref:function(e){return p.push(e)},onKeyDown:m,onClick:c},i,{className:(0,o.Z)("tabs__item",h,null==i?void 0:i.className,{"tabs__item--active":l===n})}),null!=t?t:n)})))}function N(e){var n=e.lazy,t=e.children,r=e.selectedValue;if(t=Array.isArray(t)?t:[t],n){var o=t.find((function(e){return e.props.value===r}));return o?(0,a.cloneElement)(o,{className:"margin-top--md"}):null}return a.createElement("div",{className:"margin-top--md"},t.map((function(e,n){return(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==r})})))}function b(e){var n=v(e);return a.createElement("div",{className:(0,o.Z)("tabs-container",g)},a.createElement(y,(0,r.Z)({},e,n)),a.createElement(N,(0,r.Z)({},e,n)))}function T(e){var n=(0,f.Z)();return a.createElement(b,(0,r.Z)({key:String(n)},e))}},4864:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>p,default:()=>v,frontMatter:()=>u,metadata:()=>d,toc:()=>m});var r=t(7462),a=t(3366),o=(t(7294),t(3905)),i=t(4866),l=t(5162),s=["components"],u={},p=void 0,d={unversionedId:"references/libs/dippy",id:"references/libs/dippy",title:"dippy",description:"Inversion of Control pattern implementation",source:"@site/tmp-docs/references/libs/dippy.md",sourceDirName:"references/libs",slug:"/references/libs/dippy",permalink:"/docs/references/libs/dippy",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/dippy.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"cookies",permalink:"/docs/references/libs/cookies"},next:{title:"env-validators",permalink:"/docs/references/libs/env-validators"}},c={},m=[{value:"Explanation",id:"explanation",level:2},{value:"Dependency",id:"dependency",level:3},{value:"Container",id:"container",level:3},{value:"Token",id:"token",level:3},{value:"Provider",id:"provider",level:3},{value:"Module",id:"module",level:3},{value:"Features",id:"features",level:2},{value:"Usage",id:"usage",level:2},{value:"Installation",id:"installation",level:3},{value:"Quick start",id:"quick-start",level:3},{value:"API",id:"api",level:3},{value:"Token",id:"token-1",level:4},{value:"createToken(name, options)",id:"createtokenname-options",level:5},{value:"typeof token",id:"typeof-token",level:5},{value:"Container",id:"container-1",level:4},{value:"createContainer(providers)",id:"createcontainerproviders",level:5},{value:"initContainer({ modules, providers })",id:"initcontainer-modules-providers-",level:5},{value:"container.get(token)",id:"containergettoken",level:5},{value:"container.register(provider)",id:"containerregisterprovider",level:5},{value:"Child container",id:"child-container",level:4},{value:"Quick start",id:"quick-start-1",level:5},{value:"Scope",id:"scope",level:5},{value:"Module",id:"module-1",level:3},{value:"@Module({ providers, deps, imports })(class)",id:"module-providers-deps-imports-class",level:4},{value:"Usage",id:"usage-1",level:4},{value:"declareModule",id:"declaremodule",level:3},{value:"declareModule({ name, providers, imports, extend })",id:"declaremodule-name-providers-imports-extend-",level:4},{value:"Usage",id:"usage-2",level:4}],k={toc:m};function v(e){var n=e.components,t=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},k,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Inversion of Control pattern implementation"),(0,o.kt)("h2",{id:"explanation"},"Explanation"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"dippy")," brings Dependency Injection system to your applications.\nDependency Injection provides a powerful way to make applications modular, flexible and extensible."),(0,o.kt)("h3",{id:"dependency"},"Dependency"),(0,o.kt)("p",null,"Dependency is a peace of code that has a specific purpose - primitive value, object, class instance."),(0,o.kt)("h3",{id:"container"},"Container"),(0,o.kt)("p",null,"Container contains information about dependencies, connections between them, and already created instances of dependencies"),(0,o.kt)("h3",{id:"token"},"Token"),(0,o.kt)("p",null,"Token represents a dependency by unique key and typed interface"),(0,o.kt)("h3",{id:"provider"},"Provider"),(0,o.kt)("p",null,"Provider provides dependency implementation by token, and indicates connections between other dependencies"),(0,o.kt)("h3",{id:"module"},"Module"),(0,o.kt)("p",null,"Module provides a list of providers and can connect other modules"),(0,o.kt)("h2",{id:"features"},"Features"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Dynamic initialization"),(0,o.kt)("li",{parentName:"ul"},"Replacing implementations"),(0,o.kt)("li",{parentName:"ul"},"Multi tokens"),(0,o.kt)("li",{parentName:"ul"},"Child containers"),(0,o.kt)("li",{parentName:"ul"},"Modules"),(0,o.kt)("li",{parentName:"ul"},"Lightweight"),(0,o.kt)("li",{parentName:"ul"},"Does not use ",(0,o.kt)("inlineCode",{parentName:"li"},"reflect-metadata")," and decorators"),(0,o.kt)("li",{parentName:"ul"},"Circular dependency safe"),(0,o.kt)("li",{parentName:"ul"},"Easy to debug")),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("h3",{id:"installation"},"Installation"),(0,o.kt)(i.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @tinkoff/dippy\n"))),(0,o.kt)(l.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tinkoff/dippy\n")))),(0,o.kt)("h3",{id:"quick-start"},"Quick start"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import {\n  createContainer,\n  createToken,\n  provide,\n} from '@tinkoff/dippy';\n\nconst COUNTER = createToken<{ value: number }>('counter');\nconst MULTIPLIER = createToken<{ value: number }>('multiplier');\n\nconst providers = [\n  provide({\n    provide: COUNTER,\n    useValue: { value: 2 },\n  }),\n  provide({\n    provide: MULTIPLIER,\n    useFactory(deps) {\n      return {\n        value: deps.counter.value * 2,\n      };\n    },\n    deps: {\n      counter: COUNTER,\n    },\n  }),\n];\n\nconst container = createContainer(providers);\n\nconsole.log(container.get(MULTIPLIER)); // 4\n")),(0,o.kt)("h3",{id:"api"},"API"),(0,o.kt)("h4",{id:"token-1"},"Token"),(0,o.kt)("h5",{id:"createtokenname-options"},"createToken(name, options)"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"createToken")," method creates token - both key and interface for dependency.\n",(0,o.kt)("inlineCode",{parentName:"p"},"name")," argument - string key, name of the dependency.\nOptional ",(0,o.kt)("inlineCode",{parentName:"p"},"options")," argument - specific token parameters."),(0,o.kt)("p",null,"Basic example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const FOO_TOKEN = createToken<{ key: string }>('foo');\n")),(0,o.kt)("p",null,"Multi token:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const FOO_LIST_TOKEN = createToken<{ key: string }>('foo list', { multi: true });\n")),(0,o.kt)("h5",{id:"typeof-token"},"typeof token"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"createToken")," returns type of the dependency, e.g.:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const FOO_TOKEN = createToken<{ key: string }>('foo');\n\n// { key: string }\ntype InferedFooType = typeof FOO_TOKEN;\n")),(0,o.kt)("h4",{id:"container-1"},"Container"),(0,o.kt)("h5",{id:"createcontainerproviders"},"createContainer(providers)"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"createContainer")," method is used to create an instance of the container.\nOptional ",(0,o.kt)("inlineCode",{parentName:"p"},"provider")," argument - list of default providers."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { createContainer } from '@tinkoff/dippy';\n\nconst container = createContainer([]);\n")),(0,o.kt)("h5",{id:"initcontainer-modules-providers-"},"initContainer({ modules, providers })"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"initContainer")," method is a wrapper over ",(0,o.kt)("inlineCode",{parentName:"p"},"createContainer")," method and used to create an instance of the container and walk over all modules."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { initContainer } from '@tinkoff/dippy';\n\nconst di = initContainer({\n  modules: [],\n  providers: [],\n});\n")),(0,o.kt)("h5",{id:"containergettoken"},"container.get(token)"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"get")," method returns resolved dependency instance or resolves this token with his dependencies."),(0,o.kt)("p",null,"Basic example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"// string\nconst foo = container.get(FOO_TOKEN);\n")),(0,o.kt)("p",null,"Optional dependency:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { optional } from '@tinkoff/dippy';\n\n// with special `optional` utility\n// `string` | `null` if not found\nconst foo1 = container.get(optional(FOO_TOKEN));\n\n// without `optional` utility\n// `string` | `null` if not found\nconst foo2 = container.get({ token: FOO_TOKEN, optional: true });\n")),(0,o.kt)("p",null,"Multi token:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const LIST_TOKEN = createToken<{ key: string }>('list', { multi: true });\n\n// { key: string }[]\nconst list = container.get(LIST_TOKEN);\n")),(0,o.kt)("p",null,"Multi optional token:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const LIST_TOKEN = createToken<{ key: string }>('list', { multi: true });\n\n// `{ key: string }[]` | empty `[]` if not found\nconst list = container.get(optional(LIST_TOKEN));\n")),(0,o.kt)("h5",{id:"containerregisterprovider"},"container.register(provider)"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"register")," method saves provider for token, and can overwrite previous registered provider for the same token."),(0,o.kt)("p",null,"Value provider:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"container.register({\n  provide: FOO_TOKEN,\n  useValue: { key: 'a' },\n});\n")),(0,o.kt)("p",null,"Multi provider:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const LIST_TOKEN = createToken<{ key: string }>('list', { multi: true });\n\ncontainer.register({\n  provide: LIST_TOKEN,\n  multi: true,\n  useValue: { key: 'a' },\n});\n\ncontainer.register({\n  provide: LIST_TOKEN,\n  multi: true,\n  useValue: [{ key: 'b' }, { key: 'c' }],\n});\n\nconsole.log(container.get(LIST_TOKEN)); // [{ key: 'a' }, { key: 'b' }, { key: 'c' }]\n")),(0,o.kt)("p",null,"Factory provider:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"container.register({\n  provide: BAR_TOKEN,\n  useFactory(deps) {\n    return `${deps.foo} Bar`;\n  },\n  deps: {\n    foo: FOO_TOKEN,\n  },\n})\n")),(0,o.kt)("p",null,"Class provider:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"class Bar {\n  constructor(private foo: string) {}\n}\n\ncontainer.register({\n  provide: BAR_TOKEN,\n  useClass: Bar,\n  deps: {\n    foo: FOO_TOKEN,\n  },\n})\n")),(0,o.kt)("h4",{id:"child-container"},"Child container"),(0,o.kt)("p",null,"It is enough to have only one DI container for client SPA applications.\nBut for server-side applications (SSR or API, no difference), you may need to create unique container for every request into the application.\nFor this reason, ",(0,o.kt)("inlineCode",{parentName:"p"},"dippy"),' provides ability to "fork" root DI container, which allows us to reuse providers from root container, and even providers implementations, if they were registered in ',(0,o.kt)("inlineCode",{parentName:"p"},"Scope.SINGLETON"),"."),(0,o.kt)("h5",{id:"quick-start-1"},"Quick start"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import express from 'express';\nimport type { Request, Response } from 'express';\nimport {\n  createContainer,\n  createToken,\n  provide,\n  Scope,\n} from '@tinkoff/dippy';\n\nconst app = express();\nconst rootDi = createContainer();\n\nconst LOGGER = createToken<Console>('logger');\nconst REQUEST = createToken<Request>('request');\nconst RESPONSE = createToken<Response>('response');\n\nrootDi.register({\n  provide: LOGGER,\n  scope: Scope.SINGLETON,\n  useFactory() {\n    // will be executed only once\n    return console;\n  },\n})\n\napp.get('/', (req, res) => {\n  const childDI = createChildContainer(rootDi);\n  // the same logger for every request\n  const logger = childDI.get(LOGGER);\n\n  // unique req object for request\n  childDI.register({\n    provide: REQUEST,\n    useValue: req,\n  });\n  // unique res object for request\n  childDI.register({\n    provide: RESPONSE,\n    useValue: res,\n  });\n\n  res.send('Hello World!');\n});\n")),(0,o.kt)("h5",{id:"scope"},"Scope"),(0,o.kt)("p",null,"Enum ",(0,o.kt)("inlineCode",{parentName:"p"},"Scope")," has two values - ",(0,o.kt)("inlineCode",{parentName:"p"},"REQUEST")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"SINGLETON"),".\nDefault value for every provider is ",(0,o.kt)("inlineCode",{parentName:"p"},"REQUEST"),".\nIf provider from parent DI has scope ",(0,o.kt)("inlineCode",{parentName:"p"},"REQUEST"),", every child DI will resolve own implementation of this provider.\nIf provider has scope ",(0,o.kt)("inlineCode",{parentName:"p"},"SINGLETON"),", every child DI will reuse the same resolved implementation of this provider from parent DI."),(0,o.kt)("p",null,"Basic example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"container.register({\n  provide: FOO_TOKEN,\n  useValue: { foo: 'bar' },\n});\n")),(0,o.kt)("p",null,"Singleton example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"container.register({\n  provide: FOO_TOKEN,\n  scope: Scope.SINGLETON,\n  useValue: { foo: 'bar' },\n});\n")),(0,o.kt)("h3",{id:"module-1"},"Module"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"Module")," - Decorator for configuring and creating a module."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/concepts/module"},"Read more about modules")),(0,o.kt)("h4",{id:"module-providers-deps-imports-class"},"@Module({ providers, deps, imports })(class)"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"providers")," - ",(0,o.kt)("a",{parentName:"li",href:"/docs/concepts/provider"},"Providers"),", which will be added to the root DI container and become available in other modules"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"deps")," - List of dependencies from the DI container, necessary to initialize the module"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"imports")," - A list of modules from which providers will be obtained and added to the DI. Allows you to create modules that combine many other modules")),(0,o.kt)("h4",{id:"usage-1"},"Usage"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module, provide } from '@tinkoff/dippy';\n\n@Module({\n  providers: [\n    provide({\n      provide: 'token',\n      useValue: 'value-in-token',\n    }),\n  ],\n  deps: {\n    logger: 'logger',\n  },\n  imports: [ModuleLogger],\n})\nclass ModulePubSub {\n  constructor({ logger }) {\n    logger.info('Module created');\n  }\n}\n")),(0,o.kt)("h3",{id:"declaremodule"},"declareModule"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"declareModule")," - factory for configuring and creating a module."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/concepts/module"},"Read more about modules")),(0,o.kt)("h4",{id:"declaremodule-name-providers-imports-extend-"},"declareModule({ name, providers, imports, extend })"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"name")," - Unique module name"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"providers")," - ",(0,o.kt)("a",{parentName:"li",href:"/docs/concepts/provider"},"Providers"),", which will be added to the root DI container and become available in other modules"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"imports")," - A list of modules from which providers will be obtained and added to the DI. Allows you to create modules that combine many other modules"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"extend")," - A list of module configuration methods")),(0,o.kt)("h4",{id:"usage-2"},"Usage"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { declareModule, provide } from '@tinkoff/dippy';\n\nconst ModulePubSub = declareModule({\n  name: 'PubSub',\n  imports: [ModuleLogger],\n  providers: [\n    provide({\n      provide: 'token',\n      useValue: 'value-in-token',\n    }),\n  ],\n  extend: {\n    forRoot(tokenValue: string) {\n      return [\n        provide({\n          provide: 'token',\n          useValue: tokenValue,\n        }),\n      ];\n    },\n  },\n});\n\n// use ModulePubSub or ModulePubSub.forRoot('new value')\n")))}v.isMDXComponent=!0}}]);