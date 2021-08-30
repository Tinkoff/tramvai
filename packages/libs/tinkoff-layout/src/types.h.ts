import type { ComponentType, ReactNode } from 'react';

export type ReactComponent = ComponentType<any>;

export type Wrapper = (WrappedComponent: ReactComponent) => ReactComponent;

export type LayoutOptions = {
  components?: Record<string, ReactComponent>;
  wrappers?: Record<string, Wrapper | Wrapper[]>;
};

export type LayoutProps = {
  children: ReactNode;
  Header?: ReactComponent;
  Footer?: ReactComponent;
};
