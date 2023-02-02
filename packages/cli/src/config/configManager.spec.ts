import type { ConfigEntry } from '../typings/configEntry/common';
import { createConfigManager } from './configManager';

jest.mock('./validate', () => {
  const original = jest.requireActual('./validate');

  return { ...original, validate: () => true };
});

const configEntry: ConfigEntry & Record<string, any> = {
  name: 'test',
  root: 'src',
  type: 'package',
  optionBoolean: false,
  optionString: 'str',
  optionOverride: {
    development: '123',
    production: '456',
  },
} as const;

it('should pass configEntry options', () => {
  const configManager = createConfigManager(configEntry, {});

  expect(configManager.optionBoolean).toBe(false);
  expect(configManager.optionString).toBe('str');
});

describe('should resolve settings depending on env', () => {
  it('development', () => {
    const configManager = createConfigManager(configEntry, { env: 'development' });

    expect(configManager.optionOverride).toEqual('123');
  });

  it('production', () => {
    const configManager = createConfigManager(configEntry, { env: 'production' });

    expect(configManager.optionOverride).toBe('456');
  });
});

it('hydration', () => {
  const configManager = createConfigManager(configEntry, {});

  const rehydrated = createConfigManager(...configManager.dehydrate());

  expect(JSON.stringify(rehydrated)).toEqual(JSON.stringify(configManager));
});
