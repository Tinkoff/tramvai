import http from 'http';
import type { Agent, AgentOptions } from 'https';
import https from 'https';

export type { Agent, AgentOptions };

export const createAgent = (
  options: AgentOptions = {
    keepAlive: true,
    scheduling: 'lifo',
  }
) => {
  return {
    http: new http.Agent(options) as Agent,
    https: new https.Agent(options),
  };
};
