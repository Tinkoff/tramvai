"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4904],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>k});var o=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=o.createContext({}),m=function(e){var t=o.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},l=function(e){var t=m(e.components);return o.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=m(n),k=a,h=d["".concat(p,".").concat(k)]||d[k]||c[k]||i;return n?o.createElement(h,r(r({ref:t},l),{},{components:n})):o.createElement(h,r({ref:t},l))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,r=new Array(i);r[0]=d;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:a,r[1]=s;for(var m=2;m<i;m++)r[m]=n[m];return o.createElement.apply(null,r)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5449:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>k,frontMatter:()=>s,metadata:()=>m,toc:()=>c});var o=n(7462),a=n(3366),i=(n(7294),n(3905)),r=["components"],s={id:"fetch-data",title:"Fetch data"},p=void 0,m={unversionedId:"tutorials/pokedex-app/fetch-data",id:"tutorials/pokedex-app/fetch-data",title:"Fetch data",description:"In this lesson we will learn how to fetch data to the pages of our application by using the new HTTP client.",source:"@site/tmp-docs/tutorials/pokedex-app/04-fetch-data.md",sourceDirName:"tutorials/pokedex-app",slug:"/tutorials/pokedex-app/fetch-data",permalink:"/docs/tutorials/pokedex-app/fetch-data",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/tutorials/pokedex-app/04-fetch-data.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{id:"fetch-data",title:"Fetch data"},sidebar:"sidebar",previous:{title:"Create HTTP client",permalink:"/docs/tutorials/pokedex-app/create-http-client"},next:{title:"Page with dynamic parameters",permalink:"/docs/tutorials/pokedex-app/dynamic-page"}},l={},c=[],d={toc:c};function k(e){var t=e.components,n=(0,a.Z)(e,r);return(0,i.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"In this lesson we will learn how to fetch data to the pages of our application by using the new HTTP client."),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/docs/concepts/action"},"Actions")," - the core mechanism for loading data in ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai")," applications.\nYou can add any number of actions at the level of the whole application, bundle and specific page.\nWhen loading a page, all these actions will be executed in ",(0,i.kt)("strong",{parentName:"p"},"parallel"),".\nActions that won't be executed in ",(0,i.kt)("strong",{parentName:"p"},"500ms")," on the server will be automatically executed on the client.\nThanks to this, the minimal possible response time from the server is achieved."),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"The limit of ",(0,i.kt)("strong",{parentName:"p"},"500ms")," is set in the ",(0,i.kt)("inlineCode",{parentName:"p"},"ActionModule"),", and we do not recommend increasing this number.\nBut if long responses from your API are the expected behavior, you can overwrite this value via the ",(0,i.kt)("inlineCode",{parentName:"p"},"limitActionGlobalTimeRun")," string token.")),(0,i.kt)("p",null,"The data from the actions are not passed to the page component ",(0,i.kt)("inlineCode",{parentName:"p"},"props"),".\nThe standard pattern for loading data is to create a special ",(0,i.kt)("a",{parentName:"p",href:"/docs/references/tramvai/state/create-reducer"},"reducer")," to store the data, and dispatch ",(0,i.kt)("a",{parentName:"p",href:"/docs/references/tramvai/state/create-event"},"events")," to fill that reducer in the action."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"The following code is very similar to boilerplate code with ",(0,i.kt)("inlineCode",{parentName:"p"},"redux")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"redux-thunk"),".\nIf you don't need to save data in global store, you can use integration with ",(0,i.kt)("a",{parentName:"p",href:"/docs/references/modules/react-query"},"react-query")," instead of actions and reducers.\nThis will drastically reduce the amount of code, but also make our application less flexible.")),(0,i.kt)("p",null,"The main page of our ",(0,i.kt)("inlineCode",{parentName:"p"},"Pokedex")," is the pokemon list, so we will work with the ",(0,i.kt)("inlineCode",{parentName:"p"},"Pokemon")," entity, following the feature-sliced methodology.\nLet's add a new ",(0,i.kt)("a",{parentName:"p",href:"https://feature-sliced.design/docs/reference/layers/entities"},"entity")," ",(0,i.kt)("inlineCode",{parentName:"p"},"entities/couter")," to our application."),(0,i.kt)("p",null,"\u231b First, create a folder called ",(0,i.kt)("inlineCode",{parentName:"p"},"entities/pokemon"),"."),(0,i.kt)("p",null,"\u231b Next, create a ",(0,i.kt)("a",{parentName:"p",href:"https://feature-sliced.design/docs/reference/segments#model"},"model")," of our new entity with basic interfaces:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="entities/pokemon/model.ts"',title:'"entities/pokemon/model.ts"'},"// highlight-start\n// here we will gradually describe the interface that the API returns to us\nexport type Pokemon = {\n  id: number;\n  name: string;\n};\n\n// our reducer state interface\nexport type PokemonsState = Record<string, Pokemon>;\n\nconst initialState: PokemonsState = {};\n\n// highlight-end\n")),(0,i.kt)("p",null,"\u231b Add events to update the reducer:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="entities/pokemon/model.ts"',title:'"entities/pokemon/model.ts"'},"// highlight-next-line\nimport { createEvent } from '@tramvai/state';\n\nexport type Pokemon = {\n  id: number;\n  name: string;\n};\n\nexport type PokemonsState = Record<string, Pokemon>;\nconst initialState: PokemonsState = {};\n\n// highlight-start\n// event of successful download of the pokemon list\nexport const pokemonListLoadedEvent = createEvent<Pokemon[]>('pokemonListLoaded');\n// event of a successful download of information about a particular pokemon\nexport const pokemonLoadedEvent = createEvent<Pokemon>('pokemonLoaded');\n// highlight-end\n")),(0,i.kt)("p",null,"\u231b Then add an action to fetch the data, using our new HTTP client:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="entities/pokemon/model.ts"',title:'"entities/pokemon/model.ts"'},"import { createEvent } from '@tramvai/state';\n// highlight-start\nimport { declareAction } from '@tramvai/core';\nimport { POKEAPI_HTTP_CLIENT } from '~shared/api';\n// highlight-end\n\nexport type Pokemon = {\n  name: string;\n};\n\nexport type PokemonsState = Record<string, Pokemon>;\nconst initialState: PokemonsState = {};\n\nexport const pokemonListLoadedEvent = createEvent<Pokemon[]>('pokemonListLoaded');\nexport const pokemonLoadedEvent = createEvent<Pokemon>('pokemonLoaded');\n\n// highlight-start\nexport const fetchPokemonListAction = declareAction({\n  name: 'fetchPokemonList',\n  async fn() {\n    const limit = 10;\n    const offset = 0;\n\n    // upload a list of the names of the first 10 pokemon https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0\n    const pokemonsNamesResponse = await this.deps.pokeapiHttpClient.get<{ results: { name: string }[] }>(\n      '/pokemon',\n      { query: { limit, offset } }\n    );\n    const pokemonsNames = pokemonsNamesResponse.payload.results;\n\n    // download detailed information about each pokemon in parallel https://pokeapi.co/api/v2/pokemon/bulbasaur/\n    const pokemonList = await Promise.all(\n      pokemonsNames.map(async ({ name }) => {\n        const pokemonResponse = await this.deps.pokeapiHttpClient.get<Pokemon>(`/pokemon/${name}`);\n        return pokemonResponse.payload;\n      })\n    );\n\n    // save the final list to the reducer\n    this.dispatch(pokemonListLoadedEvent(pokemonList));\n  },\n  deps: {\n    pokeapiHttpClient: POKEAPI_HTTP_CLIENT,\n  },\n});\n// highlight-end\n")),(0,i.kt)("p",null,"\u231b And describe the reducer itself:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="entities/pokemon/model.ts"',title:'"entities/pokemon/model.ts"'},"// highlight-next-line\nimport { createEvent, createReducer } from '@tramvai/state';\nimport { declareAction } from '@tramvai/core';\n\nexport type Pokemon = {\n  id: number;\n  name: string;\n};\n\nexport type PokemonsState = Record<string, Pokemon>;\n\nconst initialState: PokemonsState = {};\n\nexport const pokemonListLoadedEvent = createEvent<Pokemon[]>('pokemonListLoaded');\nexport const pokemonLoadedEvent = createEvent<Pokemon>('pokemonLoaded');\n\nexport const fetchPokemonListAction = declareAction({\n  name: 'fetchPokemonList',\n  async fn() {\n    const limit = 10;\n    const offset = 0;\n\n    const pokemonsNamesResponse = await this.deps.pokeapiHttpClient.get<{ results: { name: string }[] }>(\n      '/pokemon',\n      { query: { limit, offset } }\n    );\n    const pokemonsNames = pokemonsNamesResponse.payload.results;\n\n    const pokemonList = await Promise.all(\n      pokemonsNames.map(async ({ name }) => {\n        const pokemonResponse = await this.deps.pokeapiHttpClient.get<Pokemon>(`/pokemon/${name}`);\n        return pokemonResponse.payload;\n      })\n    );\n\n    this.dispatch(pokemonListLoadedEvent(pokemonList));\n  },\n  deps: {\n    pokeapiHttpClient: POKEAPI_HTTP_CLIENT,\n  },\n});\n\n// highlight-start\nexport const PokemonsStore = createReducer('pokemons', initialState)\n  .on(pokemonListLoadedEvent, (state, pokemonList) => {\n    return pokemonList.reduce((nextState, pokemon) => {\n      return {\n        ...nextState,\n        [pokemon.name]: {\n          ...nextState[pokemon.name],\n          ...pokemon,\n        },\n      };\n    }, state);\n  })\n  .on(pokemonLoadedEvent, (state, pokemon) => {\n    return {\n      ...state,\n      [pokemon.name]: {\n        ...state[pokemon.name],\n        ...pokemon,\n      },\n    };\n  });\n// highlight-end\n")),(0,i.kt)("p",null,"Now we have a place to store data, an action to load it, and good typing at each level."),(0,i.kt)("p",null,"\u231b Create a ",(0,i.kt)("a",{parentName:"p",href:"https://feature-sliced.design/docs/reference/segments#ui"},"ui")," entity, have this component give the preview and name of the pokemon:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="entities/pokemon/ui.tsx"',title:'"entities/pokemon/ui.tsx"'},"import React from 'react';\nimport { useStoreSelector } from '@tramvai/state';\nimport { Link } from '@tramvai/module-router';\nimport { PokemonsStore } from './model';\n\nexport const PokemonPreview = ({ name }: { name: string }) => {\n  // get information about a specific pokemon\n  const pokemon = useStoreSelector(PokemonsStore, (pokemons) => pokemons[name]);\n  // in the next lesson we will add a page with detailed information about the pokemon to Pokedex\n  const pokemonUrl = `/pokemon/${pokemon.name}`;\n\n  return (\n    <div>\n      <Link url={pokemonUrl}>\n        <img\n          alt={pokemon.name}\n          src={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}\n        />\n        <p>{pokemon.name}</p>\n      </Link>\n    </div>\n  );\n};\n")),(0,i.kt)("p",null,"Our new ",(0,i.kt)("inlineCode",{parentName:"p"},"PokemonPreview")," component will only update when this particular pokemon changes in the reducer."),(0,i.kt)("p",null,"\u231b Create an entry point into the Pokemon entity:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="entities/pokemon/index.ts"',title:'"entities/pokemon/index.ts"'},"import { Module } from '@tramvai/core';\nimport { COMBINE_REDUCERS } from '@tramvai/tokens-common';\n// highlight-next-line\nimport { PokemonsStore } from './model';\n\nexport * from './model';\nexport * from './ui';\n\n@Module({\n  providers: [\n    // register reducer in the application\n    {\n      provide: COMBINE_REDUCERS,\n      multi: true,\n      // highlight-next-line\n      useValue: PokemonsStore,\n    },\n  ],\n})\n// highlight-next-line\nexport class PokemonModule {}\n")),(0,i.kt)("p",null,"\u231b Connect ",(0,i.kt)("inlineCode",{parentName:"p"},"PokemonModule")," in the application:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="index.ts"',title:'"index.ts"'},"// highlight-next-line\nimport { PokemonModule } from '~entities/pokemon';\n\ncreateApp({\n  name: 'pokedex',\n  modules: [\n    ...modules,\n    // highlight-next-line\n    PokemonModule,\n  ],\n  providers: [...providers],\n  actions: [...actions],\n  bundles: {...bundles},\n});\n")),(0,i.kt)("p",null,"Now we have the logic and interface for fetching the data and rendering it on the ",(0,i.kt)("inlineCode",{parentName:"p"},"Pokedex")," homepage ready!\nThe final touch is left, the integration of the entity into the page component."),(0,i.kt)("p",null,"\u231b Add an action to load the list of pokemon on the page:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="routes/index.tsx"',title:'"routes/index.tsx"'},"import React from 'react';\n    // highlight-next-line\nimport { fetchPokemonListAction } from '~entities/pokemon';\n\nexport const PokemonList = () => {\n  return (\n    <>\n      Hi! This is PokemonList component :)\n    </>\n  )\n}\n\n// highlight-next-line\nPokemonList.actions = [fetchPokemonListAction];\n\nexport default PokemonList;\n")),(0,i.kt)("p",null,"\u231b And render pokemon list:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="routes/index.tsx"',title:'"routes/index.tsx"'},"import React from 'react';\n// highlight-start\nimport { useStore } from '@tramvai/state';\nimport {\n  fetchPokemonListAction,\n  PokemonPreview,\n  PokemonsStore,\n} from '~entities/pokemon';\n// highlight-end\n\nexport const PokemonList = () => {\n  // highlight-start\n  const pokemons = useStore(PokemonsStore);\n  const pokemonList = Object.values(pokemons);\n\n  // If the list is empty, consider that it is still loading\n  if (pokemonList.length === 0) {\n    return <div>Loading...</div>;\n  }\n\n  return (\n    <div>\n      <ul>\n        {pokemonList.map((pokemon) => (\n          <li key={pokemon.name}>\n            <PokemonPreview name={pokemon.name} />\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n  // highlight-end\n};\n\nPokemonList.actions = [fetchPokemonListAction];\n\nexport default PokemonList;\n")),(0,i.kt)("p",null,"Don't forget to visit our Pokedex ",(0,i.kt)("a",{parentName:"p",href:"http://localhost:3000/"},"http://localhost:3000/"),"!"),(0,i.kt)("p",null,"Now you'll be greeted by ten of the cutest creatures on the page \u2764\ufe0f"),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"If the ",(0,i.kt)("inlineCode",{parentName:"p"},"UNABLE_TO_GET_ISSUER_CERT_LOCALLY")," error occurs on the server when querying ",(0,i.kt)("inlineCode",{parentName:"p"},"pokeapi"),", try running the application with the environment variable ",(0,i.kt)("inlineCode",{parentName:"p"},"NODE_TLS_REJECT_UNAUTHORIZED"),":"),(0,i.kt)("pre",{parentName:"admonition"},(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"NODE_TLS_REJECT_UNAUTHORIZED=0 tramvai start pokedex\n"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"/docs/tutorials/pokedex-app/dynamic-page"},"Next lesson"))))}k.isMDXComponent=!0}}]);