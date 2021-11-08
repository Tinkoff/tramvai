(self.webpackChunk=self.webpackChunk||[]).push([[4297],{3905:(e,r,t)=>{"use strict";t.d(r,{Zo:()=>p,kt:()=>f});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function l(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?l(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function o(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var i=n.createContext({}),u=function(e){var r=n.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},p=function(e){var r=u(e.components);return n.createElement(i.Provider,{value:r},e.children)},c={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,l=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),d=u(t),f=a,m=d["".concat(i,".").concat(f)]||d[f]||c[f]||l;return t?n.createElement(m,s(s({ref:r},p),{},{components:t})):n.createElement(m,s({ref:r},p))}));function f(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var l=t.length,s=new Array(l);s[0]=d;var o={};for(var i in r)hasOwnProperty.call(r,i)&&(o[i]=r[i]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var u=2;u<l;u++)s[u]=t[u];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},4847:(e,r,t)=>{"use strict";t.r(r),t.d(r,{frontMatter:()=>o,contentTitle:()=>i,metadata:()=>u,toc:()=>p,default:()=>d});var n=t(2122),a=t(9756),l=(t(7294),t(3905)),s=["components"],o={id:"url",title:"url"},i=void 0,u={unversionedId:"references/libs/url",id:"references/libs/url",isDocsHomePage:!1,title:"url",description:"Utilities to work with urls. Based on standard implementation of URL and URLSearchParams, in case environment does not support these object polyfills should be used, e.g. core-js.",source:"@site/tmp-docs/references/libs/url.md",sourceDirName:"references/libs",slug:"/references/libs/url",permalink:"/en/docs/references/libs/url",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/url.md",version:"current",frontMatter:{id:"url",title:"url"},sidebar:"docs",previous:{title:"tinkoff-request-http-client-adapter",permalink:"/en/docs/references/libs/tinkoff-request-http-client-adapter"},next:{title:"user-agent",permalink:"/en/docs/references/libs/user-agent"}},p=[{value:"Api",id:"api",children:[{value:"parse",id:"parse",children:[]},{value:"rawParse",id:"rawparse",children:[]},{value:"resolve",id:"resolve",children:[]},{value:"resolveUrl",id:"resolveurl",children:[]},{value:"rawResolveUrl",id:"rawresolveurl",children:[]},{value:"isAbsoluteUrl",id:"isabsoluteurl",children:[]},{value:"isInvalidUrl",id:"isinvalidurl",children:[]},{value:"convertRawUrl",id:"convertrawurl",children:[]},{value:"rawAssignUrl",id:"rawassignurl",children:[]}]}],c={toc:p};function d(e){var r=e.components,t=(0,a.Z)(e,s);return(0,l.kt)("wrapper",(0,n.Z)({},c,t,{components:r,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Utilities to work with urls. Based on standard implementation of ",(0,l.kt)("a",{parentName:"p",href:"https://url.spec.whatwg.org/#url-class"},"URL")," and ",(0,l.kt)("a",{parentName:"p",href:"https://url.spec.whatwg.org/#interface-urlsearchparams"},"URLSearchParams"),", in case environment does not support these object polyfills should be used, ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/zloirock/core-js#url-and-urlsearchparams"},"e.g. core-js"),"."),(0,l.kt)("h2",{id:"api"},"Api"),(0,l.kt)("h3",{id:"parse"},"parse"),(0,l.kt)("p",null,"Parses url and returns object of class URL with additional property query which represents searchParams as a simple object."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { parse } from '@tinkoff/url';\n\nconst url = parse('https://tinkoff.ru/test/?a=1&b=2#abc');\n\nurl.protocol; // => :https\nurl.href; // => https://tinkoff.ru/test/?a=1&b=2#abc\nurl.origin; // => https://tinkoff.ru\nurl.pathname; // => /test/\nurl.hash; // => #abc\nurl.query; // => { a: '1', b: '2' }\n")),(0,l.kt)("h3",{id:"rawparse"},"rawParse"),(0,l.kt)("p",null,"Same as ",(0,l.kt)("a",{parentName:"p",href:"#parse"},"parse")," but instead of returning wrapper for URL returns raw URL object"),(0,l.kt)("h3",{id:"resolve"},"resolve"),(0,l.kt)("p",null,"Computes absolute url for relative url of base value"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { resolve } from '@tinkoff/url';\n\nresolve('//tinkoff.ru', './test123'); // => http://tinkoff.ru/test123\nresolve('//tinkoff.ru/a/b/c/', '../../test'); // => http://tinkoff.ru/a/test\nresolve('https://tinkoff.ru/a/b/c/?test=123#abc', '.././test/?me=123#123'); // => https://tinkoff.ru/a/b/test/?me=123#123\n")),(0,l.kt)("h3",{id:"resolveurl"},"resolveUrl"),(0,l.kt)("p",null,"Computes absolute url for relative url of base value. Unlike ",(0,l.kt)("a",{parentName:"p",href:"#resolve"},"resolve")," can accept string or URL and return URL wrapper"),(0,l.kt)("h3",{id:"rawresolveurl"},"rawResolveUrl"),(0,l.kt)("p",null,"Same as ",(0,l.kt)("a",{parentName:"p",href:"#resolveurl"},"resolveUrl")," but instead of returning wrapper for URL returns raw URL object"),(0,l.kt)("h3",{id:"isabsoluteurl"},"isAbsoluteUrl"),(0,l.kt)("p",null,"Checks that passed string is absolute url"),(0,l.kt)("h3",{id:"isinvalidurl"},"isInvalidUrl"),(0,l.kt)("p",null,"Checks that passed string represents invalid url"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { isAbsoluteUrl } from '@tinkoff/url';\n\nisAbsoluteUrl('https://www.exmaple.com'); // true - secure http absolute URL\nisAbsoluteUrl('//cdn.example.com/lib.js'); // true - protocol-relative absolute URL\nisAbsoluteUrl('/myfolder/test.txt'); // false - relative URL\n")),(0,l.kt)("h3",{id:"convertrawurl"},"convertRawUrl"),(0,l.kt)("p",null,"Returns handy wrapper for URL in form of plain object with some additional fields"),(0,l.kt)("h3",{id:"rawassignurl"},"rawAssignUrl"),(0,l.kt)("p",null,"Allows to set parameters to passed raw URL object (",(0,l.kt)("strong",{parentName:"p"},"passed URL-object will be changed"),")"))}d.isMDXComponent=!0}}]);