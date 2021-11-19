import memoOne from '@tinkoff/utils/function/memoize/one';
import strictEqual from '@tinkoff/utils/is/strictEqual';
import React, { PureComponent } from 'react';
import { withError } from '@tramvai/react';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
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
  ({ pageService }: { pageService: typeof PAGE_SERVICE_TOKEN; children?: React.ReactNode }) => {
    const { config } = useRoute();

    const {
      pageComponent,
      layoutComponent = 'layoutDefault',
      headerComponent = 'headerDefault',
      footerComponent = 'footerDefault',
    } = config;

    const PageComponent = pageService.getComponent(pageComponent);
    // Достаем компоненты для текущей страницы, либо берем default реализации
    const LayoutComponent =
      pageService.getComponent(layoutComponent) || pageService.getComponent('layoutDefault');
    const HeaderComponent =
      pageService.getComponent(headerComponent) || pageService.getComponent('headerDefault');
    const FooterComponent =
      pageService.getComponent(footerComponent) || pageService.getComponent('footerDefault');

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
