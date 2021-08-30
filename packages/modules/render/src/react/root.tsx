import memoOne from '@tinkoff/utils/function/memoize/one';
import strictEqual from '@tinkoff/utils/is/strictEqual';
import React, { PureComponent } from 'react';
import { withError } from '@tramvai/react';
import type { COMPONENT_REGISTRY_TOKEN } from '@tramvai/tokens-common';
import { useRoute } from '@tramvai/module-router';

interface Props {
  LayoutComponent: React.ComponentType<{
    Header: React.ComponentType;
    Footer: React.ComponentType;
  }>;
  PageComponent: React.ComponentType;
  HeaderComponent: React.ComponentType;
  FooterComponent: React.ComponentType;
}

class RootComponent extends PureComponent<Props> {
  render() {
    const { LayoutComponent, PageComponent, HeaderComponent, FooterComponent } = this.props;

    return (
      <LayoutComponent Header={HeaderComponent} Footer={FooterComponent}>
        <PageComponent />
      </LayoutComponent>
    );
  }
}

const layoutWrapper = memoOne(withError(), strictEqual);
const pageWrapper = memoOne(withError(), strictEqual);

export const Root = withError()(
  ({
    componentRegistry,
  }: {
    componentRegistry: typeof COMPONENT_REGISTRY_TOKEN;
    children?: React.ReactNode;
  }) => {
    const { config } = useRoute();

    const {
      bundle,
      pageComponent,
      layoutComponent = 'layoutDefault',
      headerComponent = 'headerDefault',
      footerComponent = 'footerDefault',
    } = config;

    const PageComponent = componentRegistry.get(pageComponent, bundle);
    // Достаем компоненты из бандла, либо берем default реализации
    const LayoutComponent =
      componentRegistry.get(layoutComponent, bundle) || componentRegistry.get('layoutDefault');
    const HeaderComponent =
      componentRegistry.get(headerComponent, bundle) || componentRegistry.get('headerDefault');
    const FooterComponent =
      componentRegistry.get(footerComponent, bundle) || componentRegistry.get('footerDefault');

    if (!PageComponent) {
      throw new Error(`Page component '${pageComponent}' not found`);
    }

    return (
      <RootComponent
        HeaderComponent={HeaderComponent}
        FooterComponent={FooterComponent}
        LayoutComponent={layoutWrapper(LayoutComponent)}
        PageComponent={pageWrapper(PageComponent)}
      />
    );
  }
);
