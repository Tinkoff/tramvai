"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9432],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>u});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),m=p(n),u=i,k=m["".concat(s,".").concat(u)]||m[u]||c[u]||o;return n?a.createElement(k,r(r({ref:t},d),{},{components:n})):a.createElement(k,r({ref:t},d))}));function u(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,r=new Array(o);r[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,r[1]=l;for(var p=2;p<o;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6305:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>s,default:()=>u,frontMatter:()=>l,metadata:()=>p,toc:()=>c});var a=n(7462),i=n(3366),o=(n(7294),n(3905)),r=["components"],l={title:"@tramvai/cli",sidebar_label:"base",sidebar_position:1},s=void 0,p={unversionedId:"references/cli/base",id:"references/cli/base",title:"@tramvai/cli",description:"CLI interface for resolving actual problems and tasks of frontend CI. Reduces complexity of setting up webpack, typescript, babel, postcss and other tools.",source:"@site/tmp-docs/references/cli/base.md",sourceDirName:"references/cli",slug:"/references/cli/base",permalink:"/docs/references/cli/base",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/cli/base.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"@tramvai/cli",sidebar_label:"base",sidebar_position:1},sidebar:"sidebar",previous:{title:"storybook-addon",permalink:"/docs/references/tramvai/storybook-addon"},next:{title:"config",permalink:"/docs/references/cli/config"}},d={},c=[{value:"Installation",id:"installation",level:2},{value:"API",id:"api",level:2},{value:"Commands",id:"commands",level:3},{value:"Explanation",id:"explanation",level:2},{value:"Notifications settings",id:"notifications-settings",level:3},{value:"CSS class names generation settings",id:"css-class-names-generation-settings",level:3},{value:"Polyfills for the standard NodeJS modules",id:"polyfills-for-the-standard-nodejs-modules",level:3},{value:"Checking TypeScript types",id:"checking-typescript-types",level:3},{value:"Deduplication of modules",id:"deduplication-of-modules",level:3},{value:"Debug an app",id:"debug-an-app",level:3},{value:"Source Maps",id:"source-maps",level:4},{value:"Development",id:"development",level:5},{value:"Production",id:"production",level:5},{value:"Configuration",id:"configuration",level:2},{value:"build or serve config?",id:"build-or-serve-config",level:3},{value:"How to",id:"how-to",level:2},{value:"Code generation",id:"code-generation",level:3},{value:"Generate new project",id:"generate-new-project",level:3},{value:"How to run nodejs app in debug mode?",id:"how-to-run-nodejs-app-in-debug-mode",level:3},{value:"Get details for deprecated and warning logs",id:"get-details-for-deprecated-and-warning-logs",level:3},{value:"How to use browserstack for testing",id:"how-to-use-browserstack-for-testing",level:3},{value:"How to test app on mobile or other device in local network",id:"how-to-test-app-on-mobile-or-other-device-in-local-network",level:3}],m={toc:c};function u(e){var t=e.components,n=(0,i.Z)(e,r);return(0,o.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"CLI interface for resolving actual problems and tasks of frontend CI. Reduces complexity of setting up webpack, typescript, babel, postcss and other tools."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," may build projects to production, run code in development mode with automatic rebuilds, project analyze and code generation"),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"Global installation on the developer machine. After that the new command ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai")," will be available in terminal."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -g @tramvai/cli\n")),(0,o.kt)("p",null,"Local installation to the project"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm i --save-dev @tramvai/cli\n")),(0,o.kt)("h2",{id:"api"},"API"),(0,o.kt)("h3",{id:"commands"},"Commands"),(0,o.kt)("p",null,"After any command you can pass ",(0,o.kt)("inlineCode",{parentName:"p"},"--help")," string, e.g. ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai --help")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai start --help"),". After that you will see description of the command and its options."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai new")," - generate new tramvai app with @tramvai/cli"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai start")," - run app in the development mode"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai start-prod")," - run app in development mode, but code will be build in the production mode"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai build")," - build an app for server and client"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai static")," - generate static HTML for application pages"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai analyze")," - analyze bundle size"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai generate")," - code generation for different components. E.g. new projects, react components, actions and etc."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai update")," - update ",(0,o.kt)("inlineCode",{parentName:"li"},"@tramvai/cli")," and all of the ",(0,o.kt)("inlineCode",{parentName:"li"},"@tramvai")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"@tramvai-tinkoff")," dependencies in the project. This command additionally executes dependency deduplication and code migrations"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tramvai add")," - add ",(0,o.kt)("inlineCode",{parentName:"li"},"@tramvai")," or ",(0,o.kt)("inlineCode",{parentName:"li"},"@tramvai-tinkoff")," dependency to the app. This command additionally executes dependency deduplication and code migrations")),(0,o.kt)("h2",{id:"explanation"},"Explanation"),(0,o.kt)("h3",{id:"notifications-settings"},"Notifications settings"),(0,o.kt)("p",null,"Inside ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai.json")," the settings for the notification can be specified at path ",(0,o.kt)("inlineCode",{parentName:"p"},"commands.serve.notifications"),". Parameters are passed to ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/RoccoC/webpack-build-notifier#config-options"},"webpack-build-notifier"),". You can specify global configuration or a specific configuration either for client or server build."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'"commands": {\n    "serve": {\n      "notifications": {\n        "suppressSuccess": "always",\n        "server": {\n          "suppressWarning": true\n        },\n        "client": {\n          "activateTerminalOnError": true\n        }\n      }\n    }\n}\n')),(0,o.kt)("h3",{id:"css-class-names-generation-settings"},"CSS class names generation settings"),(0,o.kt)("p",null,"Name generation is configured via the options ",(0,o.kt)("inlineCode",{parentName:"p"},"cssLocalIdentNameDev")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"cssLocalIdentNameProd")," (common option ",(0,o.kt)("inlineCode",{parentName:"p"},"cssLocalIdentName")," might be used to specify settings for both prod and dev)."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'"commands": {\n  "build": {\n    "configurations": {\n      "postcss": {\n        "cssLocalIdentName": "[hash:base64:5]", // default value (deprecated)\n        "cssLocalIdentNameDev": "[name]__[local]_[minicss]", // available values see in the docs to [css-loader](https://github.com/webpack-contrib/css-loader)\n        "cssLocalIdentNameProd": "[minicss]", // additionally new tag `minicss` can be used for the generating minimal css names. Based on [article](https://dev.to/denisx/reduce-bundle-size-via-one-letter-css-classname-hash-strategy-10g6)\n      };\n    };\n  };\n};\n')),(0,o.kt)("h3",{id:"polyfills-for-the-standard-nodejs-modules"},"Polyfills for the standard NodeJS modules"),(0,o.kt)("p",null,"By default, ",(0,o.kt)("inlineCode",{parentName:"p"},"webpack")," starting with 5th version, do not add polyfills to browser bundle when using nodejs standard modules in the browser code, e.g. when using ",(0,o.kt)("em",{parentName:"p"},"crypto"),", ",(0,o.kt)("em",{parentName:"p"},"path"),", ",(0,o.kt)("em",{parentName:"p"},"process"),", ",(0,o.kt)("em",{parentName:"p"},"buffer"),", etc."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," explicitly adds polyfills for ",(0,o.kt)("em",{parentName:"p"},"path")," and ",(0,o.kt)("em",{parentName:"p"},"process")," modules as these modules are often used and lightweighted."),(0,o.kt)("h3",{id:"checking-typescript-types"},"Checking TypeScript types"),(0,o.kt)("p",null,"Checking types is enabled by flag ",(0,o.kt)("inlineCode",{parentName:"p"},"checkAsyncTs"),"."),(0,o.kt)("p",null,"When running ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai start")," ts compilation and type checks will be executed."),(0,o.kt)("p",null,"Inside ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai.json")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'"checkAsyncTs": {\n  "failOnBuild": true, // optional\n  "pluginOptions": {} // optional\n},\n')),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"failOnBuild")," adds type checks when running ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai build"),". This way build will fail in case of wrong types."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"pluginOptions")," \u2013 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options"},"list of the additional options")," for the plugin ",(0,o.kt)("inlineCode",{parentName:"p"},"fork-ts-checker-webpack-plugin")),(0,o.kt)("p",null,"If you want to override path to tsconfig through ",(0,o.kt)("strong",{parentName:"p"},"pluginOptions.tsconfig")," the option should be specified relative to the ",(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," folder itself e.g. ",(0,o.kt)("em",{parentName:"p"},"node_modules/@tramvai/cli"),". By default tsconfig is expected to be in the project root directory: ",(0,o.kt)("em",{parentName:"p"},"\\<rootDir",">","/tsconfig.json")),(0,o.kt)("h3",{id:"deduplication-of-modules"},"Deduplication of modules"),(0,o.kt)("p",null,"Option ",(0,o.kt)("inlineCode",{parentName:"p"},"commands.build.configurations.dedupe")," controls the settings of plugin for the deduplication process. Available options are:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},'"equality"')," - uses strict version comparison. Dedupes modules in ",(0,o.kt)("inlineCode",{parentName:"li"},"node_modules")," with equal package version that are imported from different sources. E.g. imports for ",(0,o.kt)("inlineCode",{parentName:"li"},"node_modules/package/index.js")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"node_modules/nested-package/node_modules/package/index.js")," are deduped into a single ",(0,o.kt)("inlineCode",{parentName:"li"},"node_modules/package/index.js")," import whilst without dedupe it will bundle two files as separate modules."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},'"semver"')," - compares version of packages based on semver. It can dedupe all of the imports with the same major version and any of the minor and patch versions. E.g. next versions will be deduped: from ",(0,o.kt)("inlineCode",{parentName:"li"},"1.14.0")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"1.16.2")," to ",(0,o.kt)("inlineCode",{parentName:"li"},"1.16.2"),", from ",(0,o.kt)("inlineCode",{parentName:"li"},"0.14.1")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"0.16.5")," to ",(0,o.kt)("inlineCode",{parentName:"li"},"0.16.5"),", whilst versions ",(0,o.kt)("inlineCode",{parentName:"li"},"0.0.2")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"0.0.5")," will be left without deduplication."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"false")," - disable deduplication, by default")),(0,o.kt)("h3",{id:"debug-an-app"},"Debug an app"),(0,o.kt)("p",null,"While developing sometimes it is needed to debug nodejs app directly so see CPU, memory consumptions etc. To do it the options ",(0,o.kt)("inlineCode",{parentName:"p"},"--debug")," might be passed to commands ",(0,o.kt)("inlineCode",{parentName:"p"},"start")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"start-prod")," which do next:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"enables source maps for build on client and server"),(0,o.kt)("li",{parentName:"ul"},"starts the server process with the flag ",(0,o.kt)("a",{parentName:"li",href:"https://nodejs.org/ru/docs/guides/debugging-getting-started/"},(0,o.kt)("inlineCode",{parentName:"a"},"--inspect")),".")),(0,o.kt)("p",null,"After that you can open debugger in the chrome devtools - ",(0,o.kt)("inlineCode",{parentName:"p"},"chrome://inspect")),(0,o.kt)("h4",{id:"source-maps"},"Source Maps"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"webpack")," offers several kind of ",(0,o.kt)("a",{parentName:"p",href:"https://webpack.js.org/configuration/devtool/#qualities"},"sourcemap qualities"),". Some of the examples are:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Source code - the code before transpilation and bundling. Snapshot of the source code, splitted by modules"),(0,o.kt)("li",{parentName:"ol"},"Transformed code - the code after transpilation by loaders (etc. babel-loader), splitted by modules"),(0,o.kt)("li",{parentName:"ol"},"Generated code - the code after transpilation and bundling, splitted by modules. Every import and exported are replaced by webpack wrapper code")),(0,o.kt)("p",null,"For development source maps for transformed or generated code is used as it is more performant and shows the exact code that is executed in the target environment. The main differences from the debugging without sourcemaps is that code has links to modules to original source files."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"tramvai")," generates big single bundle with server code and that's why it is preferred to not include sourcemaps in the code itself and put it to the separate ",(0,o.kt)("inlineCode",{parentName:"p"},".js.map")," file."),(0,o.kt)("h5",{id:"development"},"Development"),(0,o.kt)("p",null,"By default, for browser is used the fastest sourcemaps, while for server no sourcemaps is used."),(0,o.kt)("p",null,"Flag ",(0,o.kt)("inlineCode",{parentName:"p"},"--debug")," enables sourcemap generation for the server bundle."),(0,o.kt)("p",null,"Option ",(0,o.kt)("inlineCode",{parentName:"p"},"commands.serve.configurations.sourceMap")," enables sourcemap generation both for browser and server code."),(0,o.kt)("h5",{id:"production"},"Production"),(0,o.kt)("p",null,"By default, sourcemaps are disabled both for the client and server code."),(0,o.kt)("p",null,"Flag ",(0,o.kt)("inlineCode",{parentName:"p"},"--debug")," enables sourcemaps generation for the client and server bundles."),(0,o.kt)("p",null,"Option ",(0,o.kt)("inlineCode",{parentName:"p"},"commands.build.configurations.sourceMap")," enables sourcemap generation for the client bundle."),(0,o.kt)("p",null,"Option ",(0,o.kt)("inlineCode",{parentName:"p"},"commands.build.configurations.sourceMapServer")," enables sourcemap generation for the server bundle."),(0,o.kt)("h2",{id:"configuration"},"Configuration"),(0,o.kt)("p",null,"Configuration is provided through json-file with the name ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai.json")," in the root of the single-application/monorepo"),(0,o.kt)("h3",{id:"build-or-serve-config"},"build or serve config?"),(0,o.kt)("p",null,"When you are deciding where to put specific settings in ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai.json")," consider next statements:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"serve")," config is only for development builds (using ",(0,o.kt)("inlineCode",{parentName:"li"},"tramvai start"),")"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"build")," config mostly focused on production builds (",(0,o.kt)("inlineCode",{parentName:"li"},"tramvai build"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"tramvai analyze"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"tramvai start-prod"),") but may affect development builds as well (is this case this configs are merged)")),(0,o.kt)("p",null,"In conclusion: put most of the settings in the ",(0,o.kt)("inlineCode",{parentName:"p"},"build")," config and put settings in the ",(0,o.kt)("inlineCode",{parentName:"p"},"serve")," config only if they are specific to development builds or you need to override ",(0,o.kt)("inlineCode",{parentName:"p"},"build")," settings to the development process."),(0,o.kt)("h2",{id:"how-to"},"How to"),(0,o.kt)("h3",{id:"code-generation"},"Code generation"),(0,o.kt)("p",null,"For make life easier for developers ",(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," has ability to automatically generate code with template. For running code generator use command ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai generate")," and pick up one of the options available to generate that entity:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"action"),(0,o.kt)("li",{parentName:"ul"},"bundle"),(0,o.kt)("li",{parentName:"ul"},"reducer"),(0,o.kt)("li",{parentName:"ul"},"page"),(0,o.kt)("li",{parentName:"ul"},"component"),(0,o.kt)("li",{parentName:"ul"},"module")),(0,o.kt)("p",null,"After that template files will be generated"),(0,o.kt)("h3",{id:"generate-new-project"},"Generate new project"),(0,o.kt)("p",null,"For the quick start of new project you can use command ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai new")," that will generate new base project with the tramvai and tramvai-cli"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"install tramvai-cli ",(0,o.kt)("a",{parentName:"li",href:"#installation"},"globally")),(0,o.kt)("li",{parentName:"ul"},"enter command ",(0,o.kt)("inlineCode",{parentName:"li"},"tramvai new NAME_YOUR_APP")," in the shell"),(0,o.kt)("li",{parentName:"ul"},"choose options based on your preferences: monorepo or multirepo, CI integration and testing framework")),(0,o.kt)("p",null,"After command execution and dependency installation new project will be ready to use"),(0,o.kt)("h3",{id:"how-to-run-nodejs-app-in-debug-mode"},"How to run nodejs app in debug mode?"),(0,o.kt)("p",null,"Add flag ",(0,o.kt)("inlineCode",{parentName:"p"},"--debug")," when running app"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"tramvai start my-app --debug\n")),(0,o.kt)("p",null,"Then open chrome devTools, click on NodeJs logo in the upper left corner. New window with the nodejs devtools will be opened that allows to debug memory and cpu usage, debug code and take the performance profiles."),(0,o.kt)("h3",{id:"get-details-for-deprecated-and-warning-logs"},"Get details for deprecated and warning logs"),(0,o.kt)("p",null,"It might be useful to get the stacktraces of some of the warnings."),(0,o.kt)("p",null,"E.g., while running app if you see logs like this"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"(node:2898) DeprecationWarning: ...\n(Use `node --trace-deprecation ...` to show where the warning was created)\n")),(0,o.kt)("p",null,"You may add flag ",(0,o.kt)("inlineCode",{parentName:"p"},"--trace")," in order to run nodejs server with the ",(0,o.kt)("a",{parentName:"p",href:"https://nodejs.org/dist/latest-v14.x/docs/api/cli.html#cli_trace_warnings"},"additional options"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"tramvai start my-app --trace\n")),(0,o.kt)("p",null,"After that these logs will be printed with their stacktraces"),(0,o.kt)("h3",{id:"how-to-use-browserstack-for-testing"},"How to use browserstack for testing"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"To get access to browserstack just type command ",(0,o.kt)("inlineCode",{parentName:"p"},"/bs")," in slack")),(0,o.kt)("p",null,"Run app as usual with ",(0,o.kt)("inlineCode",{parentName:"p"},"tramvai start")," command and follow the ",(0,o.kt)("a",{parentName:"p",href:"https://www.browserstack.com/docs/live/local-testing"},"browsertack instruction for the local development"),". If everything were done right you will be able to get access to localhost inside browserstack and test your app through it."),(0,o.kt)("h3",{id:"how-to-test-app-on-mobile-or-other-device-in-local-network"},"How to test app on mobile or other device in local network"),(0,o.kt)("p",null,"Both devices one that running the app and one for testing must reside in the same network."),(0,o.kt)("p",null,"For setting access through local network follow next steps:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"figure out the ip of the machine that runs app"),(0,o.kt)("li",{parentName:"ol"},"run command ",(0,o.kt)("inlineCode",{parentName:"li"},"tramvai start")," with flag ",(0,o.kt)("inlineCode",{parentName:"li"},"--staticHost")," with value of the ip address that was resolved on previous step (e.g. ",(0,o.kt)("inlineCode",{parentName:"li"},"tramvai start tincoin --staticHost 192.168.1.3"),")"),(0,o.kt)("li",{parentName:"ol"},"from the testing device open the new page in the browser and use the ip address from the previous step as domain name")),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"When calling @tramvai/cli using npm you need to pass ",(0,o.kt)("inlineCode",{parentName:"p"},"--")," before any additional arguments, e.g. command should look similar to this ",(0,o.kt)("inlineCode",{parentName:"p"},"npm start -- --staticHost 192.168.1.3"))))}u.isMDXComponent=!0}}]);