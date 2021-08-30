import { createElement, StrictMode } from 'react';
import { legacyRenderer } from './legacy';
import type { Renderer } from './types';

const strictRenderer: Renderer = (params) => {
  const element = createElement(StrictMode, null, params.element);
  return legacyRenderer({ ...params, element });
};

export { strictRenderer };
