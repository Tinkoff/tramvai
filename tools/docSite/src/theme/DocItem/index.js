/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
// eslint-disable-next-line import/no-unresolved
import DocPaginator from '@theme/DocPaginator';
// eslint-disable-next-line import/no-unresolved
import DocVersionBanner from '@theme/DocVersionBanner';
// eslint-disable-next-line import/no-unresolved
import Seo from '@theme/Seo';
// eslint-disable-next-line import/no-unresolved
import LastUpdated from '@theme/LastUpdated';
// eslint-disable-next-line import/no-unresolved
import TOC from '@theme/TOC';
// eslint-disable-next-line import/no-unresolved
import EditThisPage from '@theme/EditThisPage';
// eslint-disable-next-line import/no-unresolved
import { MainHeading } from '@theme/Heading';
import clsx from 'clsx';
// eslint-disable-next-line import/no-unresolved
import { useActivePlugin, useVersions } from '@theme/hooks/useDocs';
// eslint-disable-next-line no-restricted-imports
import { DocsRating } from '../../components/DocsRating/src';
import styles from './styles.module.css';

function DocItem(props) {
  const { content: DocContent, versionMetadata } = props;
  const { metadata, frontMatter } = DocContent;
  const {
    image,
    keywords,
    hide_title: hideTitle,
    hide_table_of_contents: hideTableOfContents,
  } = frontMatter;
  const {
    description,
    title,
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
    unversionedId,
  } = metadata;
  const { pluginId } = useActivePlugin({
    failfast: true,
  });
  const versions = useVersions(pluginId); // If site is not versioned or only one version is included
  // we don't show the version badge
  // See https://github.com/facebook/docusaurus/issues/3362

  const showVersionBadge = versions.length > 1; // We only add a title if:
  // - user asks to hide it with frontmatter
  // - the markdown content does not already contain a top-level h1 heading

  const shouldAddTitle = !hideTitle && typeof DocContent.contentTitle === 'undefined';
  return (
    <>
      <Seo
        {...{
          title,
          description,
          keywords,
          image,
        }}
      />

      <div className="row">
        <div
          className={clsx('col', {
            [styles.docItemCol]: !hideTableOfContents,
          })}
        >
          <DocVersionBanner versionMetadata={versionMetadata} />
          <div className={styles.docItemContainer}>
            <article>
              {showVersionBadge && (
                <span className="badge badge--secondary">Version: {versionMetadata.label}</span>
              )}

              <div className="markdown">
                {/*
                 Title can be declared inside md content or declared through frontmatter and added manually
                 To make both cases consistent, the added title is added under the same div.markdown block
                 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
                 */}
                {shouldAddTitle && <MainHeading>{title}</MainHeading>}

                <DocContent />
              </div>

              <DocsRating label={unversionedId} />

              {(editUrl || lastUpdatedAt || lastUpdatedBy) && (
                <footer className="row docusaurus-mt-lg">
                  <div className="col">{editUrl && <EditThisPage editUrl={editUrl} />}</div>

                  <div className={clsx('col', styles.lastUpdated)}>
                    {(lastUpdatedAt || lastUpdatedBy) && (
                      <LastUpdated
                        lastUpdatedAt={lastUpdatedAt}
                        formattedLastUpdatedAt={formattedLastUpdatedAt}
                        lastUpdatedBy={lastUpdatedBy}
                      />
                    )}
                  </div>
                </footer>
              )}
            </article>

            <DocPaginator metadata={metadata} />
          </div>
        </div>
        {!hideTableOfContents && DocContent.toc && (
          <div className="col col--3">
            <TOC toc={DocContent.toc} />
          </div>
        )}
      </div>
    </>
  );
}

export default DocItem;
