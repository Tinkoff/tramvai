import { commandLineListTokens, Module } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import { getHttpsProxy, getNoProxy, httpProxyEnabled } from './utils/env';
import { addProxyToHttpsAgent } from './add-proxy-to-https-agent/add-proxy-to-https-agent';

@Module({
  imports: [],
  providers: [
    httpProxyEnabled() && {
      provide: commandLineListTokens.init,
      multi: true,
      useFactory: ({ loggerFactory, metrics }) =>
        function addHttpsProxy() {
          const logger = loggerFactory('http-proxy-agent');

          logger.debug({
            event: 'proxy agent enabled',
            proxyEnv: getHttpsProxy(),
            noProxyEnv: getNoProxy(),
          });

          addProxyToHttpsAgent({ logger, metrics });
        },
      deps: {
        loggerFactory: LOGGER_TOKEN,
        metrics: METRICS_MODULE_TOKEN,
      },
    },
  ].filter(Boolean),
})
export class HttpProxyAgentModule {}
