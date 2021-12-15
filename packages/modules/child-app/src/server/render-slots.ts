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
  logger: typeof LOGGER_TOKEN;
  diManager: ChildAppDiManager;
  resolveFullConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;
  preloadManager: ChildAppPreloadManager;
}) => {
  const log = logger('child-app:render:slots');
  return preloadManager.getPreloadedList().map((requestConfig) => {
    const config = resolveFullConfig(requestConfig);
    const di = diManager.getChildDi(config);

    if (!di) {
      return [];
    }

    const slots: typeof RENDER_SLOTS[] = [
      {
        type: ResourceType.script,
        slot: ResourceSlot.HEAD_CORE_SCRIPTS,
        payload: config.client.entry,
        attrs: {
          'data-critical': 'true',
        },
      },
    ];

    if (config.css) {
      slots.push({
        type: ResourceType.style,
        slot: ResourceSlot.HEAD_CORE_STYLES,
        payload: config.css.entry,
        attrs: {
          'data-critical': 'true',
        },
      });
    }

    try {
      const renderSlots = di.get({ token: RENDER_SLOTS, optional: true }) as typeof RENDER_SLOTS[];

      if (renderSlots) {
        slots.push(...renderSlots);
      }
    } catch (error) {
      log.error({
        event: 'get-slots-failed',
        config: requestConfig,
      });
    }

    return slots;
  });
};
