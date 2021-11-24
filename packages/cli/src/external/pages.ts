export interface Page {
  default?: any;
}

// eslint-disable-next-line import/no-default-export
export default {
  routes: {},
  pages: {},
} as {
  routes: Record<string, Page>;
  pages: Record<string, Page>;
};
