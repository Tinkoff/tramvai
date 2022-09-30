import React, { useEffect, useState } from 'react';
import type { PropsWithChildren, ComponentType } from 'react';
import { useDi } from '@tramvai/react';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { useRoute } from '@tramvai/module-router';
import type { TramvaiRenderMode } from '@tramvai/tokens-render';
import {
  PAGE_RENDER_FALLBACK_COMPONENT_PREFIX,
  PAGE_RENDER_DEFAULT_MODE,
  PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
} from './tokens';
import { getPageRenderMode } from './utils/getPageRenderMode';

export const PageRenderWrapper = ({ children }: PropsWithChildren<{}>) => {
  const [mounted, setMounted] = useState(false);
  const pageService = useDi(PAGE_SERVICE_TOKEN);
  const fallbackKey = useDi(PAGE_RENDER_FALLBACK_COMPONENT_PREFIX);
  const defaultRenderMode = useDi(PAGE_RENDER_DEFAULT_MODE);
  const DefaultFallbackComponent = useDi({
    token: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
    optional: true,
  });

  const FallbackComponent: ComponentType<any> =
    pageService.resolveComponentFromConfig(fallbackKey as any) || DefaultFallbackComponent;

  const mode = getPageRenderMode({ pageService, defaultRenderMode });

  useEffect(() => {
    if (mode === 'client') {
      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mode === 'client' && !mounted) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    return null;
  }
  return <>{children}</>;
};

export const pageRenderHOC = (WrapperPage) => (props) => {
  return (
    <PageRenderWrapper>
      <WrapperPage {...props} />
    </PageRenderWrapper>
  );
};
