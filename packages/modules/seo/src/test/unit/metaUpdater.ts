import flatten from '@tinkoff/utils/array/flatten';
import { provide } from '@tramvai/core';
import { getDiWrapper } from '@tramvai/test-helpers';
import { Meta, MetaWalk, Render } from '@tinkoff/meta-tags-generate';
import { META_DEFAULT_TOKEN, META_UPDATER_TOKEN, META_WALK_TOKEN } from '../../tokens';
import { transformValue } from '../../transformValue';
import { converters } from '../../converters/converters';
import { defaultPack, metaDefaultPack } from '../../metaDefaultPack';

type Options = Parameters<typeof getDiWrapper>[0];

export const testMetaUpdater = (options: Options) => {
  const { modules, providers = [] } = options;
  const { di } = getDiWrapper({
    di: options.di,
    modules,
    providers: [
      {
        provide: META_DEFAULT_TOKEN,
        useValue: defaultPack,
      },
      {
        provide: META_UPDATER_TOKEN,
        multi: true,
        useFactory: ({ defaultMeta }) => metaDefaultPack(defaultMeta),
        deps: {
          defaultMeta: META_DEFAULT_TOKEN,
        },
      },
      ...providers,
      provide({
        provide: META_WALK_TOKEN,
        useClass: MetaWalk,
      }),
    ],
  });

  return {
    di,
    renderMeta: () => {
      const metaWalk = di.get(META_WALK_TOKEN);
      const metaUpdaters = di.get({ token: META_UPDATER_TOKEN, multi: true });
      const meta = new Meta({
        list: flatten(metaUpdaters || []),
        transformValue,
        converters,
        metaWalk,
      });
      const render = new Render(meta).render();

      return {
        metaWalk,
        render,
      };
    },
  };
};
