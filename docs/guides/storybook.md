---
id: storybook
title: Storybook integration
---

## Introduction

`tramvai` provides addon with deep Storybook integration - [@tramvai/storybook-addon](references/tramvai/storybook-addon.md).
This integration includes build configuration as close as possible to the real `tramvai` behaviour and supports for all `tramvai` specific React providers.

:::note

This guide is based on an application generated through `tramvai new {{appName}}`, the integration in each case may be slightly different.

:::

## Adding Storybook

:::info

Storybook has many dependencies that may conflict with the `@tramvai/cli` dependencies, **so we strongly recommend to install Storybook at the different folder in your repositiry**.

:::

:hourglass: Create a new directory for Storybook:

```bash
mkdir storybook && cd storybook
```

:hourglass: Initialize Storybook inside this directory (with `webpack5` builder):

```bash
npx sb init --type webpack_react --builder webpack5
```

:hourglass: Install `postcss` inside this directory (required package):

```bash
npm install --save-dev postcss
```

## @tramvai/storybook-addon installation

:::info

The components in the application and the Storybook must have the same React context.
For this reason, we must **not have** `tramvai` dependencies duplicates.
To prevent problems with duplicates, `@tramvai/storybook-addon` should be installed in the root of the project, not in the `storybook` folder.
When running, Storybook will still find the addon because of the module resolution algorithm in NodeJS.

:::

:hourglass: Back to the root folder:

```bash
cd ../
```

:hourglass: Install `@tramvai/storybook-addon`:

```bash npm2yarn
npm install @tramvai/storybook-addon
```

:hourglass: connect addon in the configuration file:

```js title="storybook/.storybook/main.js"
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    // highlight-next-line
    "@tramvai/storybook-addon"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  }
}
```

## Page story creation

:hourglass: Create story for main page:

```tsx title="storybook/stories/pages/main.stories.tsx"
import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';
import Main from '../../../src/routes/index';

const parameters: TramvaiStoriesParameters = {};

export default {
  title: 'Pages/Main',
  component: Main,
  parameters,
};

export const MainPage = () => <Main />;
```

:hourglass: Run Storybook:

```bash
cd storybook && npm run storybook
```

And you can see a Main page story at `http://localhost:6006/?path=/story/pages-main--main-page`:

![Main page story](/img/guides/storybook/storybook-1.png)

You can find more examples in [@tramvai/storybook-addon documentation](references/tramvai/storybook-addon.md#how-to).
