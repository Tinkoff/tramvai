(self.webpackChunk=self.webpackChunk||[]).push([[9031],{3905:(e,t,r)=>{"use strict";r.d(t,{Zo:()=>l,kt:()=>d});var n=r(7294);function u(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){u(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function b(e,t){if(null==e)return{};var r,n,u=function(e,t){if(null==e)return{};var r,n,u={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(u[r]=e[r]);return u}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(u[r]=e[r])}return u}var p=n.createContext({}),i=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},l=function(e){var t=i(e.components);return n.createElement(p.Provider,{value:t},e.children)},o={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var r=e.components,u=e.mdxType,a=e.originalType,p=e.parentName,l=b(e,["components","mdxType","originalType","parentName"]),c=i(r),d=u,f=c["".concat(p,".").concat(d)]||c[d]||o[d]||a;return r?n.createElement(f,s(s({ref:t},l),{},{components:r})):n.createElement(f,s({ref:t},l))}));function d(e,t){var r=arguments,u=t&&t.mdxType;if("string"==typeof e||u){var a=r.length,s=new Array(a);s[0]=c;var b={};for(var p in t)hasOwnProperty.call(t,p)&&(b[p]=t[p]);b.originalType=e,b.mdxType="string"==typeof e?e:u,s[1]=b;for(var i=2;i<a;i++)s[i]=r[i];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}c.displayName="MDXCreateElement"},4111:(e,t,r)=>{"use strict";r.r(t),r.d(t,{frontMatter:()=>b,contentTitle:()=>p,metadata:()=>i,toc:()=>l,default:()=>c});var n=r(2122),u=r(9756),a=(r(7294),r(3905)),s=["components"],b={id:"pubsub",title:"pubsub"},p=void 0,i={unversionedId:"references/libs/pubsub",id:"references/libs/pubsub",isDocsHomePage:!1,title:"pubsub",description:"PubSub - \u043a\u043b\u0430\u0441\u0441 \u0434\u043b\u044f \u0440\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438 \u0448\u0430\u0431\u043b\u043e\u043d\u0430 \u0438\u0437\u0434\u0430\u0442\u0435\u043b\u044c/\u043f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 \u043f\u0440\u043e\u043c\u0438\u0441\u043e\u0432.",source:"@site/tmp-docs/references/libs/pubsub.md",sourceDirName:"references/libs",slug:"/references/libs/pubsub",permalink:"/en/docs/references/libs/pubsub",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/pubsub.md",version:"current",frontMatter:{id:"pubsub",title:"pubsub"},sidebar:"docs",previous:{title:"meta-tags-generate",permalink:"/en/docs/references/libs/meta-tags-generate"},next:{title:"prettier",permalink:"/en/docs/references/libs/prettier"}},l=[{value:"subscribe - \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430 \u043d\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u044f",id:"subscribe---\u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430-\u043d\u0430-\u0441\u043e\u0431\u044b\u0442\u0438\u044f",children:[]},{value:"publish - \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f \u0441\u043e\u0431\u044b\u0442\u0438\u044f",id:"publish---\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f-\u0441\u043e\u0431\u044b\u0442\u0438\u044f",children:[]},{value:"\u0422\u0438\u043f\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 PubSub",id:"\u0442\u0438\u043f\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439-pubsub",children:[]}],o={toc:l};function c(e){var t=e.components,r=(0,u.Z)(e,s);return(0,a.kt)("wrapper",(0,n.Z)({},o,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"PubSub - \u043a\u043b\u0430\u0441\u0441 \u0434\u043b\u044f \u0440\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438 \u0448\u0430\u0431\u043b\u043e\u043d\u0430 \u0438\u0437\u0434\u0430\u0442\u0435\u043b\u044c/\u043f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 \u043f\u0440\u043e\u043c\u0438\u0441\u043e\u0432."),(0,a.kt)("h3",{id:"subscribe---\u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430-\u043d\u0430-\u0441\u043e\u0431\u044b\u0442\u0438\u044f"},"subscribe - \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430 \u043d\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u044f"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"pubsub.subscribe(type, callback)")," - \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u0435 ",(0,a.kt)("inlineCode",{parentName:"p"},"type"),". ",(0,a.kt)("inlineCode",{parentName:"p"},"callback")," \u043f\u0440\u0438\u043d\u0438\u043c\u0430\u0435\u0442 \u0432 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432 \u0430\u0440\u0433\u0443\u043c\u0435\u043d\u0442\u044b \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0435 \u043f\u0440\u0438 \u0432\u044b\u0437\u043e\u0432\u0435 ",(0,a.kt)("inlineCode",{parentName:"p"},"pubsub.publish"),". ",(0,a.kt)("inlineCode",{parentName:"p"},"callback")," \u043c\u043e\u0436\u0435\u0442 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u043f\u0440\u043e\u043c\u0438\u0441, \u0440\u0435\u0437\u043e\u043b\u0432 \u043a\u043e\u0442\u043e\u0440\u043e\u0433\u043e \u0431\u0443\u0434\u0435\u0442 \u043e\u0436\u0438\u0434\u0430\u0442\u044c\u0441\u044f \u043f\u0440\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0438 ",(0,a.kt)("inlineCode",{parentName:"p"},"pubsub.publish"),"."),(0,a.kt)("h3",{id:"publish---\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f-\u0441\u043e\u0431\u044b\u0442\u0438\u044f"},"publish - \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f \u0441\u043e\u0431\u044b\u0442\u0438\u044f"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"pubsub.publish(type, ...args)")," - \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f \u0441\u043e\u0431\u044b\u0442\u0438\u044f, \u0432\u0441\u0435 \u0430\u0440\u0433\u0443\u043c\u0435\u043d\u0442\u044b \u043a\u0440\u043e\u043c\u0435 \u043f\u0435\u0440\u0432\u043e\u0433\u043e \u0431\u0443\u0434\u0443\u0442 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u044b \u043a\u0430\u043a \u0430\u0440\u0433\u0443\u043c\u0435\u043d\u0442\u044b \u0432 \u0444\u0443\u043d\u043a\u0446\u0438\u0438-\u043f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u0438. \u0412\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u043f\u0440\u043e\u043c\u0438\u0441, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0437\u0430\u0440\u0435\u0437\u043e\u043b\u0432\u0438\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u0440\u0435\u0437\u043e\u043b\u0432\u0430 \u0432\u0441\u0435\u0445 \u0444\u0443\u043d\u043a\u0446\u0438\u0439-\u043f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u043e\u0432."),(0,a.kt)("h2",{id:"\u0442\u0438\u043f\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439-pubsub"},"\u0422\u0438\u043f\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 PubSub"),(0,a.kt)("p",null,"PubSub \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u0438\u043f\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0433\u043e \u0441\u043f\u0438\u0441\u043a\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u0439. \u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440: \u0435\u0441\u0442\u044c \u043e\u0431\u0449\u0438\u0439 PubSub, \u0432 \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u043c\u043d\u043e\u0433\u043e \u043a\u0442\u043e \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442 \u0441\u043e\u0431\u044b\u0442\u0438\u044f. \u0412\u044b \u043f\u0438\u0448\u0435\u0442\u0435 \u0444\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0442\u043e\u0436\u0435 \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0442\u044c \u0441\u043e\u0431\u044b\u0442\u0438\u044f \u0432 \u043e\u0431\u0449\u0438\u0439 PubSub \u0438 \u0441\u0447\u0438\u0442\u044b\u0432\u0430\u0442\u044c \u043e\u0442\u0442\u0443\u0434\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u044f. \u0412\u044b \u0445\u043e\u0442\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b TS \u043f\u0440\u043e\u0432\u0435\u0440\u044f\u043b, \u0447\u0442\u043e \u043f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e \u043f\u043e\u0434\u043f\u0438\u0441\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u043d\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u044f \u0438\u0437 PubSub."),(0,a.kt)("p",null,"\u0412 \u044d\u0442\u043e\u043c \u0441\u043b\u0443\u0447\u0430\u0435 \u0434\u0435\u043b\u0430\u0435\u043c \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0435:"),(0,a.kt)("p",null,"\u0417\u0430\u0432\u043e\u0434\u0438\u043c \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u0438 \u0442\u0440\u0435\u0431\u0443\u0435\u043c\u044b\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0438"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"type MyAwesomeFeatureEvents = {\n  event1: (payload: number) => any;\n  event2: (payload: { prop: boolean }) => any;\n};\n")),(0,a.kt)("p",null,"\u0422\u0435\u043f\u0435\u0440\u044c \u0432 \u043c\u0435\u0441\u0442\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f PubSub \u0432 \u0440\u0430\u043c\u043a\u0430\u0445 \u043d\u0430\u0448\u0435\u0439 \u0444\u0438\u0447\u0438 \u0434\u0435\u043b\u0430\u0435\u043c \u0442\u0430\u0439\u043f\u043a\u0430\u0441\u0442. \u041f\u043e\u0441\u043b\u0435 \u044d\u0442\u043e\u0433\u043e pubsub \u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u0442\u0438\u043f\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u043c \u0438 \u0434\u0430\u0435\u0442 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u0441\u043e\u0431\u044b\u0442\u0438\u044f \u0438\u0437 MyAwesomeFeatureEvents \u0438 typescript \u0441\u043b\u0435\u0434\u0438\u0442 \u0437\u0430 \u0441\u043e\u0432\u043c\u0435\u0441\u0442\u0438\u043c\u043e\u0441\u0442\u044c\u044e"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const featurePubSub = (pubSub as any) as PubSub<MyAwesomeFeatureEvents>;\n\n// OK! \ud83d\udc4d\nfeaturePubSub.subscribe('event1', (payload) => console.log(1 + payload));\nfeaturePubSub.publish('event1', 2);\n\n// \u041e\u0448\u0438\u0431\u043a\u0438 \ud83d\udc4e\nfeaturePubSub.subscribe('event3', (payload) => console.log(1 + payload)); // \u041d\u0415\u0422 \u0422\u0410\u041a\u041e\u0413\u041e \u0421\u041e\u0411\u042b\u0422\u0418\u042f\nfeaturePubSub.publish('event3', 2); // \u041d\u0415\u0422 \u0422\u0410\u041a\u041e\u0413\u041e \u0421\u041e\u0411\u042b\u0422\u0418\u042f\n\nfeaturePubSub.subscribe('event1', (payload) => payload.toLowerCase()); // \u0422\u0430\u043c \u0447\u0438\u0441\u043b\u043e, \u0430 \u043d\u0435 \u0441\u0442\u0440\u043e\u043a\u0430!\nfeaturePubSub.publish('event1', 'string'); // \u043e\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044f \u0447\u0438\u0441\u043b\u043e!\n")))}c.isMDXComponent=!0}}]);