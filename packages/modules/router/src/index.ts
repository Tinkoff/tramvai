export { NoSpaRouterModule, SpaRouterModule } from './modules/server';
export { RouterChildAppModule } from './modules/child-app';
export { Provider, useNavigate, useRoute, useRouter, useUrl, Link } from '@tinkoff/router';
export * from '@tramvai/tokens-router';
export { generateForRoot } from './modules/utils/forRoot';
export * from './stores/RouterStore';
export * from './hooks/usePageService';

type RouteConfig = {
  [key: string]: any;

  bundle?: string;
  pageComponent?: string;
  layoutComponent?: string;
  nestedLayoutComponent?: string;
  errorBoundaryComponent?: string;

  meta?: {
    seo?: {
      metaTags?: Record<string, any>;
      shareSchema?: Record<string, any>;
    };
  };
};

declare module '@tramvai/react' {
  export interface PageComponentOptions {
    routeConfig?: RouteConfig;
  }
}
