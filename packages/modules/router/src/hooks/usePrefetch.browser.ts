import { useEffect } from 'react';
import { useDi } from '@tramvai/react';
import { LINK_PREFETCH_MANAGER_TOKEN } from '@tramvai/tokens-router';
import { requestIdleCallback, cancelIdleCallback } from '../utils/requestIdleCallback';
import { optional } from '@tinkoff/dippy';

const isUserNetworkConditionsSuitableForPrefetch = () => {
  const { saveData, effectiveType = '' } = (navigator as any).connection ?? {};

  return !saveData && !(effectiveType === '2g' || effectiveType === 'slow-2g');
};

export const usePrefetch = ({
  url,
  target,
  prefetch,
}: {
  url: string;
  target: Element | null;
  prefetch: boolean;
}) => {
  const linkPrefetchManager = useDi(optional(LINK_PREFETCH_MANAGER_TOKEN));

  useEffect(() => {
    if (!target || !prefetch || !linkPrefetchManager) {
      return;
    }

    let idleId: number = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // when `Link` element in viewport
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          // only once
          observer.disconnect();

          if (isUserNetworkConditionsSuitableForPrefetch()) {
            // trigger prefetching when browser is idle
            idleId = requestIdleCallback(() => {
              linkPrefetchManager.prefetch(url);
            });
          }
        }
      });
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
      cancelIdleCallback(idleId);
    };
  }, [url, target, prefetch, linkPrefetchManager]);
};
