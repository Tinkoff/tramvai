import { useMemo } from 'react';
import type { ComponentType, PropsWithChildren } from 'react';
import { usePageService } from '@tramvai/module-router';
import type { PageComponent as PageComponentType } from '@tramvai/react';

/**
 * Result component structure:
 *
 * <Root>
 *   <RootComponent>
 *    <LayoutComponent>
 *      <NestedLayoutComponent>
 *        <PageComponent />
 *      </NestedLayoutComponent>
 *    </LayoutComponent>
 *  </RootComponent>
 * </Root>
 *
 * All components separated for a few reasons:
 * - Page subtree can be rendered independently when Layout and Nested Layout the same
 * - Nested Layout can be rerendered only on its changes
 * - Layout can be rendered only on its changes
 */

const LayoutRenderComponent = ({ children }: PropsWithChildren) => {
  const pageService = usePageService();
  const LayoutComponent: ComponentType<any> = pageService.resolveComponentFromConfig('layout');
  const HeaderComponent = pageService.resolveComponentFromConfig('header');
  const FooterComponent = pageService.resolveComponentFromConfig('footer');

  const layout = useMemo(
    () => (
      <LayoutComponent Header={HeaderComponent} Footer={FooterComponent}>
        {children}
      </LayoutComponent>
    ),
    [LayoutComponent, HeaderComponent, FooterComponent, children]
  );

  return layout;
};

const NestedLayoutRenderComponent = ({ children }: PropsWithChildren) => {
  const pageService = usePageService();
  const NestedLayoutComponent: ComponentType<any> =
    pageService.resolveComponentFromConfig('nestedLayout');

  const nestedLayout = useMemo(
    () => <NestedLayoutComponent>{children}</NestedLayoutComponent>,
    [NestedLayoutComponent, children]
  );

  return nestedLayout;
};

const PageRenderComponent = () => {
  const pageService = usePageService();
  const { pageComponent } = pageService.getConfig();
  let PageComponent = pageService.getComponent(pageComponent) as PageComponentType;

  if (!PageComponent) {
    PageComponent = () => {
      throw new Error(`Page component '${pageComponent}' not found`);
    };
  }

  const page = useMemo(() => <PageComponent />, [PageComponent]);

  return page;
};

export const Root = () => {
  const pageRenderComponent = useMemo(() => <PageRenderComponent />, []);

  const nestedLayoutRenderComponent = useMemo(
    () => <NestedLayoutRenderComponent>{pageRenderComponent}</NestedLayoutRenderComponent>,
    [pageRenderComponent]
  );

  return <LayoutRenderComponent>{nestedLayoutRenderComponent}</LayoutRenderComponent>;
};
