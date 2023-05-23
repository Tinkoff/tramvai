import { useEffect, useRef } from 'react';
import { useRoute, useUrl } from '@tramvai/module-router';
import { optional } from '@tinkoff/dippy';
import { useDi } from '@tramvai/react';
import { AUTOSCROLL_BEHAVIOR_MODE_TOKEN } from '../tokens';

const DEFAULT_AUTOSCROLL_BEHAVIOR = 'smooth';

const scrollToTop = (behavior: ScrollBehavior) => {
  // В некоторых браузерах не поддерживается scrollTo с одним параметром
  try {
    window.scrollTo({ top: 0, left: 0, behavior });
  } catch (error) {
    window.scrollTo(0, 0);
  }
};

const isAutoScrollEnabled = (route: ReturnType<typeof useRoute>) => {
  return !route.navigateState?.disableAutoscroll;
};

const scrollToAnchor = (anchor: string, behavior: ScrollBehavior): boolean => {
  try {
    document.querySelector(anchor)?.scrollIntoView({
      behavior,
    });

    return true;
  } catch {
    return false;
  }
};

// Поведение с подскроллом похоже на
// https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top

export function Autoscroll() {
  const globalScrollBehavior =
    useDi(optional(AUTOSCROLL_BEHAVIOR_MODE_TOKEN)) || DEFAULT_AUTOSCROLL_BEHAVIOR;
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

    const scrollBehavior = route?.navigateState?.autoscrollBehavior || globalScrollBehavior;

    if (!url.hash) {
      scrollToTop(scrollBehavior);
      shouldScroll.current = false;
    } else {
      shouldScroll.current = !scrollToAnchor(url.hash, scrollBehavior);
    }
  });

  return null;
}
