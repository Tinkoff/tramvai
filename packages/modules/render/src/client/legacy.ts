import { hydrate } from 'react-dom';
import type { Renderer } from './types';

const legacyRenderer: Renderer = ({ element, container, callback }) =>
  hydrate(element, container, callback);

export { legacyRenderer };
