(self.webpackChunk=self.webpackChunk||[]).push([[8644],{3905:(e,t,r)=>{"use strict";r.d(t,{Zo:()=>c,kt:()=>d});var s=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,s)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,s,n=function(e,t){if(null==e)return{};var r,s,n={},o=Object.keys(e);for(s=0;s<o.length;s++)r=o[s],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(s=0;s<o.length;s++)r=o[s],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var a=s.createContext({}),u=function(e){var t=s.useContext(a),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=u(e.components);return s.createElement(a.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},f=s.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,a=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),f=u(r),d=n,b=f["".concat(a,".").concat(d)]||f[d]||p[d]||o;return r?s.createElement(b,i(i({ref:t},c),{},{components:r})):s.createElement(b,i({ref:t},c))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=f;var l={};for(var a in t)hasOwnProperty.call(t,a)&&(l[a]=t[a]);l.originalType=e,l.mdxType="string"==typeof e?e:n,i[1]=l;for(var u=2;u<o;u++)i[u]=r[u];return s.createElement.apply(null,i)}return s.createElement.apply(null,r)}f.displayName="MDXCreateElement"},2834:(e,t,r)=>{"use strict";r.r(t),r.d(t,{frontMatter:()=>l,contentTitle:()=>a,metadata:()=>u,toc:()=>c,default:()=>f});var s=r(2122),n=r(9756),o=(r(7294),r(3905)),i=["components"],l={id:"browserslist",title:"\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f \u0441 browserslist"},a=void 0,u={unversionedId:"references/cli/browserslist",id:"references/cli/browserslist",isDocsHomePage:!1,title:"\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f \u0441 browserslist",description:"browserslist is used for targeting specific browsers for the build. It allows to make only necessary transformations of the source code and to provide most modern code to the end browsers.",source:"@site/tmp-docs/references/cli/browserslist.md",sourceDirName:"references/cli",slug:"/references/cli/browserslist",permalink:"/en/docs/references/cli/browserslist",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/cli/browserslist.md",version:"current",frontMatter:{id:"browserslist",title:"\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f \u0441 browserslist"},sidebar:"docs",previous:{title:"\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u0434\u043e\u043a\u0430",permalink:"/en/docs/references/cli/base"},next:{title:"\u0412\u0441\u0442\u0430\u0432\u043a\u0430 inline-\u043a\u043e\u0434\u0430 \u0434\u043b\u044f \u043a\u043b\u0438\u0435\u043d\u0442\u0430 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435",permalink:"/en/docs/references/cli/serverInline"}},c=[{value:"Supported envs for browserslist",id:"supported-envs-for-browserslist",children:[]},{value:"cli setup",id:"cli-setup",children:[]},{value:"Debug",id:"debug",children:[]},{value:"Caveats",id:"caveats",children:[{value:"autoprefixer",id:"autoprefixer",children:[]}]}],p={toc:c};function f(e){var t=e.components,r=(0,n.Z)(e,i);return(0,o.kt)("wrapper",(0,s.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/browserslist/browserslist"},"browserslist")," is used for targeting specific browsers for the build. It allows to make only necessary transformations of the source code and to provide most modern code to the end browsers."),(0,o.kt)("p",null,"Where browserslist is used:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"For building js/ts code - with ",(0,o.kt)("a",{parentName:"li",href:"https://babeljs.io/docs/en/babel-preset-env"},"@babel/preset-env")),(0,o.kt)("li",{parentName:"ul"},"For build css - with postcss-plugin ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/postcss/autoprefixer"},"autoprefixer"))),(0,o.kt)("h2",{id:"supported-envs-for-browserslist"},"Supported envs for browserslist"),(0,o.kt)("p",null,"In cli only specific list of supported env targets is used for browserslist:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"modern")," - used for builds supposed to be provided for modern browsers"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"node")," - used for builds running on server"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"defaults")," - used otherwise, usually for outdated browsers")),(0,o.kt)("h2",{id:"cli-setup"},"cli setup"),(0,o.kt)("p",null,"By default, cli uses browserslist config from a library ",(0,o.kt)("inlineCode",{parentName:"p"},"@tinkoff/browserslist-config"),"."),(0,o.kt)("p",null,"To extend or override default settings, you can use any of the methods ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/browserslist/browserslist#queries"},"for browserslist config")," following next rules:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"It is allowed to change config only for ",(0,o.kt)("a",{parentName:"li",href:"#supported-envs-for-browserslist"},"envs from the list used in cli"),". How to do it see ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/browserslist/browserslist#configuring-for-different-environments"},"browserslist docs"),". If some of env is not defined, the default config for the env will be used."),(0,o.kt)("li",{parentName:"ul"},"If you want to extend default settings then use ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/browserslist/browserslist#shareable-configs"},"the ability to extend config"),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-json"},'"browserslist": {\n  "modern": [\n    "extends @tinkoff/browserslist-config",\n    "chrome > 25"\n  ],\n  "node": [\n    "extends @tinkoff/browserslist-config"\n  ],\n  "defaults": [\n    "extends @tinkoff/browserslist-config",\n    "chrome > 27"\n  ]\n}\n'))),(0,o.kt)("li",{parentName:"ul"},"If you want to narrow down the supported list of the browsers, then do not use ",(0,o.kt)("inlineCode",{parentName:"li"},"extends @tinkoff/browserslist-config")," and specify list of the supported browsers yourself. Take the default list from the ",(0,o.kt)("inlineCode",{parentName:"li"},"@tinkoff/browserslist-config")," as a basis. Do it for every ",(0,o.kt)("a",{parentName:"li",href:"#supported-envs-for-browserslist"},"env")," if you need it. Not overrided env will use default settings.")),(0,o.kt)("h2",{id:"debug"},"Debug"),(0,o.kt)("p",null,"You can test how browserslist works using next commands:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"npx browserslist --env=modern # list of the modern browsers\nnpx browserslist --env=node # list of the supported nodejs versions\nnpx browserslist # list of the browsers including legacy one\n")),(0,o.kt)("h2",{id:"caveats"},"Caveats"),(0,o.kt)("h3",{id:"autoprefixer"},"autoprefixer"),(0,o.kt)("p",null,"Because of the some internal restrictions of the ",(0,o.kt)("inlineCode",{parentName:"p"},"autoprefixer")," build will be executed only using ",(0,o.kt)("inlineCode",{parentName:"p"},"defaults")," config. If you really interested in this feature, please, create an issue on the github."))}f.isMDXComponent=!0}}]);