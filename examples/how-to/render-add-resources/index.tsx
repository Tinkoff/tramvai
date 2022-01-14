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
      // If you want to add your own resources (scripts, styles, images) for loading,
      // you can use the provider RENDER_SLOTS to add the necessary assets,
      // all this will then be used in the RenderModule and inserted into HTML
      provide: RENDER_SLOTS,
      multi: true,
      useValue: [
        {
          type: ResourceType.inlineScript, // inlineScript wrap payload in tag <script>
          slot: ResourceSlot.HEAD_CORE_SCRIPTS, // define position where in HTML will be included resource
          payload: 'alert("render")',
        },
        {
          type: ResourceType.asIs, // asIs just add payload as a string, without special processing
          slot: ResourceSlot.BODY_TAIL,
          payload: '<div>hello from render slots</div>',
        },
      ],
    },
    {
      provide: commandLineListTokens.resolveUserDeps,
      multi: true,
      // You can also add resources separately via DI and the RESOURCES_REGISTRY token
      useFactory: ({ resourcesRegistry }) => {
        return function addMyScripts() {
          resourcesRegistry.register({
            type: ResourceType.script, // script will create new script tag with src equal to payload
            slot: ResourceSlot.HEAD_ANALYTICS, // define position where in HTML will be included resource
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
