import type { LayoutComponent as LayoutComponentType } from '@tramvai/react';
import { Header } from '../child-apps/header/component';
// import { Footer } from '../child-apps/footer/component';

export const LayoutComponent: LayoutComponentType = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      {/* <Footer /> */}
    </>
  );
};

LayoutComponent.childApps = [{ name: 'header' }];
