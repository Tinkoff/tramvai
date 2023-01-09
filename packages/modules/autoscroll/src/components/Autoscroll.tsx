import { useEffect, useRef } from 'react';
import { useRoute, useUrl } from '@tramvai/module-router';

const scrollToTop = () => {
  // В некоторых браузерах не поддерживается scrollTo с одним параметром
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  } catch (error) {
    window.scrollTo(0, 0);
  }
};

const isAutoScrollEnabled = (route: ReturnType<typeof useRoute>) => {
  return !route.navigateState?.disableAutoscroll;
};

const scrollToAnchor = (anchor: string): boolean => {
  try {
    document.querySelector(anchor)?.scrollIntoView({
      behavior: 'smooth',
    });

    return true;
  } catch {
    return false;
  }
};

// Поведение с подскроллом похоже на
// https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top

export function Autoscroll() {
  const route = useRoute();
  const url = useUrl();
  const routeRef = useRef(url);
  const shouldScroll = useRef(!!routeRef.current.hash && isAutoScrollEnabled(route));

  // Так как отрисовка нужного нам элемента происходит после обновления route, при первом срабатывании эффекта мы обновляем shouldScroll, а при втором скроллим
  useEffect(() => {
    if (url.pathname !== routeRef.current.pathname || url.hash !== routeRef.current.hash) {
      routeRef.current = url;
      shouldScroll.current = isAutoScrollEnabled(route);
    }

    if (!shouldScroll.current) {
      return;
    }

    if (!url.hash) {
      scrollToTop();
      shouldScroll.current = false;
    } else {
      shouldScroll.current = !scrollToAnchor(url.hash);
    }
  });

  return null;
}
