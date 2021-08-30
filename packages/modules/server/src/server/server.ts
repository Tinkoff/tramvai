import http from 'http';
import type { SERVER_TOKEN, WEB_APP_TOKEN } from '@tramvai/tokens-server';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import type { ENV_MANAGER_TOKEN } from '@tramvai/module-environment';

export const serverFactory = ({ webApp }: { webApp: typeof WEB_APP_TOKEN }) => {
  const server = http.createServer();
  server.on('request', webApp);

  return server;
};

export const serverListenCommand = ({
  server,
  logger,
  envManager,
}: {
  server: typeof SERVER_TOKEN;
  logger: typeof LOGGER_TOKEN;
  envManager: typeof ENV_MANAGER_TOKEN;
}) => {
  const log = logger('server');
  const port = envManager.get('PORT');

  return function serverListen() {
    server.listen(
      {
        host: '',
        port,
      },
      () => log.warn({ event: 'server-listen-port', message: `Server listen ${port} port` })
    );
  };
};
