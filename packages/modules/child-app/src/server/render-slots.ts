import type { ExtractTokenType, ExtractDependencyType } from '@tinkoff/dippy';
import type {
  ChildAppDiManager,
  ChildAppPreloadManager,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
} from '@tramvai/tokens-child-app';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { RENDER_SLOTS, ResourceSlot, ResourceType } from '@tramvai/tokens-render';

export const registerChildAppRenderSlots = ({
  logger,
  diManager,
  resolveFullConfig,
  preloadManager,
}: {
  logger: ExtractDependencyType<typeof LOGGER_TOKEN>;
  diManager: ChildAppDiManager;
  resolveFullConfig: ExtractDependencyType<typeof CHILD_APP_RESOLVE_CONFIG_TOKEN>;
  preloadManager: ChildAppPreloadManager;
}) => {
  const log = logger('child-app:render:slots');
  const result: ExtractTokenType<typeof RENDER_SLOTS> = [];

  preloadManager.getPreloadedList().forEach((requestConfig) => {
    const config = resolveFullConfig(requestConfig);

    if (!config) {
      return;
    }

    const di = diManager.getChildDi(config);

    result.push({
      type: ResourceType.script,
      slot: ResourceSlot.HEAD_CORE_SCRIPTS,
      payload: config.client.entry,
      attrs: {
        'data-critical': 'true',
      },
    });

    if (config.css) {
      result.push({
        type: ResourceType.style,
        slot: ResourceSlot.HEAD_CORE_STYLES,
        payload: config.css.entry ?? null,
        attrs: {
          'data-critical': 'true',
        },
      });
    }

    if (!di) {
      return;
    }

    try {
      const renderSlots = di.get({ token: RENDER_SLOTS, optional: true }) as any[];

      if (renderSlots) {
        result.push(...renderSlots);
      }
    } catch (error) {
      log.error({
        event: 'get-slots-failed',
        config: requestConfig,
      });
    }
  });

  return result;
};
