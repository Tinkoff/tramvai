"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[419],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),s=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=s(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),m=s(r),d=n,v=m["".concat(i,".").concat(d)]||m[d]||p[d]||o;return r?a.createElement(v,l(l({ref:t},c),{},{components:r})):a.createElement(v,l({ref:t},c))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,l=new Array(o);l[0]=m;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u.mdxType="string"==typeof e?e:n,l[1]=u;for(var s=2;s<o;s++)l[s]=r[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5162:(e,t,r)=>{r.d(t,{Z:()=>l});var a=r(7294),n=r(6010);const o="tabItem_Ymn6";function l(e){var t=e.children,r=e.hidden,l=e.className;return a.createElement("div",{role:"tabpanel",className:(0,n.Z)(o,l),hidden:r},t)}},5488:(e,t,r)=>{r.d(t,{Z:()=>d});var a=r(7462),n=r(7294),o=r(6010),l=r(2389),u=r(7392),i=r(7094),s=r(2466);const c="tabList__CuJ",p="tabItem_LNqP";function m(e){var t,r,l=e.lazy,m=e.block,d=e.defaultValue,v=e.values,f=e.groupId,b=e.className,h=n.Children.map(e.children,(function(e){if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=v?v:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),y=(0,u.l)(g,(function(e,t){return e.value===t.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===d?d:null!=(t=null!=d?d:null==(r=h.find((function(e){return e.props.default})))?void 0:r.props.value)?t:h[0].props.value;if(null!==k&&!g.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var w=(0,i.U)(),N=w.tabGroupChoices,O=w.setTabGroupChoices,T=(0,n.useState)(k),E=T[0],x=T[1],C=[],j=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=f){var P=N[f];null!=P&&P!==E&&g.some((function(e){return e.value===P}))&&x(P)}var I=function(e){var t=e.currentTarget,r=C.indexOf(t),a=g[r].value;a!==E&&(j(t),x(a),null!=f&&O(f,String(a)))},D=function(e){var t,r=null;switch(e.key){case"ArrowRight":var a,n=C.indexOf(e.currentTarget)+1;r=null!=(a=C[n])?a:C[0];break;case"ArrowLeft":var o,l=C.indexOf(e.currentTarget)-1;r=null!=(o=C[l])?o:C[C.length-1]}null==(t=r)||t.focus()};return n.createElement("div",{className:(0,o.Z)("tabs-container",c)},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},b)},g.map((function(e){var t=e.value,r=e.label,l=e.attributes;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:E===t?0:-1,"aria-selected":E===t,key:t,ref:function(e){return C.push(e)},onKeyDown:D,onFocus:I,onClick:I},l,{className:(0,o.Z)("tabs__item",p,null==l?void 0:l.className,{"tabs__item--active":E===t})}),null!=r?r:t)}))),l?(0,n.cloneElement)(h.filter((function(e){return e.props.value===E}))[0],{className:"margin-top--md"}):n.createElement("div",{className:"margin-top--md"},h.map((function(e,t){return(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==E})}))))}function d(e){var t=(0,l.Z)();return n.createElement(m,(0,a.Z)({key:String(t)},e))}},5702:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>m,contentTitle:()=>c,default:()=>f,frontMatter:()=>s,metadata:()=>p,toc:()=>d});var a=r(7462),n=r(3366),o=(r(7294),r(3905)),l=r(5488),u=r(5162),i=["components"],s={},c=void 0,p={unversionedId:"references/modules/autoscroll",id:"references/modules/autoscroll",title:"autoscroll",description:"React component that implements autoscroll to page start or to the anchor on page on SPA-navigations",source:"@site/tmp-docs/references/modules/autoscroll.md",sourceDirName:"references/modules",slug:"/references/modules/autoscroll",permalink:"/tramvai/docs/references/modules/autoscroll",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/modules/autoscroll.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"user-agent",permalink:"/tramvai/docs/references/libs/user-agent"},next:{title:"cache-warmup",permalink:"/tramvai/docs/references/modules/cache-warmup"}},m={},d=[{value:"Installation",id:"installation",level:2},{value:"Explanation",id:"explanation",level:2},{value:"Behavior",id:"behavior",level:3},{value:"How to",id:"how-to",level:2},{value:"Disable autoscroll for page",id:"disable-autoscroll-for-page",level:3}],v={toc:d};function f(e){var t=e.components,r=(0,n.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},v,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"React component that implements autoscroll to page start or to the anchor on page on SPA-navigations"),(0,o.kt)("p",null,"The behaviour is similar to the ",(0,o.kt)("a",{parentName:"p",href:"https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-tops"},"react-router")),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"First install ",(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/module-autoscroll"),":"),(0,o.kt)(l.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,o.kt)(u.Z,{value:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/module-autoscroll\n"))),(0,o.kt)(u.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tramvai/module-autoscroll\n")))),(0,o.kt)("p",null,"And add ",(0,o.kt)("inlineCode",{parentName:"p"},"AutoscrollModule")," to the modules list:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp } from '@tramvai/core';\nimport { AutoscrollModule } from '@tramvai/module-autoscroll';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [AutoscrollModule],\n});\n")),(0,o.kt)("h2",{id:"explanation"},"Explanation"),(0,o.kt)("h3",{id:"behavior"},"Behavior"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"behavior: smooth")," is not supported by every browser (e.g. doesn't work in Safari). In this case you can use polyfill ",(0,o.kt)("inlineCode",{parentName:"p"},"smoothscroll-polyfill")," that you should add to your app."),(0,o.kt)("h2",{id:"how-to"},"How to"),(0,o.kt)("h3",{id:"disable-autoscroll-for-page"},"Disable autoscroll for page"),(0,o.kt)("p",null,"If you need to disable autoscroll on the specific pages you can specify parameter ",(0,o.kt)("inlineCode",{parentName:"p"},"navigateState.disableAutoscroll = true")," to the ",(0,o.kt)("inlineCode",{parentName:"p"},"navigate")," call:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { useNavigate } from '@tramvai/module-router';\n\nfunction Component() {\n  const navigateToWithoutScroll = useNavigate({\n    url: '/url/',\n    navigateState: { disableAutoscroll: true },\n  });\n\n  return <Button onClick={navigateToWithoutScroll} />;\n}\n")))}f.isMDXComponent=!0}}]);