# Polyfills

Tramvai has polyfills integration:

- there is a separate library `@tinkoff/pack-polyfills` that contains all the necessary polyfills
- `@tramvai/cli` build polyfills in a separate file
- `@tramvai/module-render` contains code that only loads polyfills where they are needed

## Setup

#### Install polyfills pack

```bash
npm i --save @tinkoff/pack-polyfills
```

#### Create a file polyfill.ts

You need to create a file `polyfill.ts` inside your project, for example `src/polyfill.ts` and connect the polyfills inside:

```tsx
import '@tinkoff/pack-polyfills';
```

#### Set up @tramvai/cli

After that, we need to tell `@tramvai/cli` that our project has polyfills. To do this, in `tramvai.json` we add for our project the line `"polyfill: "src/polyfill.ts"` in `projects[APP_ID].commands.build.options.polyfill` example:

```json
{
  "projects": {
    "pfphome": {
      "name": "pfphome",
      "root": "src",
      "type": "application",
      "commands": {
        "build": {
          "options": {
            "server": "src/index.ts",
            "polyfill": "src/polyfill.ts"
          }
        }
      }
    }
  }
}
```

## How polyfills loading works

On the `@tramvai/cli` side, we have configured to build the polyfills into a separate file, so it doesn't mix with the main code. On every build we will have a file with polyfills.

[module-render](references/modules/render.md) if it finds polyfills in the build, then for each client embeds inline code that checks the availability of features in the browser and if the browser does not support any of the features, then we consider the browser is legacy and load polyfills. An example of a check: `!window.Promise.prototype.finally || !window.URL || !window.URLSearchParams || !window.AbortController || !window.IntersectionObserver || !Object.fromEntries'`

## Replacing the polyfills loading check

### Why would it be necessary?

If you do not fit the standard check for supported features in the browser and polyfills do not load in browsers where they should. In this case, it is better to create issue and we will update the check, or you can replace the check with another.

### Important tips

- `POLYFILL_CONDITION` should return true if the browser does not support some features
- You should not load polyfiles into all browsers
- It is better to extend `DEFAULT_POLYFILL_CONDITION` with additional checks, rather than replacing it

## Replacing the check

To do this, we need to set provider `POLYFILL_CONDITION`, which is in `import { POLYFILL_CONDITION } from '@tramvai/module-render'` and pass a new line.

Example: This is a synthetic example, but suppose we want to additionally check for the presence of window.Promise in the browser, to do this we extend `DEFAULT_POLYFILL_CONDITION` string. The resulting expression should return true if the browsers do not support the feature.

```tsx
import { POLYFILL_CONDITION, DEFAULT_POLYFILL_CONDITION } from '@tramvai/module-render';
import { provide } from '@tramvai/core';

const provider = provide({
  provide: POLYFILL_CONDITION,
  useValue: `${DEFAULT_POLYFILL_CONDITION} || !window.Promise`,
});
```
