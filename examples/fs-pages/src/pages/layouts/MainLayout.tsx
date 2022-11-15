import { declareAction } from '@tramvai/core';
import type { NestedLayoutComponent } from '@tramvai/react';

const layoutAction = declareAction({
  name: 'layout action',
  fn() {
    console.log('layout action!');
  },
  conditions: {
    always: true,
  },
});

export const Layout: NestedLayoutComponent = ({ children }) => {
  return (
    <>
      <h3>Main Page Nested Layout</h3>
      <div>{children}</div>
    </>
  );
};

Layout.actions = [layoutAction];

export default Layout;
