import React from 'react';
// eslint-disable-next-line import/no-unresolved
import Layout from '@theme/Layout';
// eslint-disable-next-line no-restricted-imports
import { DocsRating } from '../components/DocsRating/src';
import { Title } from '../components/main/title';
import { QuickStart } from '../components/main/quick-start';
import { Universal } from '../components/main/universal';
import { Modular } from '../components/main/modular';
import { Performance } from '../components/main/performance';
import { DI } from '../components/main/di';
import { View } from '../components/main/view';
import { State } from '../components/main/state';
import { Commands } from '../components/main/commands';

function Index() {
  return (
    <Layout>
      <Title />
      <QuickStart />
      <Universal />
      <Modular />
      <Performance />
      <DI />
      <View />
      <State />
      <Commands />
      <div className="row padding-bottom--xl">
        <div className="col col--8 col--offset-2">
          <DocsRating label="root" />
        </div>
      </div>
    </Layout>
  );
}

export default Index;
