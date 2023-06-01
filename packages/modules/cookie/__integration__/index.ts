import { createApp } from '@tramvai/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CookieModule } from '@tramvai/module-cookie';
import { modules, bundles } from '../../../../test/shared/common';

createApp({
  name: 'CookieApp',
  modules: [...modules, CookieModule],
  bundles,
});
