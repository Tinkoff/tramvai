import React from 'react';
import * as pt from 'prop-types';

export function Section({ left, right }) {
  const singleColumn = !left || !right;

  return (
    <div className="row padding--lg main-section">
      {singleColumn ? (
        <>
          <div className="col col--8 col--offset-2">{left || right}</div>
        </>
      ) : (
        <>
          <div className="col col--4 col--offset-2">{left}</div>
          <div className="col col--4">{right}</div>
        </>
      )}
    </div>
  );
}

Section.propTypes = {
  left: pt.node,
  right: pt.node,
};
