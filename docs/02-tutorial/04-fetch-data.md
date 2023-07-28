---
id: fetch-data
title: Fetch data
---

In this lesson we will learn how to fetch data to the pages of our application by using the new HTTP client.

[Actions](concepts/action.md) - the core mechanism for loading data in `tramvai` applications.
You can add any number of actions at the level of the whole application, bundle and specific page.
When loading a page, all these actions will be executed in **parallel**.
Actions that won't be executed in **500ms** on the server will be automatically executed on the client.
Thanks to this, the minimal possible response time from the server is achieved.

:::info

The limit of **500ms** is set in the `ActionModule`, and we do not recommend increasing this number.
But if long responses from your API are the expected behavior, you can overwrite this value via the `limitActionGlobalTimeRun` string token.

:::

The data from the actions are not passed to the page component `props`.
The standard pattern for loading data is to create a special [reducer](03-features/08-state-management.md#reducer) to store the data, and dispatch [events](03-features/08-state-management.md#event) to fill that reducer in the action.

:::tip

The following code is very similar to boilerplate code with `redux` and `redux-thunk`.
If you don't need to save data in global store, you can use integration with [react-query](references/modules/react-query.md) instead of actions and reducers.
This will drastically reduce the amount of code, but also make our application less flexible.

:::

The main page of our `Pokedex` is the pokemon list, so we will work with the `Pokemon` entity, following the feature-sliced methodology.
Let's add a new [entity](https://feature-sliced.design/docs/reference/layers/entities) `entities/couter` to our application.

:hourglass: First, create a folder called `entities/pokemon`.

:hourglass: Next, create a [model](https://feature-sliced.design/docs/reference/segments#model) of our new entity with basic interfaces:

```tsx title="entities/pokemon/model.ts"
// highlight-start
// here we will gradually describe the interface that the API returns to us
export type Pokemon = {
  id: number;
  name: string;
};

// our reducer state interface
export type PokemonsState = Record<string, Pokemon>;

const initialState: PokemonsState = {};

// highlight-end
```

:hourglass: Add events to update the reducer:

```tsx title="entities/pokemon/model.ts"
// highlight-next-line
import { createEvent } from '@tramvai/state';

export type Pokemon = {
  id: number;
  name: string;
};

export type PokemonsState = Record<string, Pokemon>;
const initialState: PokemonsState = {};

// highlight-start
// event of successful download of the pokemon list
export const pokemonListLoadedEvent = createEvent<Pokemon[]>('pokemonListLoaded');
// event of a successful download of information about a particular pokemon
export const pokemonLoadedEvent = createEvent<Pokemon>('pokemonLoaded');
// highlight-end
```

:hourglass: Then add an action to fetch the data, using our new HTTP client:

```tsx title="entities/pokemon/model.ts"
import { createEvent } from '@tramvai/state';
// highlight-start
import { declareAction } from '@tramvai/core';
import { POKEAPI_HTTP_CLIENT } from '~shared/api';
// highlight-end

export type Pokemon = {
  name: string;
};

export type PokemonsState = Record<string, Pokemon>;
const initialState: PokemonsState = {};

export const pokemonListLoadedEvent = createEvent<Pokemon[]>('pokemonListLoaded');
export const pokemonLoadedEvent = createEvent<Pokemon>('pokemonLoaded');

// highlight-start
export const fetchPokemonListAction = declareAction({
  name: 'fetchPokemonList',
  async fn() {
    const limit = 10;
    const offset = 0;

    // upload a list of the names of the first 10 pokemon https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0
    const pokemonsNamesResponse = await this.deps.pokeapiHttpClient.get<{ results: { name: string }[] }>(
      '/pokemon',
      { query: { limit, offset } }
    );
    const pokemonsNames = pokemonsNamesResponse.payload.results;

    // download detailed information about each pokemon in parallel https://pokeapi.co/api/v2/pokemon/bulbasaur/
    const pokemonList = await Promise.all(
      pokemonsNames.map(async ({ name }) => {
        const pokemonResponse = await this.deps.pokeapiHttpClient.get<Pokemon>(`/pokemon/${name}`);
        return pokemonResponse.payload;
      })
    );

    // save the final list to the reducer
    this.dispatch(pokemonListLoadedEvent(pokemonList));
  },
  deps: {
    pokeapiHttpClient: POKEAPI_HTTP_CLIENT,
  },
});
// highlight-end
```

:hourglass: And describe the reducer itself:

```tsx title="entities/pokemon/model.ts"
// highlight-next-line
import { createEvent, createReducer } from '@tramvai/state';
import { declareAction } from '@tramvai/core';

export type Pokemon = {
  id: number;
  name: string;
};

export type PokemonsState = Record<string, Pokemon>;

const initialState: PokemonsState = {};

export const pokemonListLoadedEvent = createEvent<Pokemon[]>('pokemonListLoaded');
export const pokemonLoadedEvent = createEvent<Pokemon>('pokemonLoaded');

export const fetchPokemonListAction = declareAction({
  name: 'fetchPokemonList',
  async fn() {
    const limit = 10;
    const offset = 0;

    const pokemonsNamesResponse = await this.deps.pokeapiHttpClient.get<{ results: { name: string }[] }>(
      '/pokemon',
      { query: { limit, offset } }
    );
    const pokemonsNames = pokemonsNamesResponse.payload.results;

    const pokemonList = await Promise.all(
      pokemonsNames.map(async ({ name }) => {
        const pokemonResponse = await this.deps.pokeapiHttpClient.get<Pokemon>(`/pokemon/${name}`);
        return pokemonResponse.payload;
      })
    );

    this.dispatch(pokemonListLoadedEvent(pokemonList));
  },
  deps: {
    pokeapiHttpClient: POKEAPI_HTTP_CLIENT,
  },
});

// highlight-start
export const PokemonsStore = createReducer('pokemons', initialState)
  .on(pokemonListLoadedEvent, (state, pokemonList) => {
    return pokemonList.reduce((nextState, pokemon) => {
      return {
        ...nextState,
        [pokemon.name]: {
          ...nextState[pokemon.name],
          ...pokemon,
        },
      };
    }, state);
  })
  .on(pokemonLoadedEvent, (state, pokemon) => {
    return {
      ...state,
      [pokemon.name]: {
        ...state[pokemon.name],
        ...pokemon,
      },
    };
  });
// highlight-end
```

Now we have a place to store data, an action to load it, and good typing at each level.

:hourglass: Create a [ui](https://feature-sliced.design/docs/reference/segments#ui) entity, have this component give the preview and name of the pokemon:

```tsx title="entities/pokemon/ui.tsx"
import React from 'react';
import { useStoreSelector } from '@tramvai/state';
import { Link } from '@tramvai/module-router';
import { PokemonsStore } from './model';

export const PokemonPreview = ({ name }: { name: string }) => {
  // get information about a specific pokemon
  const pokemon = useStoreSelector(PokemonsStore, (pokemons) => pokemons[name]);
  // in the next lesson we will add a page with detailed information about the pokemon to Pokedex
  const pokemonUrl = `/pokemon/${pokemon.name}`;

  return (
    <div>
      <Link url={pokemonUrl}>
        <img
          alt={pokemon.name}
          src={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
        />
        <p>{pokemon.name}</p>
      </Link>
    </div>
  );
};
```

Our new `PokemonPreview` component will only update when this particular pokemon changes in the reducer.

:hourglass: Create an entry point into the Pokemon entity:

```tsx title="entities/pokemon/index.ts"
import { Module, provide } from '@tramvai/core';
import { COMBINE_REDUCERS } from '@tramvai/tokens-common';
// highlight-next-line
import { PokemonsStore } from './model';

export * from './model';
export * from './ui';

@Module({
  providers: [
    // register reducer in the application
    provide({
      provide: COMBINE_REDUCERS,
      multi: true,
      // highlight-next-line
      useValue: PokemonsStore,
    }),
  ],
})
// highlight-next-line
export class PokemonModule {}
```

:hourglass: Connect `PokemonModule` in the application:

```tsx title="index.ts"
// highlight-next-line
import { PokemonModule } from '~entities/pokemon';

createApp({
  name: 'pokedex',
  modules: [
    ...modules,
    // highlight-next-line
    PokemonModule,
  ],
  providers: [...providers],
  actions: [...actions],
  bundles: {...bundles},
});
```

Now we have the logic and interface for fetching the data and rendering it on the `Pokedex` homepage ready!
The final touch is left, the integration of the entity into the page component.

:hourglass: Add an action to load the list of pokemon on the page:

```tsx title="routes/index.tsx"
import React from 'react';
    // highlight-next-line
import { fetchPokemonListAction } from '~entities/pokemon';

export const PokemonList = () => {
  return (
    <>
      Hi! This is PokemonList component :)
    </>
  )
}

// highlight-next-line
PokemonList.actions = [fetchPokemonListAction];

export default PokemonList;
```

:hourglass: And render pokemon list:

```tsx title="routes/index.tsx"
import React from 'react';
// highlight-start
import { useStore } from '@tramvai/state';
import {
  fetchPokemonListAction,
  PokemonPreview,
  PokemonsStore,
} from '~entities/pokemon';
// highlight-end

export const PokemonList = () => {
  // highlight-start
  const pokemons = useStore(PokemonsStore);
  const pokemonList = Object.values(pokemons);

  // If the list is empty, consider that it is still loading
  if (pokemonList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.name}>
            <PokemonPreview name={pokemon.name} />
          </li>
        ))}
      </ul>
    </div>
  );
  // highlight-end
};

PokemonList.actions = [fetchPokemonListAction];

export default PokemonList;
```

Don't forget to visit our Pokedex [http://localhost:3000/](http://localhost:3000/)!

Now you'll be greeted by ten of the cutest creatures on the page :heart:

:::caution

If the `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` error occurs on the server when querying `pokeapi`, try running the application with the environment variable `NODE_TLS_REJECT_UNAUTHORIZED`:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 tramvai start pokedex
```

:::

**[Next lesson](02-tutorial/05-dynamic-page.md)**
