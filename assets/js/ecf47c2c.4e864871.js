"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1813],{3905:(e,t,o)=>{o.d(t,{Zo:()=>c,kt:()=>d});var n=o(7294);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function i(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function s(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?i(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function a(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var l=n.createContext({}),p=function(e){var t=n.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):s(s({},t),e)),o},c=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},k=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),k=p(o),d=r,y=k["".concat(l,".").concat(d)]||k[d]||u[d]||i;return o?n.createElement(y,s(s({ref:t},c),{},{components:o})):n.createElement(y,s({ref:t},c))}));function d(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=o.length,s=new Array(i);s[0]=k;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:r,s[1]=a;for(var p=2;p<i;p++)s[p]=o[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,o)}k.displayName="MDXCreateElement"},474:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>d,frontMatter:()=>a,metadata:()=>p,toc:()=>u});var n=o(7462),r=o(3366),i=(o(7294),o(3905)),s=["components"],a={},l=void 0,p={unversionedId:"references/libs/hooks",id:"references/libs/hooks",title:"hooks",description:"Library used for subscription on specific events in different styles: sync, async, promise.",source:"@site/tmp-docs/references/libs/hooks.md",sourceDirName:"references/libs",slug:"/references/libs/hooks",permalink:"/tramvai/docs/references/libs/hooks",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/hooks.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"eslint-plugin-tramvai",permalink:"/tramvai/docs/references/libs/eslint-plugin-tramvai"},next:{title:"http-client",permalink:"/tramvai/docs/references/libs/http-client"}},c={},u=[{value:"Explanation",id:"explanation",level:2},{value:"Caveats",id:"caveats",level:3},{value:"API",id:"api",level:2},{value:"Hooks",id:"hooks",level:4},{value:"registerHooks(key, hooks)",id:"registerhookskey-hooks",level:4},{value:"runHooks(key, context, payload, options)",id:"runhookskey-context-payload-options",level:4},{value:"runAsyncHooks(key, context, payload, options)",id:"runasynchookskey-context-payload-options",level:4},{value:"runPromiseHooks(key, context, options) =&gt; (payload) =&gt; Promise",id:"runpromisehookskey-context-options--payload--promise",level:4},{value:"Hooks",id:"hooks-1",level:2},{value:"Types",id:"types",level:3},{value:"sync",id:"sync",level:4},{value:"async",id:"async",level:4},{value:"promise",id:"promise",level:4}],k={toc:u};function d(e){var t=e.components,o=(0,r.Z)(e,s);return(0,i.kt)("wrapper",(0,n.Z)({},k,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Library used for subscription on specific events in different styles: sync, async, promise."),(0,i.kt)("h2",{id:"explanation"},"Explanation"),(0,i.kt)("p",null,"Working with lib consist of two phases:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Adding in the target code hook runner call, e.g. ",(0,i.kt)("inlineCode",{parentName:"li"},"runAsyncHooks"),", with unique event key and additional parameters. It creates a slot for this event that allow to subscribe on the event."),(0,i.kt)("li",{parentName:"ol"},"Registering hook handler with ",(0,i.kt)("inlineCode",{parentName:"li"},"registerHooks")," that will be executed when ",(0,i.kt)("inlineCode",{parentName:"li"},"run...")," function will be called")),(0,i.kt)("h3",{id:"caveats"},"Caveats"),(0,i.kt)("p",null,"There is different types hooks that are not interoperable. So carefully add new registrations with checking expected hook type."),(0,i.kt)("p",null,"Also you should preserve data chain, e.g. return data with same interface from hook, as it otherwise may break other hooks."),(0,i.kt)("h2",{id:"api"},"API"),(0,i.kt)("h4",{id:"hooks"},"Hooks"),(0,i.kt)("p",null,"Create new instance of ",(0,i.kt)("inlineCode",{parentName:"p"},"@tinkoff/hook-runner")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"import { Hooks } from '@tinkoff/hook-runner';\n\nconst hookRunner = new Hooks();\n")),(0,i.kt)("h4",{id:"registerhookskey-hooks"},"registerHooks(key, hooks)"),(0,i.kt)("p",null,"Register new hook for a specific key."),(0,i.kt)("h4",{id:"runhookskey-context-payload-options"},"runHooks(key, context, payload, options)"),(0,i.kt)("p",null,"Execute sync hooks. ",(0,i.kt)("inlineCode",{parentName:"p"},"payload")," is passed through every hook and will be returned as a result (it may be changed by hooks)."),(0,i.kt)("h4",{id:"runasynchookskey-context-payload-options"},"runAsyncHooks(key, context, payload, options)"),(0,i.kt)("p",null,"Executes async hooks using setTimeout. ",(0,i.kt)("inlineCode",{parentName:"p"},"payload")," is passed to every hook with its initial value."),(0,i.kt)("h4",{id:"runpromisehookskey-context-options--payload--promise"},"runPromiseHooks(key, context, options) => (payload) => Promise"),(0,i.kt)("p",null,"Execute promise-based hooks. ",(0,i.kt)("inlineCode",{parentName:"p"},"payload")," is passed through every hook and will be returned as a result (it may be changed by hooks)"),(0,i.kt)("h2",{id:"hooks-1"},"Hooks"),(0,i.kt)("h3",{id:"types"},"Types"),(0,i.kt)("h4",{id:"sync"},"sync"),(0,i.kt)("p",null,"Accepts (context, payload, options). Hooks are running in order passing previous hook result as input for next hook."),(0,i.kt)("h4",{id:"async"},"async"),(0,i.kt)("p",null,"Accepts (context, payload, options). Hooks are running independently from each other."),(0,i.kt)("h4",{id:"promise"},"promise"),(0,i.kt)("p",null,"Accepts (context, payload, options). Hooks are running in order passing previous hook result as input for next hook with wrapping call in promise."))}d.isMDXComponent=!0}}]);