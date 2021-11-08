(self.webpackChunk=self.webpackChunk||[]).push([[776],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>c,kt:()=>h});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,s=e.originalType,l=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),d=p(n),h=i,m=d["".concat(l,".").concat(h)]||d[h]||u[h]||s;return n?r.createElement(m,o(o({ref:t},c),{},{components:n})):r.createElement(m,o({ref:t},c))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var s=n.length,o=new Array(s);o[0]=d;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var p=2;p<s;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5330:(e,t,n)=>{"use strict";n.r(t),n.d(t,{frontMatter:()=>a,contentTitle:()=>l,metadata:()=>p,toc:()=>c,default:()=>d});var r=n(2122),i=n(9756),s=(n(7294),n(3905)),o=["components"],a={id:"http-client",title:"http-client"},l=void 0,p={unversionedId:"references/libs/http-client",id:"references/libs/http-client",isDocsHomePage:!1,title:"http-client",description:"\u0410\u0431\u0441\u0442\u0440\u0430\u043a\u0442\u043d\u044b\u0439 \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441 HttpClient \u0434\u043b\u044f \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u0438\u0437\u0430\u0446\u0438\u0438 \u0440\u0430\u0431\u043e\u0442\u044b \u0441 \u0432\u043d\u0435\u0448\u043d\u0438\u043c\u0438 API \u0432 tramvai \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u0445",source:"@site/tmp-docs/references/libs/http-client.md",sourceDirName:"references/libs",slug:"/references/libs/http-client",permalink:"/docs/references/libs/http-client",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/http-client.md",version:"current",frontMatter:{id:"http-client",title:"http-client"},sidebar:"docs",previous:{title:"hooks",permalink:"/docs/references/libs/hooks"},next:{title:"is-modern-lib",permalink:"/docs/references/libs/is-modern-lib"}},c=[{value:"API",id:"api",children:[{value:"HttpClient",id:"httpclient",children:[]},{value:"HttpClientRequest",id:"httpclientrequest",children:[]},{value:"HttpClientResponse",id:"httpclientresponse",children:[]},{value:"HttpClientError",id:"httpclienterror",children:[]},{value:"ApiService",id:"apiservice",children:[]}]}],u={toc:c};function d(e){var t=e.components,n=(0,i.Z)(e,o);return(0,s.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"\u0410\u0431\u0441\u0442\u0440\u0430\u043a\u0442\u043d\u044b\u0439 \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441 ",(0,s.kt)("inlineCode",{parentName:"p"},"HttpClient")," \u0434\u043b\u044f \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u0438\u0437\u0430\u0446\u0438\u0438 \u0440\u0430\u0431\u043e\u0442\u044b \u0441 \u0432\u043d\u0435\u0448\u043d\u0438\u043c\u0438 API \u0432 tramvai \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u0445"),(0,s.kt)("h2",{id:"api"},"API"),(0,s.kt)("h3",{id:"httpclient"},"HttpClient"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-tsx"},"type HttpClient = {\n  // common method for sending HTTP requests\n  request<P = any>(request: HttpClientRequest): Promise<HttpClientResponse<P>>;\n  // method for sending GET requests\n  get<R = any>(\n    path: string,\n    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,\n    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>\n  ): Promise<HttpClientResponse<R>>;\n  // method for sending POST requests, uses `requestType: 'json'` by default\n  post<R = any>(\n    path: string,\n    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,\n    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>\n  ): Promise<HttpClientResponse<R>>;\n  // method for sending PUT requests, uses `requestType: 'json'` by default\n  put<R = any>(\n    path: string,\n    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,\n    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>\n  ): Promise<HttpClientResponse<R>>;\n  // method for sending DELETE requests\n  delete<R = any>(\n    path: string,\n    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,\n    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>\n  ): Promise<HttpClientResponse<R>>;\n  // method for creating a new instance of the HTTP client, based on the settings of the current\n  fork(options?: HttpClientRequest, mergeOptionsConfig?: { replace?: boolean }): HttpClient;\n}\n")),(0,s.kt)("h3",{id:"httpclientrequest"},"HttpClientRequest"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-tsx"},"type HttpClientRequest = {\n  // absolute url of the request, do not use simultaneously with `path`\n  url?: string;\n  // url of the request, not to be used simultaneously with `url`\n  path?: string;\n  // base url, which is added to all queries before the `path` value\n  baseUrl?: string;\n  // basic HTTP methods are supported - GET, POST, PUT, DELETE\n  method?: HttpMethod;\n  // request data type, `form` by default\n  requestType?: HttpContentType;\n  // response data type, is calculated from the `content-type` header by default\n  responseType?: HttpContentType;\n  // HTTP request headers\n  headers?: Record<string, any>;\n  // request query parameters\n  query?: Record<string, any>;\n  // request body\n  body?: Record<string, any>;\n  // request execution time limit, in ms\n  timeout?: number;\n  // disabling logging inside the HTTP client. It is recommended to use if a request error is logged manually\n  silent?: boolean;\n  // disabling the request cache\n  cache?: boolean;\n  // if `abortPromise` is resolved, the request will be canceled\n  abortPromise?: Promise<void>;\n  // method to modify request data\n  modifyRequest?: (req: HttpClientRequest) => HttpClientRequest;\n  // method to modify response data\n  modifyResponse?: <P = any>(res: HttpClientResponse<P>) => HttpClientResponse<P>;\n  // method to modify the error object\n  modifyError?: (error: HttpClientError, req: HttpClientRequest) => HttpClientError;\n  [key: string]: any;\n}\n")),(0,s.kt)("h3",{id:"httpclientresponse"},"HttpClientResponse"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-tsx"},"type HttpClientResponse<P = any> = {\n  // response body\n  payload: P;\n  // HTTP response code\n  status: number;\n  // HTTP response headers\n  headers: Record<string, any>;\n}\n")),(0,s.kt)("h3",{id:"httpclienterror"},"HttpClientError"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-tsx"},"type HttpClientError = Error & {\n  [key: string]: any;\n}\n")),(0,s.kt)("h3",{id:"apiservice"},"ApiService"),(0,s.kt)("p",null,(0,s.kt)("inlineCode",{parentName:"p"},"ApiService")," - abstract class for easy creation of services for working with API, allows you to override custom logic in the ",(0,s.kt)("inlineCode",{parentName:"p"},"request")," method, on top of which the rest of the basic methods work."),(0,s.kt)("p",null,"For example, a service that automatically displays a pop-up window when a request error occurs:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-tsx"},"class CustomApiService extends ApiService {\n  constructor({ httpClient }: { httpClient: HttpClient }) {\n    super(httpClient);\n  }\n\n  request<R = any>(request: HttpClientRequest): Promise<HttpClientResponse<R>> {\n    return this.httpClient.request(request).catch((error) => {\n      alert(error);\n    });\n  }\n}\n\nconst service = new CustomApiService({ httpClient });\n\nservice.request({ path: 'fake' }) // show alert\nservice.get('fake') // also show alert\n")))}d.isMDXComponent=!0}}]);