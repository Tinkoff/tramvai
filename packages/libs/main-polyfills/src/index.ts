// imports from core-js will transform by [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env#usebuiltins-entry) in more specific,
// according to browser versions in the browserslist, separately for legacy and modern builds
import 'core-js/stable/object';
import 'core-js/stable/array';
import 'core-js/stable/string';
import 'core-js/stable/map';
import 'core-js/stable/set';
import 'core-js/stable/symbol';
import 'core-js/stable/promise';
import 'core-js/stable/weak-map';
import 'core-js/stable/weak-set';
import 'core-js/stable/url';

import 'abort-controller/polyfill';

import 'intersection-observer';
import 'element-closest-polyfill';

// CSS variables

import cssVars from 'css-vars-ponyfill';

cssVars();

// Web API

if (typeof window !== 'undefined') {
  require('whatwg-fetch');
}
