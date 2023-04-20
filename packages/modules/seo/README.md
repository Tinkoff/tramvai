# @tramvai/module-seo

The module internally takes data from the page configuration, generates meta tags and adds to the page.

`@tinkoff/meta-tags-generate` library is used under the hood.

Link to complete SEO and Meta documentation - https://tramvai.dev/docs/features/seo/

## Installation

You need to install `@tramvai/module-seo`:

```bash
npx tramvai add @tramvai/module-seo
```

And connect in the project:

```tsx
import { createApp } from '@tramvai/core';
import { SeoModule } from '@tramvai/module-seo';

createApp({
  name: 'tincoin',
  modules: [SeoModule],
});
```
