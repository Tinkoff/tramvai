import React, { PureComponent } from 'react';
import type { ComponentType } from 'react';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { useRoute } from '@tramvai/module-router';

interface Props {
  LayoutComponent: React.ComponentType<{
    Header: React.ComponentType;
    Footer: React.ComponentType;
    children?: React.ReactNode;
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

export const Root = ({ pageService }: { pageService: typeof PAGE_SERVICE_TOKEN }) => {
  const { config } = useRoute();
  const { pageComponent } = config;
  let PageComponent = pageService.getComponent(pageComponent);

  if (!PageComponent) {
    PageComponent = () => {
      throw new Error(`Page component '${pageComponent}' not found`);
    };
  }

  // Get components for current page, otherwise use a defaults
  const LayoutComponent: ComponentType<any> = pageService.resolveComponentFromConfig('layout');
  const HeaderComponent = pageService.resolveComponentFromConfig('header');
  const FooterComponent = pageService.resolveComponentFromConfig('footer');

  return (
    <RootComponent
      HeaderComponent={HeaderComponent}
      FooterComponent={FooterComponent}
      LayoutComponent={LayoutComponent}
      PageComponent={PageComponent}
    />
  );
};
