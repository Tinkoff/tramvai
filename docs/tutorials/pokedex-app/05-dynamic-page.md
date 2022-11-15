---
id: dynamic-page
title: Page with dynamic parameters
---

In this tutorial, we will create a page with detailed information about the pokemon, available at the url `/pokemon/:name`.
The `pokeapi` gives us information about the pokemon's elements, and its basic parameters, and we will try to display this information.
To create a url with dynamic parameters, the dynamic part of the path to the page component must be in square brackets, e.g. for the url `/pokemon/:name` you have to create a component at the path `routes/pokemon/[name]/index.tsx`.

:hourglass: Create empty page component:

```tsx title="routes/pokemon/[name]/index.tsx"
import React from 'react';

export const PokemonView = () => {
  return <>Hi! This is PokemonView component :)</>;
};

export default PokemonView;
```

After that, you can click on any of the pokemon on the homepage `http://localhost:3000/` and after going to `http://localhost:3000/pokemon/bulbasaur/` you will see the `PokemonView` component.

It's time to download more pokemon information!
The service `PAGE_SERVICE_TOKEN` will be used to get the dynamic parameters of the current route.

:hourglass: Add a new action to the pokemon entity to load data using dynamic parameters from the route:

```tsx title="entities/pokemon/model.ts"
// highlight-next-line
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

export const fetchPokemonAction = declareAction({
  name: 'fetchPokemon',
  async fn() {
    // access to the `:name` parameter of the current route via PAGE_SERVICE_TOKEN
    // highlight-next-line
    const { name } = this.deps.pageService.getCurrentRoute().params;

    // loading information about the pokemon
    const pokemonResponse = await this.deps.pokeapiHttpClient.get<Pokemon>(`/pokemon/${name}`);

    // save information about the pokemon in the store
    this.dispatch(pokemonLoadedEvent(pokemonResponse.payload));
  },
  deps: {
    pokeapiHttpClient: POKEAPI_HTTP_CLIENT,
    // highlight-next-line
    pageService: PAGE_SERVICE_TOKEN,
  },
  conditions: {
    // disable caching of the action, since it must be executed again for different name values
    always: true,
  },
});
```

:::tip

You can read more about the need to add an `always` condition to an action that depends on page parameters in [Action documentation](concepts/action.md#peculiarities)

:::

:hourglass: Connect action to a page:

```tsx title="pages/pokemon/index.tsx"
import React from 'react';
// highlight-next-line
import { fetchPokemonAction } from '~entities/pokemon';

export const PokemonView = () => {
  return <>Hi! This is PokemonView component :)</>;
};

// highlight-next-line
PokemonView.actions = [fetchPokemonAction];

export default PokemonView;
```

Before render Pokemon data, it is worth extending our `Pokemon` interface.

:hourglass: Complete the `Pokemon` interface:

```tsx title="entities/pokemon/model.ts"
export type Pokemon = {
  id: number;
  name: string;
  // highlight-start
  stats: PokemonStat[];
  types: PokemonType[];
// highlight-end
};

// highlight-start
export type PokemonStat = {
  // characteristic value
  base_stat: number;
  // characteristic name
  stat: { name: string };
};
// highlight-end

// highlight-start
export type PokemonType = {
  // element type
  type: { name: string };
};
// highlight-end
```

To get `PAGE_SERVICE_TOKEN` from the DI in the component, we'll use the `useDi` hook.

:hourglass: Add code to get information about the pokemon in `PokemonView`:

```tsx title="pages/pokemon/index.tsx"
import React from 'react';
// highlight-start
import { useStoreSelector } from '@tramvai/state';
import { useRoute } from '@tinkoff/router';
// highlight-end
import { fetchPokemonAction } from '~entities/pokemon';

export const PokemonView = () => {
  // highlight-start
  // access to the `:name` parameter of the current route via `useRoute` hook
  const { name } = useRoute().params;
  // get information about a specific pokemon
  const pokemon = useStoreSelector(PokemonsStore, (pokemons) => pokemons[name]);
  // highlight-end

  return <>Hi! This is PokemonView component :)</>;
}

PokemonView.actions = [fetchPokemonAction];

export default PokemonView;
```

:hourglass: And render all the data on the page:

```tsx title="pages/pokemon/index.tsx"
import React from 'react';
import { useStoreSelector } from '@tramvai/state';
// highlight-next-line
import { Link } from '@tramvai/module-router';
import { useRoute } from '@tinkoff/router';
// highlight-next-line
import type { Pokemon, PokemonStat } from '~entities/pokemon';
import { fetchPokemonAction, PokemonsStore } from '~entities/pokemon';

// highlight-start
// utility to search for characteristics, will allow us to draw only some
const findStatByName = (
  pokemon: Pokemon,
  statKey: string
): PokemonStat | undefined => {
  return pokemon.stats.find((stat) => statKey === stat.stat.name);
};
// highlight-end

export const PokemonView = () => {
  const { name } = useRoute().params;
  const pokemon = useStoreSelector(PokemonsStore, (pokemons) => pokemons[name]);

  // highlight-start
  // If there is no information about the pokemon, consider it to be loading
  if (!pokemon) {
    return <div>Loading...</div>;
  }

  const hpStat = findStatByName(pokemon, 'hp');
  const attackStat = findStatByName(pokemon, 'attack');
  const defenseStat = findStatByName(pokemon, 'defense');
  const speedStat = findStatByName(pokemon, 'speed');

  return (
    <div>
      <div>
        <Link url="/">Return to list</Link>
      </div>
      <img
        alt={pokemon.name}
        width={200}
        height={200}
        src={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
      />
      <h2>{pokemon.name}</h2>
      <div>
        <p>Stats</p>
        <ul>
          {hpStat && <li>HP: {hpStat.base_stat}</li>}
          {attackStat && <li>Attack: {attackStat.base_stat}</li>}
          {defenseStat && <li>Defense: {defenseStat.base_stat}</li>}
          {speedStat && <li>Speed: {speedStat.base_stat}</li>}
        </ul>
      </div>
      <div>
        <p>Types</p>
        <ul>
          {pokemon.types.map((type) => {
            const typeKey = type.type.name;
            return (
              <li key={typeKey} data-type={typeKey}> {typeKey} </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
  // highlight-end
}

PokemonView.actions = [fetchPokemonAction];

export default PokemonView;
```

Done!

Now you can go to the `http://localhost:3000/pokemon/bulbasaur/` page, where you will find detailed information about this wonderful creature :)

**[Next lesson](tutorials/pokedex-app/06-styling.md)**
