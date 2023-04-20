---
id: styling
title: Styling
---

For styling, we recommend using `CSS Modules` and `CSS variables` (powered by `postcss`).
In this tutorial, we'll update the Header and decorate our `Pokedex` pages a bit.

For the `Header` component, replace the header with **Pokedex** and add a pokeball image.

:hourglass: Update the `Header` component:

```tsx title="shared/header/Header.tsx"
import React from 'react';

export const Header = () => (
  <div className={styles.Header}>
    <img
      alt="pokeball"
      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
      width={25}
      height={25}
    />
    <h1>
      Pokedex
    </h1>
  </div>
);
```

Let's work with CSS Modules on the example of our `Header` component.

:hourglass: Add styles to the header:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="css" label="Header.module.css" default>

```css title="shared/header/Header.module.css"
.Header {
  display: flex;
  align-items: center;
}

.Header img {
  margin-right: 5px;
}
```

  </TabItem>
  <TabItem value="js" label="Header.tsx">

```tsx title="shared/header/Header.tsx"
import React from 'react';
// highlight-next-line
import styles from './Header.module.css';

export const Header = () => (
  // highlight-next-line
  <div className={styles.Header}>
    <img
      alt="pokeball"
      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
      width={25}
      height={25}
    />
    <h1>
      Pokedex
    </h1>
  </div>
);
```

  </TabItem>
</Tabs>

Let's try to change the fonts in our application.
You can add new resources to the pages of the application through the `RENDER_SLOTS` token, alternative ways and examples can be found in the [module render](references/modules/render.md) documentation.

:hourglass: Connect Lato from Google Fonts in the `createApp` providers:

```tsx title="index.ts"
import {
  RENDER_SLOTS,
  ResourceType,
  ResourceSlot,
} from '@tramvai/tokens-render';

createApp({
  name: 'pokedex',
  modules: [...modules],
  providers: [
    ...providers,
    // highlight-start
    {
      provide: RENDER_SLOTS,
      multi: true,
      useValue: {
        type: ResourceType.style,
        slot: ResourceSlot.HEAD_CORE_STYLES,
        payload: 'https://fonts.googleapis.com/css2?family=Lato&display=swap',
      }
    },
    // highlight-end
  ],
  actions: [...actions],
  bundles: {...bundles},
});
```

:hourglass: And replace the fonts with `Lato` by connecting a new CSS at the entry point of the application:

<Tabs>
  <TabItem value="css" label="global.module.css" default>

```css title="global.module.css"
html {
  font-family: 'Lato', sans-serif;
}
```

  </TabItem>
  <TabItem value="js" label="index.ts">

```tsx title="index.tsx"
// connect CSS at the beginning of the file, before any other imports
// highlight-next-line
import './global.module.css';

createApp({
  name: 'pokedex',
  modules: [...modules],
  providers: [...providers],
  actions: [...actions],
  bundles: {...bundles},
});
```

  </TabItem>
</Tabs>

:::tip

For more efficient font loading and no layout shifting after downloading the required font, we recommend keeping these fonts in the application itself, and adding `preload` tags for the main fonts, for example:

  ```tsx
  const provider = {
    provide: RENDER_SLOTS,
    multi: true,
    useValue: {
      type: ResourceType.preloadLink,
      slot: ResourceSlot.HEAD_CORE_SCRIPTS,
      payload: 'https://fonts.gstatic.com/s/lato/v20/S6uyw4BMUTPHjx4wXiWtFCc.woff2',
      attrs: {
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    },
  };
  ```

:::

It remains to add CSS variables, for demonstration we will add a variable with the primary color for headers, and use it in the header.

:hourglass: Add a CSS variable to the main stylesheet:

```css title="global.module.css"
// highlight-start
:root {
  --color-header: hsl(215deg 85% 35%);
}
// highlight-end

html {
  font-family: 'Lato', sans-serif;
}

```

:hourglass: Use a new variable in `Header.module.css`:

```css title="shared/header/Header.module.css"
.Header {
  display: flex;
  align-items: center;
}

.Header img {
  margin-right: 5px;
}

// highlight-start
.Header h1 {
  color: var(--color-header);
}
// highlight-end
```

By default, tramvai has [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties) plugin, which can do fallback for CSS variables.
Unfortunately, `postcss-loader` + `css-loader` process the files one by one, and in our example the plugin will just cut variables from `global.module.css` as not used. This behavior can be changed with option `preserve: true`, but in this case the plugin will not perform its main functions.

An alternative option - add global variables directly to the plugin, through the property `importFrom`, where you can pass a js or css file with a list of variables.

:::tip

An alternative for CSS variables is to use a variable syntax created specifically for CSS Modules, [documentation](https://github.com/css-modules/css-modules/blob/master/docs/values-variables.md).
But such variables are completely static.

:::


:hourglass: Update the `postcss-custom-properties` plugin settings in `postcss.js`:

```js title="postcss.js"
module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-modules-values-replace'),
    require('postcss-custom-properties')({
      // force the plugin to keep variables that it thinks are not used
      // highlight-next-line
      preserve: true,
    }),
    require('postcss-import'),
    require('postcss-custom-media')({
      preserve: false,
    }),
  ],
};

```

After refreshing the page, we will see the dark blue header `Pokedex'!

### Conclusion

That's all for now!

We learned how to create a new `tramvai` application, work with `depencency injection`, routing and global state, load data and style the application.

You can familiarize yourself with framework features like [API routing](03-features/016-papi.md), try integration with [react-query](references/modules/react-query.md), integrate our awesome test utilities for [unit](references/tramvai/test/unit.md) and [e2e](references/tramvai/test/integration.md) testing into the application.
