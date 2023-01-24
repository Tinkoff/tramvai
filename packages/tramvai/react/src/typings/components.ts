import type { ComponentType, ReactNode } from 'react';
import type { PageAction, Reducer } from '@tramvai/types-actions-state-context';
import type { LoadableComponent } from '@loadable/component';
import type { UniversalErrorBoundaryFallbackProps } from '../error/UniversalErrorBoundary';

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

export interface LayoutComponentProps {
  Header: ComponentType;
  Footer: ComponentType;
  children?: ReactNode;
}

export type LayoutComponent = ComponentType<LayoutComponentProps> & Partial<LayoutComponentOptions>;

export interface MetaComponentOptions {
  actions?: PageAction[];
  reducers?: Reducer<any, any>[];
}

export interface NestedLayoutComponentProps {
  children?: ReactNode;
}

export type NestedLayoutComponent = ComponentType<NestedLayoutComponentProps> &
  Partial<MetaComponentOptions>;

export type ErrorBoundaryComponent = ComponentType<UniversalErrorBoundaryFallbackProps> &
  Partial<MetaComponentOptions>;

export type TramvaiComponent =
  | PageComponent
  | LayoutComponent
  | NestedLayoutComponent
  | ErrorBoundaryComponent;

export type TramvaiComponentDecl = TramvaiComponent | LazyComponentWrapper<TramvaiComponent>;
