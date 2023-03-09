import type { Validator } from './validator.h';

export const checkConfigExists: Validator = ({ config }) => {
  const configParameters = config.get();

  if (!configParameters) {
    throw new Error(
      `[checkConfigExists] tramvai.json config is missing. To resolve create tramvai.json config manually, or create a new app with command "tramvai new myAwesomeApp"`
    );
  }

  return Promise.resolve({ name: 'checkConfigExists', status: 'ok' });
};
