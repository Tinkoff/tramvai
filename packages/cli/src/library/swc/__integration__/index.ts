import * as createTokenPure from './create-token-pure';
import * as providerStack from './provider-stack';
import * as lazyComponent from './lazy-component';
import * as typeofWindow from './typeof-window';
import * as nodeEnv from './node-env';
import * as serverInline from './server.inline';
import * as reactSvg from './react-svg';

// prevent from removing imports by webpack optimizations
console.log([
  createTokenPure,
  providerStack,
  lazyComponent,
  typeofWindow,
  nodeEnv,
  serverInline,
  reactSvg,
]);
