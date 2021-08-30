import { createServer as httpCreateServer } from 'http';
import stoppable from 'stoppable';

export const createServer = () => {
  const server = httpCreateServer();

  return stoppable(server, 0);
};
