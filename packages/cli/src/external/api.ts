export interface ApiHandler {
  default?: Function;
  handler?: Function;
  deps?: Record<string, any>;
  mapDeps?: (deps: Record<string, any>) => any;
}

export default {} as Record<string, ApiHandler>;
