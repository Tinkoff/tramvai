import React from 'react';
// eslint-disable-next-line import/no-unresolved
import components from '@theme/MDXComponents';

export function Code({ children, language }) {
  return code(language, children);
}

export function code(language, children) {
  return (
    <components.pre>
      <components.code
        className={`language-${language}`}
        mdxType="code"
        originalType="code"
        parentName="pre"
      >
        {children}
      </components.code>
    </components.pre>
  );
}
