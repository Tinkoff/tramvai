import React from 'react';
import { createBundle } from '@tramvai/core';

const layoutDefault = ({ children }) => (
  <>
    <h3 id="layout">Test Layout</h3>
    <div>{children}</div>
  </>
);

export const DomNavigateQuery = () => {
  return (
    <a href="./?test=b">
      <button id="button" type="button">
        Button
      </button>
    </a>
  );
};

export const DomNavigateHash = () => {
  return (
    <a href="#test">
      <button id="button" type="button">
        Button
      </button>
    </a>
  );
};

export default createBundle({
  name: 'dom-navigate',
  components: {
    layoutDefault,
    DomNavigateQuery,
    DomNavigateHash,
  },
});
