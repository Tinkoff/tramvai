import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { ClientHintsChildAppModule } from '@tramvai/module-client-hints';
import { ClientHintsCmp } from './component';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'client-hints',
  render: ClientHintsCmp,
  modules: [CommonChildAppModule, ClientHintsChildAppModule],
});
