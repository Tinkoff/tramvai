import React from 'react';
import * as pt from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import Link from '@docusaurus/Link';
// eslint-disable-next-line import/no-unresolved
import useBaseUrl from '@docusaurus/useBaseUrl';

export function BaseLink({ to, target, children }) {
  return (
    <Link
      className="button button--lg button--primary margin--xs"
      to={useBaseUrl(to)}
      target={target}
    >
      {children}
    </Link>
  );
}

BaseLink.defaultProps = {
  target: '_self',
};

BaseLink.propTypes = {
  children: pt.node,
  to: pt.string,
  target: pt.string,
};
