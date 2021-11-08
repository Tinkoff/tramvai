export interface Page {
  default?: any;
}

// eslint-disable-next-line import/no-default-export
export default {
  staticPages: {},
  externalPages: {},
} as {
  staticPages: Record<string, Page>;
  externalPages: Record<string, Page>;
};
