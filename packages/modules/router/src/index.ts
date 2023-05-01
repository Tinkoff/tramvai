export { NoSpaRouterModule, SpaRouterModule } from './modules/server';
export { RouterChildAppModule } from './modules/child-app';
export { Provider, useNavigate, useRoute, useRouter, useUrl } from '@tinkoff/router';
export { Link } from './components/link';
export * from '@tramvai/tokens-router';
export { routerForRoot, generateForRoot } from './modules/utils/forRoot';
export * from './stores/RouterStore';
export * from './stores/PageErrorStore';
export * from './hooks/usePageService';
export {
  onChangeHooksToken,
  beforeNavigateHooksToken,
  afterNavigateHooksToken,
  beforeResolveHooksToken,
  beforeUpdateCurrentHooksToken,
  afterUpdateCurrentHooksToken,
} from './modules/tokens';

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
