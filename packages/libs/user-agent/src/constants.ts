export const BROWSERS_LIST_MAP: {
  [key: string]: {
    type: 'mobile' | 'desktop' | 'any';
    name: string;
  };
} = {
  chrome: {
    type: 'desktop',
    name: 'chrome',
  },
  safari: {
    type: 'desktop',
    name: 'safari',
  },
  firefox: {
    type: 'desktop',
    name: 'firefox',
  },
  opera: {
    type: 'desktop',
    name: 'opera',
  },
  ie: {
    type: 'desktop',
    name: 'ie',
  },
  edge: {
    type: 'any',
    name: 'edge',
  },
  and_chr: {
    type: 'mobile',
    name: 'chrome',
  },
  ios_saf: {
    type: 'mobile',
    name: 'mobile safari',
  },
  android: {
    type: 'mobile',
    name: 'android browser',
  },
  op_mob: {
    type: 'mobile',
    name: 'opera',
  },
  and_uc: {
    type: 'mobile',
    name: 'ucbrowser',
  },
  and_ff: {
    type: 'mobile',
    name: 'firefox',
  },
};

export const CHROMIUM_BASED_BROWSERS = [
  'android browser',
  'yandex',
  'vivaldi' /* , 'chrome webview', 'opera', 'samsung' */,
];
