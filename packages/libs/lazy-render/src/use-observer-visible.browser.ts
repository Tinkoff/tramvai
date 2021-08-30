import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export const createUseObserverVisible = (observerOptions: IntersectionObserverInit) => (
  containerRef: RefObject<HTMLDivElement>
) => {
  const [isVisible, changeVisibility] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isVisible) {
      return;
    }

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          observer.disconnect();
          changeVisibility(true);
        }
      });
    }, observerOptions);

    io.observe(containerRef.current);

    return () => {
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return isVisible;
};
