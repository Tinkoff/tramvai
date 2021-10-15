import http from 'http';
import type { AgentOptions } from 'https';
import https from 'https';

export const createAgent = (
  options: AgentOptions = {
    keepAlive: true,
    scheduling: 'lifo',
  }
) => {
  return {
    http: new http.Agent(options) as https.Agent,
    https: new https.Agent(options),
  };
};
