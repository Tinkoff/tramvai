import * as util from 'util';

if (typeof window !== 'undefined') {
  // This is a workaround for https://github.com/jsdom/jsdom/issues/2524#issuecomment-902027138
  window.TextEncoder = util.TextEncoder as unknown as typeof window.TextEncoder;
  window.TextDecoder = util.TextDecoder as unknown as typeof window.TextDecoder;
}
