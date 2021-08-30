import type { Context } from '../../models/context';

export function checkApplication({ config }: Context, parameters) {
  const { target } = parameters;
  const cfg = config.getProject(target);

  if (!cfg) {
    throw new Error(`[checkBuild] Missing project '${target}' in tramvai.json`);
  }

  return Promise.resolve({ name: 'checkBuild', status: 'ok' });
}
