"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[466],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=c(n),d=r,k=m["".concat(s,".").concat(d)]||m[d]||u[d]||o;return n?a.createElement(k,l(l({ref:t},p),{},{components:n})):a.createElement(k,l({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var c=2;c<o;c++)l[c]=n[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(7294),r=n(6010);const o="tabItem_Ymn6";function l(e){var t=e.children,n=e.hidden,l=e.className;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,l),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(7462),r=n(7294),o=n(6010),l=n(2389),i=n(7392),s=n(7094),c=n(2466);const p="tabList__CuJ",u="tabItem_LNqP";function m(e){var t,n,l=e.lazy,m=e.block,d=e.defaultValue,k=e.values,f=e.groupId,v=e.className,h=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=k?k:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),y=(0,i.l)(b,(function(e,t){return e.value===t.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===d?d:null!=(t=null!=d?d:null==(n=h.find((function(e){return e.props.default})))?void 0:n.props.value)?t:h[0].props.value;if(null!==g&&!b.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var w=(0,s.U)(),N=w.tabGroupChoices,O=w.setTabGroupChoices,E=(0,r.useState)(g),I=E[0],M=E[1],x=[],C=(0,c.o5)().blockElementScrollPositionUntilNextRender;if(null!=f){var T=N[f];null!=T&&T!==I&&b.some((function(e){return e.value===T}))&&M(T)}var P=function(e){var t=e.currentTarget,n=x.indexOf(t),a=b[n].value;a!==I&&(C(t),M(a),null!=f&&O(f,String(a)))},A=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a,r=x.indexOf(e.currentTarget)+1;n=null!=(a=x[r])?a:x[0];break;case"ArrowLeft":var o,l=x.indexOf(e.currentTarget)-1;n=null!=(o=x[l])?o:x[x.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,o.Z)("tabs-container",p)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},v)},b.map((function(e){var t=e.value,n=e.label,l=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:I===t?0:-1,"aria-selected":I===t,key:t,ref:function(e){return x.push(e)},onKeyDown:A,onFocus:P,onClick:P},l,{className:(0,o.Z)("tabs__item",u,null==l?void 0:l.className,{"tabs__item--active":I===t})}),null!=n?n:t)}))),l?(0,r.cloneElement)(h.filter((function(e){return e.props.value===I}))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},h.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==I})}))))}function d(e){var t=(0,l.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},1814:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>p,default:()=>f,frontMatter:()=>c,metadata:()=>u,toc:()=>d});var a=n(7462),r=n(3366),o=(n(7294),n(3905)),l=n(5488),i=n(5162),s=["components"],c={},p=void 0,u={unversionedId:"references/modules/mocker",id:"references/modules/mocker",title:"mocker",description:"Module uses library @tinkoff/mocker to add a mocker functionality to the tramvai app. Mocker will be available as papi route with path /mocker.",source:"@site/tmp-docs/references/modules/mocker.md",sourceDirName:"references/modules",slug:"/references/modules/mocker",permalink:"/docs/references/modules/mocker",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/modules/mocker.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"metrics",permalink:"/docs/references/modules/metrics"},next:{title:"page-render-mode",permalink:"/docs/references/modules/page-render-mode"}},m={},d=[{value:"Installation",id:"installation",level:2},{value:"Explanation",id:"explanation",level:2},{value:"Env variables replacement",id:"env-variables-replacement",level:3},{value:"How to",id:"how-to",level:2},{value:"Mock only specific API",id:"mock-only-specific-api",level:3},{value:"Exported tokens",id:"exported-tokens",level:2}],k={toc:d};function f(e){var t=e.components,n=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},k,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Module uses library ",(0,o.kt)("a",{parentName:"p",href:"/docs/references/libs/mocker"},"@tinkoff/mocker")," to add a mocker functionality to the ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai")," app. Mocker will be available as ",(0,o.kt)("a",{parentName:"p",href:"/docs/references/modules/server#papi"},"papi")," route with path ",(0,o.kt)("inlineCode",{parentName:"p"},"/mocker"),"."),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"First, install ",(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/module-mocker"),":"),(0,o.kt)(l.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @tramvai/module-mocker\n"))),(0,o.kt)(i.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/module-mocker\n")))),(0,o.kt)("p",null,"Then, add your first mock to a new file ",(0,o.kt)("inlineCode",{parentName:"p"},"mocks/my-api.js"),". In this file add export of object literal with the field ",(0,o.kt)("inlineCode",{parentName:"p"},"api")," that should be specified as a name of environment variable for the API url that should be mocked:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"module.exports = {\n  api: 'MY_API',\n  mocks: {\n    'GET /endpoint?foo=bar': {\n      status: 200,\n      headers: {},\n      payload: {\n        result: {\n          type: 'json',\n          value: {\n            a: 'b',\n          },\n        },\n      },\n    },\n  },\n};\n")),(0,o.kt)("p",null,"Add module to the project:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp } from '@tramvai/core';\nimport { MockerModule } from '@tramvai/module-mocker';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [MockerModule],\n});\n")),(0,o.kt)("p",null,"Run app with env ",(0,o.kt)("inlineCode",{parentName:"p"},"MOCKER_ENABLED"),", e.g.:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'MOCKER_ENABLED="true" tramvai start tincoin\n')),(0,o.kt)("p",null,"After that, all of the requests to ",(0,o.kt)("inlineCode",{parentName:"p"},"MY_API")," in browser and on server will be automatically sent to mocker. In case mocker doesn't have a suitable mock the request, the request will be proxied to the original API."),(0,o.kt)("h2",{id:"explanation"},"Explanation"),(0,o.kt)("p",null,"Most of the mocker features are described in the ",(0,o.kt)("a",{parentName:"p",href:"/docs/references/libs/mocker#Explanation"},"lib documentation"),"."),(0,o.kt)("p",null,"Module adds mocker middleware to ",(0,o.kt)("inlineCode",{parentName:"p"},"papi")," route ",(0,o.kt)("inlineCode",{parentName:"p"},"/mocker")," and replaces all of the env variables that were defined in mocks by links to the ",(0,o.kt)("inlineCode",{parentName:"p"},"papi"),". After that all of the request to the original API are routed first to mocker that accepts requests from the client and the server side."),(0,o.kt)("p",null,"By default, all of the API that were defined mocks are mocked, but it might be overridden."),(0,o.kt)("p",null,"Mocker us enabled only when env variable ",(0,o.kt)("inlineCode",{parentName:"p"},"MOCKER_ENABLED")," is defined."),(0,o.kt)("h3",{id:"env-variables-replacement"},"Env variables replacement"),(0,o.kt)("p",null,"Let's say app has env variable ",(0,o.kt)("inlineCode",{parentName:"p"},"MY_API: https://www.my-api.com/")," and for that api some mock is defined."),(0,o.kt)("p",null,"The module can work locally, on dynamic stand, in test/stage environments. But this flexibility leads to the following problems when resolving path to the ",(0,o.kt)("inlineCode",{parentName:"p"},"papi")," endpoint:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"On server we should execute requests with absolute path. In this case we know that app is always available at ",(0,o.kt)("inlineCode",{parentName:"li"},"localhost")," that mean we can replace API env variables by urls like ",(0,o.kt)("inlineCode",{parentName:"li"},"http://localhost:3000/tincoin/papi/mocker/MY_API/")),(0,o.kt)("li",{parentName:"ol"},"On client test stands we do not known the domain of the app. In this case we should make requests by relative urls that mean we can replace API env variables by urls like ",(0,o.kt)("inlineCode",{parentName:"li"},"/tincoin/papi/mocker/MY_API/"))),(0,o.kt)("p",null,"Thanks to this env replacement we can redirect all of the request to the APIs to our mocker first automatically."),(0,o.kt)("h2",{id:"how-to"},"How to"),(0,o.kt)("h3",{id:"mock-only-specific-api"},"Mock only specific API"),(0,o.kt)("p",null,"By default, all of the API that has corresponding mock will be mocked. It might be overridden by passing list of the APIs to mock when initializing module:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"MockerModule.forRoot({\n  config: async () => ({\n    apis: ['MY_API'],\n  }),\n});\n")),(0,o.kt)("h2",{id:"exported-tokens"},"Exported tokens"),(0,o.kt)("p",null,(0,o.kt)("pre",{parentName:"p"},(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\nimport type { Mocker, MockRepository } from '@tinkoff/mocker';\n\nexport interface MockerOptions {\n  apis: string[];\n}\n\nexport const MOCKER = createToken<Mocker>('MOCKER');\n\nexport const MOCKER_REPOSITORY = createToken<MockRepository>('MOCKER_REPOSITORY', {\n  multi: true,\n});\n\nexport const MOCKER_CONFIGURATION =\n  createToken<() => Promise<MockerOptions>>('MOCKER_CONFIGURATION');\n\n"))))}f.isMDXComponent=!0}}]);