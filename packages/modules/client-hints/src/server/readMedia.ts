import pathOr from '@tinkoff/utils/object/pathOr';

import type { CONTEXT_TOKEN, COOKIE_MANAGER_TOKEN } from '@tramvai/module-common';
import { safeParseJSON } from '@tramvai/safe-strings';
import { COOKIE_NAME_MEDIA_INFO } from '../shared/constants';
import { setMedia } from '../shared/stores/media';
import { UserAgentStore } from '../shared/stores/userAgent';
import type { MediaInfo } from '../types';

const SUPPOSED_MEDIA: Record<string, MediaInfo> = {
  mobile: {
    width: 300,
    height: 500,
    isTouch: true,
    retina: false,
  },
  tablet: {
    width: 600,
    height: 800,
    isTouch: true,
    retina: false,
  },
  desktop: {
    width: 1024,
    height: 768,
    isTouch: false,
    retina: false,
  },
};

export const readMediaCommand = ({
  context,
  cookieManager,
}: {
  context: typeof CONTEXT_TOKEN;
  cookieManager: typeof COOKIE_MANAGER_TOKEN;
}) => {
  return function readMedia() {
    const mediaInfo: MediaInfo = safeParseJSON(cookieManager.get(COOKIE_NAME_MEDIA_INFO));

    if (mediaInfo) {
      return context.dispatch(
        setMedia({
          ...mediaInfo,
          supposed: false,
          synchronized: true,
        })
      );
    }

    const userAgent = context.getState(UserAgentStore);
    const deviceType = pathOr(['device', 'type'], 'desktop', userAgent);

    return context.dispatch(
      setMedia({
        ...SUPPOSED_MEDIA[deviceType],
        supposed: true,
        synchronized: false,
      })
    );
  };
};
