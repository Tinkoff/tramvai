import http from 'http';
import type { AgentOptions } from 'https';
import https from 'https';

export const createAgent = (
  options: AgentOptions = {
    keepAlive: true,
    keepAliveMsecs: 5000,
    maxSockets: 30,
    maxFreeSockets: 10,
  }
) => {
  return {
    http: new http.Agent(options) as https.Agent,
    https: new https.Agent(options),
  };
};
