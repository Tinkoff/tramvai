import type { ComponentType, ReactNode } from 'react';
import type { PageAction, Reducer } from '@tramvai/types-actions-state-context';
import type { LoadableComponent } from '@loadable/component';

export type LazyComponentWrapper<Component extends ComponentType<any>> = {
  // typings in loadable do not respect module with default export
  load: (props?: Component extends ComponentType<infer Props> ? Props : {}) => Promise<{
    default: Component;
  }>;
} & LoadableComponent<Component extends ComponentType<infer Props> ? Props : {}>;

export interface PageComponentOptions {
  actions?: PageAction[];
  reducers?: Reducer<any, any>[];
  components?: Record<string, TramvaiComponent>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageComponentProps {}

export type PageComponent = ComponentType<PageComponentProps> & Partial<PageComponentOptions>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LayoutComponentOptions {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LayoutComponentProps {
  Header: ComponentType;
  Footer: ComponentType;
  children?: ReactNode;
}

export type LayoutComponent = ComponentType<LayoutComponentProps> & Partial<LayoutComponentOptions>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NestedLayoutComponentOptions {
  actions?: PageAction[];
  reducers?: Reducer<any, any>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NestedLayoutComponentProps {
  children?: ReactNode;
}

export type NestedLayoutComponent = ComponentType<NestedLayoutComponentProps> &
  Partial<NestedLayoutComponentOptions>;

export type TramvaiComponent = PageComponent | LayoutComponent | NestedLayoutComponent;

export type TramvaiComponentDecl = TramvaiComponent | LazyComponentWrapper<TramvaiComponent>;
