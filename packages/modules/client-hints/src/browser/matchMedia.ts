import debounce from '@tinkoff/utils/function/debounce';
import type { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import type { COOKIE_MANAGER_TOKEN } from '@tramvai/tokens-cookie';
import type { MediaInfo } from '../types';
import { setMedia } from '../shared/stores/media';
import { COOKIE_NAME_MEDIA_INFO } from '../shared/constants';
import { mediaBreakpoints } from '../shared/mediaBreakpoints';

declare global {
  interface Window {
    DocumentTouch?: any;
  }
}

const isTouch = !!(
  'ontouchstart' in window ||
  (window.DocumentTouch && document instanceof window.DocumentTouch)
);

const getMediaInfo = (): MediaInfo => ({
  width: window.innerWidth,
  height: window.innerHeight,
  isTouch,
  retina: window.matchMedia(mediaBreakpoints.retina).matches,
});

export const matchMediaCommand = ({
  context,
  cookieManager,
}: {
  context: typeof CONTEXT_TOKEN;
  cookieManager: typeof COOKIE_MANAGER_TOKEN;
}) => {
  return function matchMedia() {
    const setMediaInfo = () => {
      const media = getMediaInfo();

      cookieManager.set({
        name: COOKIE_NAME_MEDIA_INFO,
        value: JSON.stringify(media),
      });

      return context.dispatch(
        setMedia({
          ...media,
          supposed: false,
        })
      );
    };

    const debouncedSetMediaInfo = debounce(300, setMediaInfo);

    window.addEventListener('orientationchange', debouncedSetMediaInfo);

    window.addEventListener('resize', debouncedSetMediaInfo);

    return setMediaInfo();
  };
};
