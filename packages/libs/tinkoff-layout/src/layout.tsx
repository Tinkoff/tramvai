import React from 'react';
import type { ReactComponent, LayoutProps, LayoutOptions } from './types.h';
import { composeComponent } from './utils';

const RenderChildren: ReactComponent = ({ children }) => children;

const RenderProp: ReactComponent = ({ children, ...props }) => children(props);

export const createLayout = ({ components = {}, wrappers = {} }: LayoutOptions = {}) => {
  const {
    header: BaseHeader = RenderProp,
    footer: BaseFooter = RenderProp,
    layout: BaseLayout = RenderChildren,
    content: BaseContent = RenderChildren,
    page: BasePage = RenderChildren,
    ...globalComponents
  } = components;

  const LayoutWrapper = composeComponent(BaseLayout, wrappers.layout);
  const ContentWrapper = composeComponent(BaseContent, wrappers.content);
  const PageWrapper = composeComponent(BasePage, wrappers.page);
  const HeaderWrapper = composeComponent(BaseHeader, wrappers.header);
  const FooterWrapper = composeComponent(BaseFooter, wrappers.footer);

  const componentsList = Object.keys(globalComponents).map((name) => {
    const Component = composeComponent(globalComponents[name], wrappers[name]);
    return { name, Component };
  });

  const Layout: React.FC<LayoutProps> = ({ children, Header, Footer }) => {
    return (
      <LayoutWrapper>
        {componentsList.map(({ Component, name }) => (
          <Component key={name} />
        ))}
        <ContentWrapper>
          {Header ? <HeaderWrapper>{(props) => <Header {...props} />}</HeaderWrapper> : null}
          <PageWrapper>{children}</PageWrapper>
          {Footer ? <FooterWrapper>{(props) => <Footer {...props} />}</FooterWrapper> : null}
        </ContentWrapper>
      </LayoutWrapper>
    );
  };

  Layout.displayName = 'Layout';

  return Layout;
};
