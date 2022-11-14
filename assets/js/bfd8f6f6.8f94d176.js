"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6951],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>m});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=n.createContext({}),c=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},p=function(e){var r=c(e.components);return n.createElement(l.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},u=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(t),m=a,y=u["".concat(l,".").concat(m)]||u[m]||d[m]||o;return t?n.createElement(y,i(i({ref:r},p),{},{components:t})):n.createElement(y,i({ref:r},p))}));function m(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=u;var s={};for(var l in r)hasOwnProperty.call(r,l)&&(s[l]=r[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=t[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},4162:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>p,contentTitle:()=>l,default:()=>m,frontMatter:()=>s,metadata:()=>c,toc:()=>d});var n=t(7462),a=t(3366),o=(t(7294),t(3905)),i=["components"],s={},l=void 0,c={unversionedId:"references/libs/lazy-render",id:"references/libs/lazy-render",title:"lazy-render",description:"Small library to improve hydration performance in SSR apps. It is based on a lazy hydration approach.",source:"@site/tmp-docs/references/libs/lazy-render.md",sourceDirName:"references/libs",slug:"/references/libs/lazy-render",permalink:"/tramvai/docs/references/libs/lazy-render",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/lazy-render.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"is-modern-lib",permalink:"/tramvai/docs/references/libs/is-modern-lib"},next:{title:"logger",permalink:"/tramvai/docs/references/libs/logger"}},p={},d=[{value:"More about lazy hydration",id:"more-about-lazy-hydration",level:2},{value:"Install",id:"install",level:2},{value:"Usage",id:"usage",level:2},{value:"Default mode",id:"default-mode",level:3},{value:"Customize wrapper",id:"customize-wrapper",level:3},{value:"Configuring IntersectionObserver",id:"configuring-intersectionobserver",level:2},{value:"Passing custom observer",id:"passing-custom-observer",level:3}],u={toc:d};function m(e){var r=e.components,t=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Small library to improve hydration performance in SSR apps. It is based on a lazy hydration approach."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Small")," only 650 bytes (minified and gzipped)"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Improves TTI")," do not waste CPU on what the user does not see"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Customize.")," component activation mechanism can be changed")),(0,o.kt)("h2",{id:"more-about-lazy-hydration"},"More about lazy hydration"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/facebook/react/issues/10923#issuecomment-338715787"},"How it works (discussed in issue at react's github)")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://www.youtube.com/watch?v=UxoX2faIgDQ&t=3372"},"About selective hydration on React Conf 2019")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://youtu.be/NythxcOI2Mw?t=2925"},"react render strategy"))),(0,o.kt)("h2",{id:"install"},"Install"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm i --save @tramvai/react-lazy-hydration-render\n")),(0,o.kt)("p",null,"or"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/react-lazy-hydration-render\n")),(0,o.kt)("p",null,"This library is using IntersectionObserver API. if you need to support older browsers, you should install ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/w3c/IntersectionObserver/tree/master/polyfill"},"intersection-observer polyfill")," in order for it to work."),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("h3",{id:"default-mode"},"Default mode"),(0,o.kt)("p",null,"Component is activated when user scrolls to it."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import React from 'react';\nimport { LazyRender } from '@tramvai/react-lazy-hydration-render';\n\nconst HeavyHeader = () => <header>1</header>;\n\nexport const Header = () => (\n  <LazyRender>\n    <HeavyHeader />\n  </LazyRender>\n);\n")),(0,o.kt)("h3",{id:"customize-wrapper"},"Customize wrapper"),(0,o.kt)("p",null,"You can configure the wrapper component."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import React from 'react';\nimport { LazyRender } from '@tramvai/react-lazy-hydration-render';\n\nconst HeavyHeader = () => <header>1</header>;\n\nexport const Header = () => (\n  <LazyRender wrapper=\"p\" wrapperProps={{ style: { margin: '10px' } }}>\n    <HeavyHeader />\n  </LazyRender>\n);\n")),(0,o.kt)("h2",{id:"configuring-intersectionobserver"},"Configuring IntersectionObserver"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import React from 'react';\nimport { LazyRender, createUseObserverVisible } from '@tramvai/react-lazy-hydration-render';\n\nconst useObserverVisible = createUseObserverVisible({\n  rootMargin: '0px',\n  threshold: 1.0,\n});\n\nconst HeavyHeader = () => <header>1</header>;\n\nexport const Header = () => (\n  <LazyRender useObserver={useObserverVisible}>\n    <HeavyHeader />\n  </LazyRender>\n);\n")),(0,o.kt)("h3",{id:"passing-custom-observer"},"Passing custom observer"),(0,o.kt)("p",null,"Package supports changing a loading mechanics. For example, component could be activated on click."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import React, { useEffect, useState } from 'react';\nimport { LazyRender } from '@tramvai/react-lazy-hydration-render';\n\nconst isServer = typeof window === 'undefined';\n\nconst useClickActivated = (ref) => {\n  const [isVisible, changeVisibility] = useState(isServer);\n\n  useEffect(() => {\n    if (!ref.current || isVisible) {\n      return;\n    }\n\n    ref.current.addEventListener('click', () => changeVisibility(true));\n  }, [ref]);\n\n  return isVisible;\n};\n\nconst HeavyHeader = () => <header>1</header>;\n\nexport const Header = () => (\n  <LazyRender useObserver={useClickActivated}>\n    <HeavyHeader />\n  </LazyRender>\n);\n")))}m.isMDXComponent=!0}}]);