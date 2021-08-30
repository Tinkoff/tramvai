import React from 'react';
import { createApp, createBundle, commandLineListTokens } from '@tramvai/core';
import {
  RENDER_SLOTS,
  RESOURCES_REGISTRY,
  ResourceType,
  ResourceSlot,
} from '@tramvai/module-render';
import { modules } from '../common';

function Page() {
  return <div>Render</div>;
}

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
  },
});

createApp({
  name: 'render-add-resources',
  modules: [...modules],
  providers: [
    {
      // Если требуется добавить свои ресурсы (скрипты, стили, картинки) для загрузки, то можно использовать
      // провайдер RENDER_SLOTS для добавления необходимого, все это потом будет использовано в RenderModule
      // и вставлено в html
      provide: RENDER_SLOTS,
      multi: true,
      useValue: [
        {
          type: ResourceType.inlineScript, // inlineScript обернет payload в тег <script>
          slot: ResourceSlot.HEAD_CORE_SCRIPTS, // определяет позицию где в html будет вставлен ресурс
          payload: 'alert("render")',
        },
        {
          type: ResourceType.asIs, // asIs занчит вставить ресурс как есть. без обработки
          slot: ResourceSlot.BODY_TAIL,
          payload: '<div>hello from render slots</div>',
        },
      ],
    },
    {
      provide: commandLineListTokens.resolveUserDeps,
      multi: true,
      // также ресурсы можно добавить отдельно через di и токен RESOURCES_REGISTRY
      useFactory: ({ resourcesRegistry }) => {
        return function addMyScripts() {
          resourcesRegistry.register({
            slot: ResourceSlot.HEAD_ANALYTICS, // место вставки
            type: ResourceType.script, // script создаст новый тег скрипт с src равном payload
            payload: './some-script.js',
          });
        };
      },
      deps: {
        resourcesRegistry: RESOURCES_REGISTRY,
      },
    },
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
