import React from 'react';
import Layout from '@theme/Layout';

export default function Versions() {
  const baseUrl = '/tramvai/';

  return (
    <Layout title="Tramvai Versions" description="Tramvai Versions Page">
      <div className="container container-fluid">
        <h2>Tramvai Versions</h2>
        <ul>
          <li><a href={baseUrl}>v2.x.x</a></li>
          <li><a href={`${baseUrl}1.x.x`}>v1.x.x</a></li>
        </ul>
      </div>
    </Layout>
  );
}