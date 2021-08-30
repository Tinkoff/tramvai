import flatten from '@tinkoff/utils/array/flatten';
import isArray from '@tinkoff/utils/is/array';
import debounce from '@tinkoff/utils/function/debounce';
import { Module, commandLineListTokens, provide } from '@tramvai/core';
import { Meta, Update } from '@tinkoff/meta-tags-generate';
import { transformValue } from './transformValue';
import { sharedProviders } from './shared';
import { converters } from './converters/converters';
import { META_UPDATER_TOKEN, META_WALK_TOKEN, META_DEFAULT_TOKEN } from './tokens';
import type { SeoModuleOptions } from './types';

export * from './constants';
export * from './tokens';

@Module({
  providers: [
    ...sharedProviders,
    provide({
      provide: commandLineListTokens.spaTransition,
      multi: true,
      useFactory: ({ metaWalk, metaUpdaters }) => {
        const meta = new Meta({
          list: flatten(metaUpdaters || []),
          transformValue,
          converters,
          metaWalk,
        });

        let ignore = false;

        const update = () => {
          ignore = true;
          new Update(meta).update();
          ignore = false;
        };
        const debounced = debounce(500, update);

        // TODO: костыль для MetaWalk, чтобы можно было обновлять мету в экшенах
        // надо сделать нормально на уровне самой меты или типо того
        metaWalk.subscribe(
          // если произошло изменение в metaWalk мы должны отреагировать на него
          // и обновить мету на странице
          () => {
            if (!ignore) {
              debounced();
            }
          }
        );

        return function updateMeta() {
          metaWalk.reset();
          update();
        };
      },
      deps: {
        metaWalk: META_WALK_TOKEN,
        metaUpdaters: { token: META_UPDATER_TOKEN, optional: true as const, multi: true as const },
      },
    }),
  ],
})
export class SeoModule {
  static forRoot(options: SeoModuleOptions) {
    // легаси ветка для старого формата
    // TODO: убрать
    if (isArray(options)) {
      return {
        mainModule: SeoModule,
        providers: [
          {
            provide: 'metaList',
            useValue: options,
            multi: true,
          },
        ],
      };
    }

    const { metaUpdaters, metaDefault } = options;
    const providers = [];

    if (metaDefault) {
      providers.push({
        provide: META_DEFAULT_TOKEN,
        useValue: metaDefault,
      });
    }

    if (metaUpdaters) {
      providers.push({
        provide: META_UPDATER_TOKEN,
        useValue: metaUpdaters,
        multi: true,
      });
    }

    return {
      providers,
      mainModule: SeoModule,
    };
  }
}
