"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9956],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var u=a.createContext({}),l=function(e){var n=a.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=l(e.components);return a.createElement(u.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},c=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,u=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=l(t),m=r,y=c["".concat(u,".").concat(m)]||c[m]||d[m]||i;return t?a.createElement(y,o(o({ref:n},p),{},{components:t})):a.createElement(y,o({ref:n},p))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,o=new Array(i);o[0]=c;var s={};for(var u in n)hasOwnProperty.call(n,u)&&(s[u]=n[u]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var l=2;l<i;l++)o[l]=t[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}c.displayName="MDXCreateElement"},4341:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>u,default:()=>m,frontMatter:()=>s,metadata:()=>l,toc:()=>d});var a=t(7462),r=t(3366),i=(t(7294),t(3905)),o=["components"],s={},u=void 0,l={unversionedId:"how-to/react-query-usage",id:"how-to/react-query-usage",title:"react-query-usage",description:"For @tramvai/react-query to work, you need to connect the @tramvai/module-react-query module to the application",source:"@site/tmp-docs/how-to/react-query-usage.md",sourceDirName:"how-to",slug:"/how-to/react-query-usage",permalink:"/tramvai/docs/how-to/react-query-usage",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/how-to/react-query-usage.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"How to enable modern mode for an application?",permalink:"/tramvai/docs/how-to/how-enable-modern"},next:{title:"ssr-async-components",permalink:"/tramvai/docs/how-to/ssr-async-components"}},p={},d=[{value:"Basic example with createQuery and useQuery",id:"basic-example-with-createquery-and-usequery",level:2},{value:"Preloading data on the server for useQuery",id:"preloading-data-on-the-server-for-usequery",level:2},{value:"Sharing useQuery data between components",id:"sharing-usequery-data-between-components",level:2},{value:"Passing parameters for the request",id:"passing-parameters-for-the-request",level:2},{value:"Setting react-query parameters",id:"setting-react-query-parameters",level:2},{value:"Failed requests",id:"failed-requests",level:2},{value:"Using conditions for query",id:"using-conditions-for-query",level:2},{value:"Basic example for createInfiniteQuery and useInfiniteQuery",id:"basic-example-for-createinfinitequery-and-useinfinitequery",level:2},{value:"Basic example for createMutation and useMutation",id:"basic-example-for-createmutation-and-usemutation",level:2}],c={toc:d};function m(e){var n=e.components,t=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"For ",(0,i.kt)("a",{parentName:"p",href:"/tramvai/docs/references/tramvai/react-query"},"@tramvai/react-query")," to work, you need to connect the ",(0,i.kt)("a",{parentName:"p",href:"/tramvai/docs/references/modules/react-query"},"@tramvai/module-react-query")," module to the application"),(0,i.kt)("h2",{id:"basic-example-with-createquery-and-usequery"},"Basic example with createQuery and useQuery"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"Expand"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createQuery, useQuery } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\nconst query = createQuery({\n  key: 'base',\n  fn: async (_, { apiClient }) => {\n    const { payload } = await apiClient.get<string>('api/base');\n\n    await new Promise((resolve) => setTimeout(resolve, 50));\n\n    return payload;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n});\n\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const { data, isLoading } = useQuery(query);\n\n  return <div>{isLoading ? 'loading...' : data}</div>;\n}\n\n"))))),(0,i.kt)("h2",{id:"preloading-data-on-the-server-for-usequery"},"Preloading data on the server for useQuery"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"Expand"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createQuery, useQuery } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\nconst query = createQuery({\n  key: 'base',\n  fn: async (_, { apiClient }) => {\n    const { payload } = await apiClient.get<string>('api/base');\n    await new Promise((resolve) => setTimeout(resolve, 50));\n\n    return payload;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n});\n\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const { data, isLoading } = useQuery(query);\n\n  return <div>{isLoading ? 'loading...' : data}</div>;\n}\n\nComponent.actions = [query.prefetchAction()];\n\n"))))),(0,i.kt)("h2",{id:"sharing-usequery-data-between-components"},"Sharing useQuery data between components"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"Expand"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { useState, useEffect } from 'react';\nimport { createQuery, useQuery } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\nconst query = createQuery({\n  key: 'base',\n  fn: async (_, { apiClient }) => {\n    const { payload } = await apiClient.get<string>('api/base');\n\n    await new Promise((resolve) => setTimeout(resolve, 5000));\n\n    return payload;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n});\n\nconst Child1 = () => {\n  const { isLoading, data } = useQuery(query);\n\n  return <div>Child1: {isLoading ? 'loading...' : data}</div>;\n};\n\nconst Child2 = () => {\n  const { isLoading, data } = useQuery(query);\n\n  return <div>Child2: {isLoading ? 'loading...' : data}</div>;\n};\n\nconst Child3 = () => {\n  const { isLoading, data } = useQuery(query);\n\n  return <div>Child3: {isLoading ? 'loading...' : data}</div>;\n};\n\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const [child2, setChild2Visible] = useState(false);\n  const [child3, setChild3Visible] = useState(false);\n\n  useEffect(() => {\n    setTimeout(() => {\n      setChild2Visible(true);\n    }, 3000);\n\n    setTimeout(() => {\n      setChild3Visible(true);\n    }, 7000);\n  }, []);\n\n  return (\n    <>\n      <Child1 />\n      {child2 && <Child2 />}\n      {child3 && <Child3 />}\n    </>\n  );\n}\n\n"))))),(0,i.kt)("h2",{id:"passing-parameters-for-the-request"},"Passing parameters for the request"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"Expand"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { useState, useEffect } from 'react';\nimport { createQuery, useQuery } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\nconst query = createQuery({\n  key: (parameter: string) => ['api-group', parameter],\n  fn: async (parameter, { apiClient }) => {\n    console.log(`request to ${parameter}`);\n    const { payload } = await apiClient.get<string>(`api/group/${parameter}`);\n\n    await new Promise((resolve) => setTimeout(resolve, 5000));\n\n    return payload;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n});\n\nconst Child1 = () => {\n  const { isLoading, data } = useQuery(query, 'test-1');\n\n  return <div>Child1: {isLoading ? 'loading...' : data}</div>;\n};\n\nconst Child2 = () => {\n  const { isLoading, data } = useQuery(query, 'test-1');\n\n  return <div>Child2: {isLoading ? 'loading...' : data}</div>;\n};\n\nconst Child3 = () => {\n  const { isLoading, data } = useQuery(query, 'test-2');\n\n  return <div>Child3: {isLoading ? 'loading...' : data}</div>;\n};\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const [child2, setChild2Visible] = useState(false);\n  const [child3, setChild3Visible] = useState(false);\n\n  useEffect(() => {\n    setTimeout(() => {\n      setChild2Visible(true);\n    }, 3000);\n\n    setTimeout(() => {\n      setChild3Visible(true);\n    }, 7000);\n  }, []);\n\n  return (\n    <>\n      <Child1 />\n      {child2 && <Child2 />}\n      {child3 && <Child3 />}\n    </>\n  );\n}\n\n"))))),(0,i.kt)("h2",{id:"setting-react-query-parameters"},"Setting react-query parameters"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"Expand"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createQuery, useQuery } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\nconst query = createQuery({\n  key: 'time',\n  fn: async (_, { apiClient }) => {\n    const { payload } = await apiClient.request<string>({\n      path: 'api/time',\n      cache: false,\n    });\n\n    return payload;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n  queryOptions: {\n    refetchOnWindowFocus: true,\n    refetchOnMount: true,\n  },\n});\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const { data } = useQuery(\n    query.fork({\n      refetchInterval: 2000,\n      refetchIntervalInBackground: false,\n    })\n  );\n\n  return <div>{data}</div>;\n}\n\n"))))),(0,i.kt)("h2",{id:"failed-requests"},"Failed requests"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"Expand"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createQuery, useQuery } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\nconst query = createQuery({\n  key: 'base',\n  fn: async (_, { apiClient }) => {\n    const { payload } = await apiClient.get('api/fail');\n\n    return payload;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n  queryOptions: {\n    retryDelay: 500,\n  },\n});\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const { data, isLoading, isError, error } = useQuery(query);\n\n  if (isLoading) {\n    return <div>loading...</div>;\n  }\n\n  if (isError) {\n    return <div>error: {error!.message}</div>;\n  }\n\n  return <div>{data}</div>;\n}\n\n"))))),(0,i.kt)("h2",{id:"using-conditions-for-query"},"Using conditions for query"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"Expand"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { useState, useEffect } from 'react';\nimport { createQuery, useQuery } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\nconst query = createQuery({\n  key: 'auth',\n  fn: async (_, { apiClient }) => {\n    const { payload } = await apiClient.get('api/auth');\n\n    return payload;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n  conditions: {\n    onlyServer: true,\n  },\n});\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const { data = 'no-data', isLoading } = useQuery(query);\n\n  return <div>{isLoading ? 'loading...' : data}</div>;\n}\n\n"))))),(0,i.kt)("h2",{id:"basic-example-for-createinfinitequery-and-useinfinitequery"},"Basic example for createInfiniteQuery and useInfiniteQuery"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"Expand"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createInfiniteQuery, useInfiniteQuery } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\ninterface Response {\n  nextPage?: number;\n  list: string[];\n}\n\nconst query = createInfiniteQuery({\n  key: 'list',\n  fn: async (_, start = 0, { apiClient }) => {\n    const { payload } = await apiClient.get<Response>('api/list', {\n      query: {\n        count: 30,\n        start,\n      },\n    });\n\n    return payload;\n  },\n  getNextPageParam: (page: Response) => {\n    return page.nextPage;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n  infiniteQueryOptions: {},\n});\n\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(query);\n\n  if (isLoading) {\n    return <>loading...</>;\n  }\n\n  return (\n    <div>\n      <div>\n        {data!.pages.map((page) => {\n          return page.list.map((entry) => {\n            return <div key={entry}>{entry}</div>;\n          });\n        })}\n      </div>\n      {hasNextPage && (\n        <button type=\"button\" onClick={() => fetchNextPage()}>\n          Load more\n        </button>\n      )}\n    </div>\n  );\n}\n\n"))))),(0,i.kt)("h2",{id:"basic-example-for-createmutation-and-usemutation"},"Basic example for createMutation and useMutation"),(0,i.kt)("p",null,(0,i.kt)("details",null,(0,i.kt)("summary",null,"\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435"),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createMutation, useMutation } from '@tramvai/react-query';\nimport { FAKE_API_CLIENT } from '../../fakeApiClient';\n\nconst mutation = createMutation({\n  key: 'post',\n  fn: async (_, data: string, { apiClient }) => {\n    const { payload } = await apiClient.post('api/post', {\n      body: {\n        data,\n      },\n    });\n\n    return payload;\n  },\n  deps: {\n    apiClient: FAKE_API_CLIENT,\n  },\n});\n// eslint-disable-next-line import/no-default-export\nexport default function Component() {\n  const { isLoading, mutate } = useMutation(mutation);\n\n  if (isLoading) {\n    return <>loading...</>;\n  }\n\n  return (\n    <button type=\"button\" onClick={() => mutate('test')}>\n      Send data\n    </button>\n  );\n}\n\n"))))))}m.isMDXComponent=!0}}]);