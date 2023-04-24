import { Module, provide } from '@tramvai/core';
import { META_DEFAULT_TOKEN, META_UPDATER_TOKEN } from '../../tokens';
import { testMetaUpdater } from './metaUpdater';
import { META_PRIORITY_APP } from '../../constants';

describe('testMetaUpdater', () => {
  it('should allow to test metaUpdater', async () => {
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

    expect(metaWalk.get('title')).toBe(undefined);
    expect(render).toMatch('<title data-meta-dynamic="true">test title</title>');
  });

  it('should allow to specify default meta', async () => {
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
