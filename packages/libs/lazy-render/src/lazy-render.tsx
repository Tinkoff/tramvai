import type { RefObject, HTMLProps, ComponentType } from 'react';
import React, { useRef } from 'react';
import { createUseObserverVisible } from './use-observer-visible';

type Props = {
  mode?: 'static';
  children: React.ReactNode;
  useObserver?: (containerRef: RefObject<HTMLElement>) => boolean;
  wrapper?: ComponentType | string;
  wrapperProps?: HTMLProps<HTMLElement>;
};

// Used hack https://github.com/facebook/react/issues/10923#issuecomment-338715787
const EMPTY_HTML = { __html: '' };
const useObserverVisible = createUseObserverVisible({
  root: null,
  rootMargin: '200px 0px 0px 0px',
});

export const LazyRender: React.FC<Props> = ({
  mode,
  children,
  useObserver = useObserverVisible,
  wrapper = 'div',
  wrapperProps = {},
}) => {
  const containerRef = useRef(null);
  const isVisible = useObserver(containerRef);

  if (isVisible || mode === 'static') {
    return React.createElement(wrapper, { ...wrapperProps }, children);
  }

  return React.createElement(wrapper, {
    ref: containerRef,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: EMPTY_HTML,
    ...wrapperProps,
  });
};

LazyRender.displayName = 'LazyRender';
