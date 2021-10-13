(self.webpackChunk=self.webpackChunk||[]).push([[3842],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>u,kt:()=>m});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=o,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||a;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5767:(e,t,n)=>{"use strict";n.r(t),n.d(t,{frontMatter:()=>s,contentTitle:()=>l,metadata:()=>c,toc:()=>u,default:()=>d});var r=n(2122),o=n(9756),a=(n(7294),n(3905)),i=["components"],s={id:"hooks",title:"React hooks"},l=void 0,c={unversionedId:"features/state/hooks",id:"features/state/hooks",isDocsHomePage:!1,title:"React hooks",description:"useActions",source:"@site/i18n/en/docusaurus-plugin-content-docs/current/features/state/hooks.md",sourceDirName:"features/state",slug:"/features/state/hooks",permalink:"/en/docs/features/state/hooks",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/features/state/hooks.md",version:"current",frontMatter:{id:"hooks",title:"React hooks"},sidebar:"docs",previous:{title:"Create event",permalink:"/en/docs/features/state/create-event"},next:{title:"DevTools",permalink:"/en/docs/features/state/dev-tools"}},u=[{value:"useActions",id:"useactions",children:[{value:"Interface",id:"interface",children:[]},{value:"Usage",id:"usage",children:[]}]},{value:"useSelector ()",id:"useselector-",children:[{value:"Interface",id:"interface-1",children:[]},{value:"Usage",id:"usage-1",children:[]},{value:"Optimizations",id:"optimizations",children:[]}]},{value:"useStoreSelector",id:"usestoreselector",children:[{value:"Interface",id:"interface-2",children:[]},{value:"Usage",id:"usage-2",children:[]},{value:"Optimizations",id:"optimizations-1",children:[]}]},{value:"useStore",id:"usestore",children:[{value:"Interface",id:"interface-3",children:[]},{value:"Usage",id:"usage-3",children:[]}]}],p={toc:u};function d(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"useactions"},"useActions"),(0,a.kt)("p",null,"Allows to execute tram ",(0,a.kt)("a",{parentName:"p",href:"/en/docs/concepts/action"},"actions")," in React components"),(0,a.kt)("h3",{id:"interface"},"Interface"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"actions")," - one or an array of tram actions")),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"If you pass an array to ",(0,a.kt)("inlineCode",{parentName:"p"},"useActions"),", for typing you need to specify ",(0,a.kt)("inlineCode",{parentName:"p"},"as const")," - ",(0,a.kt)("inlineCode",{parentName:"p"},"useActions([] as const)"))),(0,a.kt)("h3",{id:"usage"},"Usage"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { useActions } from '@tramvai/state';\nimport { loadUserAction, getInformationAction, setInformationAction } from './actions';\n\nexport const Component = () => {\n  // if you pass one action, the payload type for loadUser is automatically deduced\n  const loadUser = useActions(loadUserAction);\n\n  // if you pass a list of actions, `as const` is required for correct type inference\n  const [getInformation, setInformation] = useActions([\n    getInformationAction,\n    setInformationAction,\n  ] as const);\n\n  return (\n    <div>\n      <div onClick={loadUser}>load user</div>\n      <div onClick={getInformation}>get information</div>\n      <div onClick={() => setInformation({ user: 1 })}>set information</div>\n    </div>\n  );\n};\n")),(0,a.kt)("h2",{id:"useselector-"},"useSelector ()"),(0,a.kt)("p",null,"Receiving data from the store in components"),(0,a.kt)("h3",{id:"interface-1"},"Interface"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"stores: []")," - a list of tokens that the selector will subscribe to. Will affect which store changes will trigger an update in the component"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"selector: (state) => any")," - the selector itself, this is a function that will be called upon initialization and any changes to the stores passed to ",(0,a.kt)("inlineCode",{parentName:"li"},"stores"),". The function should return data that can be used in the component"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"equalityFn?: (cur, prev) => boolean")," - optional function to change the way of comparing past and new values \u200b\u200bof a selector")),(0,a.kt)("h3",{id:"usage-1"},"Usage"),(0,a.kt)("p",null,"To get data from a store, you can use a store name, a reference to a store, or an object with an optional store:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"'storeName'")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"storeObject")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"{ store: storeObject, optional: true }")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"{ store: 'storeName', optional: true }"))),(0,a.kt)("p",null,"You can pass an array of keys, then for correct type inference it is better to use ",(0,a.kt)("inlineCode",{parentName:"p"},"as const"),":"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"useSelector(['fooStoreName', barStoreObject] as const, ({ foo, bar }) => null)"),";")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { useSelector } from '@tramvai/state';\n\nexport const Component = () => {\n  const isBrowser = useSelector('media', (state) => state.media.isBrowser);\n\n  return <div>{isBrowser ? <span>Browser</span> : <span>Desktop</span>}</div>;\n};\n")),(0,a.kt)("h3",{id:"optimizations"},"Optimizations"),(0,a.kt)("p",null,"In order to reduce the number of component redrawings, after each call to ",(0,a.kt)("inlineCode",{parentName:"p"},"selector"),", the return values \u200b\u200bare checked against those that were before. If the returned selector data has not changed, then the component will not be redrawn."),(0,a.kt)("p",null,"For this reason, it is better to get small chunks of information in selectors. Then there is less chance that the component will be updated. For example: we need the user's ",(0,a.kt)("inlineCode",{parentName:"p"},"roles"),", we write a selector that requests all user data ",(0,a.kt)("inlineCode",{parentName:"p"},"(state) => state.user")," and now any changes to the ",(0,a.kt)("inlineCode",{parentName:"p"},"user")," reducer will update the component. It is better if we receive only the necessary data ",(0,a.kt)("inlineCode",{parentName:"p"},"(state) => state.user.roles"),", in which case the component will be redrawn only when the user's ",(0,a.kt)("inlineCode",{parentName:"p"},"roles")," change"),(0,a.kt)("h2",{id:"usestoreselector"},"useStoreSelector"),(0,a.kt)("p",null,"A simplified version of the useSelector hook into which only one store can be passed, created via createReducer. It was made to improve the inference of selector types, since useSelector itself cannot do this due to the use of strings, tokens and BaseStore heirs inside string names"),(0,a.kt)("h3",{id:"interface-2"},"Interface"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"store: Reducer")," - Store created through createReducer"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"selector: (state) => any")," - the selector itself, this is a function that will be called upon initialization and any changes to the store passed to ",(0,a.kt)("inlineCode",{parentName:"li"},"stores"),". The function should return data that can be used in the component")),(0,a.kt)("h3",{id:"usage-2"},"Usage"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { useStoreSelector } from '@tramvai/state';\nimport { createReducer } from '@tramvai/state';\n\nconst myStore = createReducer('myStore', { id: '123' });\n\nexport const Component = () => {\n  const id = useStoreSelector((myStore, (state) => state.id)); // The id type will be correctly inferred as \"string\"\n\n  return <div>{id}</div>;\n};\n")),(0,a.kt)("h3",{id:"optimizations-1"},"Optimizations"),(0,a.kt)("p",null,"The hook is a wrapper over useSelector, so the optimizations are the same. The selector function itself is memoized inside"),(0,a.kt)("h2",{id:"usestore"},"useStore"),(0,a.kt)("p",null,"Hook to get the state of a specific reducer."),(0,a.kt)("p",null,"Peculiarities:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"automatically displays the type of state"),(0,a.kt)("li",{parentName:"ul"},"re-renders the component only when the reducer is updated"),(0,a.kt)("li",{parentName:"ul"},'allows you to create reducers "on the fly"')),(0,a.kt)("h3",{id:"interface-3"},"Interface"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"store: Reducer")," - Store created by createReducer")),(0,a.kt)("h3",{id:"usage-3"},"Usage"),(0,a.kt)("p",null,"Basic example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { useStore } from '@tramvai/state';\nimport { createReducer } from '@tramvai/state';\n\nconst userReducer = createReducer('user', { id: '123' });\n\nexport const Component = () => {\n  const { id } = useStore(userReducer);\n\n  return <div>{id}</div>;\n};\n")))}d.isMDXComponent=!0}}]);