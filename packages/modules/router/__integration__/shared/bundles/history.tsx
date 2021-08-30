import React, { useEffect } from 'react';
import { createBundle } from '@tramvai/core';

const layoutDefault = ({ children }) => (
  <>
    <h3 id="layout">Test Layout</h3>
    <div>{children}</div>
  </>
);

export const ReplaceStateInternal = () => {
  useEffect(() => {
    window.history.replaceState({}, '', '../internal/?test=a');
  });

  return (
    <>
      <div id="page">Replace State Internal</div>
    </>
  );
};

export const ReplaceStateExternal = () => {
  useEffect(() => {
    window.history.replaceState({}, '', '/test/');
  });

  return (
    <>
      <div id="page">Replace State External</div>
    </>
  );
};

export const PushStateInternal = () => {
  useEffect(() => {
    window.history.pushState({}, '', '../internal?test=a');
  });

  return (
    <>
      <div id="page">Push State Internal</div>
    </>
  );
};

export const PushStateExternal = () => {
  useEffect(() => {
    window.history.pushState({}, '', '/test/');
  });

  return (
    <>
      <div id="page">Push State External</div>
    </>
  );
};

export default createBundle({
  name: 'history',
  components: {
    layoutDefault,
    ReplaceStateInternal,
    ReplaceStateExternal,
    PushStateInternal,
    PushStateExternal,
  },
});
