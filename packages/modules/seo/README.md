# SEO

The module internally takes data from the page configuration, generates meta tags and adds to the page.

## Installation

You need to install `@tramvai/module-seo`

```bash
npm i @tramvai/module-seo
```

And connect to the project

```tsx
import { createApp } from '@tramvai/core';
import { SeoModule } from '@tramvai/module-seo';

createApp({
  name: 'tincoin',
  modules: [...SeoModule],
});
```

## Tramvai integration

The module does not add a public api to the DI. The seo renderer uses the `@tramvai/module-render` capabilities to insert code into the html page.

## Basic data sources

- `default` - list of basic default parameters
- `config/meta` - a list of meta parameters from the route configuration

## Connecting additional data sources

The `@tinkoff/meta-tags-generate` library allows you to connect additional data sources for meta tags with the ability to overwrite basic ones.

To do this, you need to define a multi-provider `META_UPDATER_TOKEN`.

```tsx
import { createApp, provide } from '@tramvai/core';
import { SeoModule, META_UPDATER_TOKEN, META_PRIORITY_ROUTE } from '@tramvai/module-seo';

const metaSpecial = (meta) => {
  meta.updateMeta(META_PRIORITY_ROUTE, {
    // priority - 10
    title: 'title', // key/value in meta,
    metaCustom: {
      // more information about the format [in the documentation](references/libs/meta-tags-generate.md)
      tag: 'meta',
      attributes: {
        name: 'metaCustomNameAttribute',
        content: 'metaCustomContent',
      },
    },
  });
};

createApp({
  providers: [
    provide({
      // or add via provider
      provide: META_UPDATER_TOKEN,
      multi: true,
      useValue: metaSpecial,
    }),
  ],
  modules: [
    SeoModule.forRoot({
      list: [metaSpecial],
    }),
  ],
});
```

Each source is a function that takes a meta and allows you to extend the meta through a _updateMeta_ call. The priority is a positive number, for each specific meta key the value with the highest priority will be used, the value with priority 0 denotes the default value.

More about the format [in the documentation](references/libs/meta-tags-generate.md)

## Setting seo data dynamically

If you want to install seo in a page action or in one of the commandLineRunner steps, you can explicitly use the `MetaWalk` entity from the `@tinkoff/meta-tags-generate` lib.

```tsx
import { createAction } from '@tramvai/core';
import { META_WALK_TOKEN, META_PRIORITY_APP } from '@tramvai/module-seo';

createAction({
  name: 'action',
  fn: async (context, payload, { meta }) => {
    meta.updateMeta(META_PRIORITY_APP, {
      title: 'WoW, such dynamic!',
    });
  },
  deps: {
    meta: META_WALK_TOKEN,
  },
  conditions: {
    always: true,
  },
});
```

## Replacing default seo data

The SEO module comes with a default package of seo tags. If they do not suit you, you can replace the provider's implementation and put your own data:

```tsx
import { createApp } from '@tramvai/core';
import { SeoModule, META_DEFAULT_TOKEN } from '@tramvai/module-seo';

createApp({
  providers: [
    // Change metaDefaultPack token implementation
    {
      provide: META_DEFAULT_TOKEN,
      useValue: { title: 'E Corp' },
    },
  ],
  modules: [SeoModule],
});
```

After that we will substitute the new default parameters

## Meta parameters

The library already predefines some basic parameters for convenient use when configuring routers.

And we can use meta parameters like `title: 'Tinkoff'`.

See the list of such converters in the `src/converters/converters.ts` file

## How to

### Testing

#### Testing work with META_UPDATER_TOKEN and META_DEFAULT_TOKEN

If you have a module or providers that define `META_UPDATER_TOKEN` or `META_DEFAULT_TOKEN` then it is convenient to use special utilities to test them separately

```ts
import { Module, provide } from '@tramvai/core';
import { testMetaUpdater } from '@tramvai/module-seo/tests';
import { META_PRIORITY_APP, META_DEFAULT_TOKEN, META_UPDATER_TOKEN } from '@tramvai/module-seo';

describe('testMetaUpdater', () => {
  it('modules', async () => {
    const metaUpdater = jest.fn<
      ReturnType<typeof META_UPDATER_TOKEN>,
      Parameters<typeof META_UPDATER_TOKEN>
    >((walker) => {
      walker.updateMeta(META_PRIORITY_APP, {
        title: 'test title',
      });
    });
    @Module({
      providers: [
        provide({
          provide: META_UPDATER_TOKEN,
          multi: true,
          useValue: metaUpdater,
        }),
      ],
    })
    class CustomModule {}
    const { renderMeta } = testMetaUpdater({
      modules: [CustomModule],
    });

    const { render, metaWalk } = renderMeta();

    expect(metaWalk.get('title').value).toBe('test title');
    expect(render).toMatch('<title data-meta-dynamic="true">test title</title>');
  });

  it('providers', async () => {
    const { renderMeta } = testMetaUpdater({
      providers: [
        provide({
          provide: META_DEFAULT_TOKEN,
          useValue: {
            title: 'default title',
          },
        }),
      ],
    });

    const { render } = renderMeta();

    expect(render).toMatch('<title data-meta-dynamic="true">default title</title>');
  });
});
```
