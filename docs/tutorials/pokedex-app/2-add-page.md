---
id: add-page
title: Add new page
---

`tramvai` supports file-system based routing.
Detailed documentation is available in [File-System Pages](features/file-system-pages.md) section.

In this tutorial we will use the automatic way of generating new routes in the application, for which you only need to create a `react` page component, following the naming conventions.

:::info

In addition to automatic routes generation, there are several more flexible options for adding pages to the application, but requiring more manual work.
In this tutorial we use the simplest and most convenient option.

:::

Let's take a more detailed look at routing, taking the main page of our `Pokedex` - the page with the list of pokemon - as an example.

The page available on the url `http://localhost:3000/` is located in the component `routes/index.tsx`.
By default, all `react` components in the `routes` folder are interpreted as application routes, and a `/` route will be generated based on the component named `routes/index.tsx`.

:hourglass: Replace the contents of the home page component:

```tsx {11} title="routes/index.tsx"
import React from 'react';

export const PokemonList = () => {
  return <>Hi! This is PokemonList component :)</>;
};

export default PokemonList;
```

:::info

You need to use default export to be able to extract the page component into a separate chunk, and load it by demand

:::

Module [@tramvai/module-router](references/modules/router.md) is responsible for routing and automatically adding file-system based routes to the application.

Our `PokemonList` page is now registered in the app, and it will be automatically rendered on the `/` route, and available on `http://localhost:3000/`!

**[Next lesson](tutorials/pokedex-app/3-create-http-client.md)**
