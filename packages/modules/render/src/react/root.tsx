import React, { PureComponent, useMemo } from 'react';
import type { ComponentType, PropsWithChildren } from 'react';
import type { UniversalErrorBoundaryFallbackProps } from '@tramvai/react';
import {
  useDi,
  UniversalErrorBoundary,
  ERROR_BOUNDARY_TOKEN,
  ERROR_BOUNDARY_FALLBACK_COMPONENT_TOKEN,
} from '@tramvai/react';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { useRoute, useUrl } from '@tramvai/module-router';
import { useStore } from '@tramvai/state';
import { deserializeError, PageErrorStore } from '../shared/pageErrorStore';

interface Props {
  LayoutComponent: React.ComponentType<{
    Header: React.ComponentType;
    Footer: React.ComponentType;
  }>;
  PageComponent: React.ComponentType;
  HeaderComponent: React.ComponentType;
  FooterComponent: React.ComponentType;
  ErrorBoundaryComponent?: React.ComponentType<UniversalErrorBoundaryFallbackProps>;
}

const PageErrorBoundary = (
  props: PropsWithChildren<{
    fallback?: React.ComponentType<UniversalErrorBoundaryFallbackProps>;
  }>
) => {
  const { children, fallback } = props;
  const url = useUrl();
  const serializedError = useStore(PageErrorStore);
  const error = useMemo(() => {
    return serializedError && deserializeError(serializedError);
  }, [serializedError]);
  const errorHandlers = useDi({ token: ERROR_BOUNDARY_TOKEN, optional: true });
  const fallbackFromDi = useDi({ token: ERROR_BOUNDARY_FALLBACK_COMPONENT_TOKEN, optional: true });

  return (
    <UniversalErrorBoundary
      url={url}
      error={error}
      errorHandlers={errorHandlers}
      fallback={fallback}
      fallbackFromDi={fallbackFromDi}
    >
      {children}
    </UniversalErrorBoundary>
  );
};

class RootComponent extends PureComponent<Props> {
  render() {
    const {
      LayoutComponent,
      PageComponent,
      HeaderComponent,
      FooterComponent,
      ErrorBoundaryComponent,
    } = this.props;

    return (
      <LayoutComponent Header={HeaderComponent} Footer={FooterComponent}>
        <PageErrorBoundary fallback={ErrorBoundaryComponent}>
          <PageComponent />
        </PageErrorBoundary>
      </LayoutComponent>
    );
  }
}

export const Root = ({ pageService }: { pageService: typeof PAGE_SERVICE_TOKEN }) => {
  const { config } = useRoute();
  const { pageComponent } = config;
  let PageComponent = pageService.getComponent(pageComponent);

  if (!PageComponent) {
    // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
    PageComponent = () => {
      throw new Error(`Page component '${pageComponent}' not found`);
    };
  }

  // Get components for current page, otherwise use a defaults
  const LayoutComponent: ComponentType<any> = pageService.resolveComponentFromConfig('layout');
  const HeaderComponent = pageService.resolveComponentFromConfig('header');
  const FooterComponent = pageService.resolveComponentFromConfig('footer');
  const ErrorBoundaryComponent: ComponentType<any> = pageService.resolveComponentFromConfig(
    'errorBoundary'
  );

  return (
    <RootComponent
      HeaderComponent={HeaderComponent}
      FooterComponent={FooterComponent}
      LayoutComponent={LayoutComponent}
      PageComponent={PageComponent}
      ErrorBoundaryComponent={ErrorBoundaryComponent}
    />
  );
};
