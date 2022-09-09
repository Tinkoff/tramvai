import { createPapiMethod } from '@tramvai/papi';
import { USER_AGENT_TOKEN } from '@tramvai/module-client-hints';

// eslint-disable-next-line import/no-default-export
export default createPapiMethod({
  async handler() {
    return this.deps.userAgent.browser;
  },
  deps: {
    userAgent: USER_AGENT_TOKEN,
  },
});
