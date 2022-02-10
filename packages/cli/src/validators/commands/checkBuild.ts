import type { Validator } from './validator.h';

export const checkApplication: Validator = ({ config }, parameters) => {
  const { target } = parameters;
  const cfg = config.getProject(target);

  if (!cfg) {
    throw new Error(`[checkBuild] Missing project '${target}' in tramvai.json`);
  }

  return Promise.resolve({ name: 'checkBuild', status: 'ok' });
};
