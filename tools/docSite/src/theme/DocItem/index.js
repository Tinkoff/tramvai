import React from 'react';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {DocProvider} from '@docusaurus/theme-common/internal';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
// eslint-disable-next-line no-restricted-imports
import { DocsRating } from '../../components/DocsRating/src';

export default function DocItem(props) {
  const unversionedId = props.content.metadata.unversionedId;
  const docHtmlClassName = `docs-doc-id-${unversionedId}`;
  const MDXComponent = props.content;
  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          <MDXComponent />
          <DocsRating label={unversionedId} />
        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}
