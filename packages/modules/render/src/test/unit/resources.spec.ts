import { commandLineListTokens, provide, Module } from '@tramvai/core';
import {
  RENDER_SLOTS,
  ResourceSlot,
  RESOURCES_REGISTRY,
  ResourceType,
} from '@tramvai/tokens-render';
import { testPageResources } from './resources';

describe('testPageResources', () => {
  it('should allow to test RENDER_SLOTS', async () => {
    const { render } = testPageResources({
      providers: [
        provide({
          provide: RENDER_SLOTS,
          multi: true,
          useValue: {
            slot: ResourceSlot.HEAD_CORE_SCRIPTS,
            type: ResourceType.inlineScript,
            payload: 'console.log("Hello, World!")',
          },
        }),
        provide({
          provide: RENDER_SLOTS,
          multi: true,
          useValue: {
            slot: ResourceSlot.HEAD_CORE_STYLES,
            type: ResourceType.style,
            payload: 'https://some-public.style/style.css',
          },
        }),
      ],
    });
    const { head } = render();

    expect(head).toMatchInlineSnapshot(`
"
<meta charset=\\"UTF-8\\">
<link rel=\\"stylesheet\\" href=\\"https://some-public.style/style.css\\">
<script>console.log(\\"Hello, World!\\")</script>
"
`);
  });

  it('should allow to fill resources through RESOURCES_REGISTRY', async () => {
    const { render, runLine } = testPageResources({
      providers: [
        provide({
          provide: commandLineListTokens.resolvePageDeps,
          multi: true,
          useFactory: ({ resourcesRegistry }) => {
            return () => {
              resourcesRegistry.register({
                slot: ResourceSlot.BODY_END,
                type: ResourceType.asIs,
                payload: '<span>I`m body!!!</span>',
              });

              resourcesRegistry.register({
                slot: ResourceSlot.BODY_START,
                type: ResourceType.script,
                payload: 'https://scripts.org/script.js',
              });
            };
          },
          deps: {
            resourcesRegistry: RESOURCES_REGISTRY,
          },
        }),
      ],
    });

    expect(render().body).toMatchInlineSnapshot(`
"
"
`);

    await runLine(commandLineListTokens.resolvePageDeps);

    expect(render().body).toMatchInlineSnapshot(`
"
<script defer=\\"defer\\" charset=\\"utf-8\\" crossorigin=\\"anonymous\\" src=\\"https://scripts.org/script.js\\"></script>
<span>I\`m body!!!</span>
"
`);
  });

  it('should allow to pass modules', async () => {
    @Module({
      providers: [
        provide({
          provide: RENDER_SLOTS,
          multi: true,
          useValue: {
            slot: ResourceSlot.HEAD_CORE_STYLES,
            type: ResourceType.inlineScript,
            payload: 'console.log("from module!")',
          },
        }),
      ],
    })
    class CustomModule {}

    const { render } = testPageResources({
      modules: [CustomModule],
    });
    const { head } = render();

    expect(head).toMatchInlineSnapshot(`
"
<meta charset=\\"UTF-8\\">
<script>console.log(\\"from module!\\")</script>
"
`);
  });
});
