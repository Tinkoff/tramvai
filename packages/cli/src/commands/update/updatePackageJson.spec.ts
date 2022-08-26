import { updatePackageJson } from './updatePackageJson';

const LATEST_TRAMVAI_VERSION = '1.115.6';
const LATEST_LIB_VERSION = '0.8.23';

let mockPackageJson: Record<string, any>;
const mockFsWrite = jest.fn();
const mockPackageInfoDependencies = jest.fn<Record<string, string | undefined>, [string]>();

jest.mock('../../utils/commands/dependencies/packageHasVersion', () => ({
  packageHasVersion: () => true,
}));
jest.mock('../../utils/commands/dependencies/getLatestPackageVersion', () => ({
  getLatestPackageVersion: (dep: string) => {
    if (dep.startsWith('@tramvai')) {
      return LATEST_TRAMVAI_VERSION;
    }

    return LATEST_LIB_VERSION;
  },
}));

jest.mock('../../utils/commands/dependencies/getPackageInfo', () => ({
  getPackageInfo: (packageName: string, field?: string) => {
    if (field === 'dependencies') {
      return mockPackageInfoDependencies(packageName);
    }
  },
}));

jest.mock('fs', () => ({
  readFileSync: () => JSON.stringify(mockPackageJson),
  writeFileSync: (...args: string[]) => mockFsWrite(...args),
}));

beforeEach(() => {
  mockFsWrite.mockClear();
  mockPackageInfoDependencies.mockClear();
});

it('should update tramvai deps to latest versions', async () => {
  mockPackageJson = {
    dependencies: {
      '@tramvai/core': '1.93.2',
      '@tramvai/module-common': '1.93.2',
      '@tinkoff/router': '^0.2.3',
      '@tinkoff/url': '0.3.2',
    },
    devDependencies: {
      '@tramvai/cli': '1.93.2',
    },
    peerDependencies: {
      '@tinkoff/dippy': '0.7.10',
    },
  };

  mockPackageInfoDependencies.mockImplementation((dep) => {
    switch (dep) {
      case '@tramvai/core@1.115.6':
        return { '@tinkoff/dippy': '0.7.44', '@tinkoff/utils': '^2.1.0' };
      case '@tramvai/module-common@1.115.6':
        return {
          '@tinkoff/error': '0.6.1',
          '@tinkoff/url': '0.4.1',
        };
      case '@tramvai/cli@1.115.6':
        return {};
      case '@tramvai/module-router@1.115.6':
        return {
          '@tinkoff/router': '0.4.3',
          '@tinkoff/url': '0.4.1',
        };
    }

    return {};
  });

  await updatePackageJson(LATEST_TRAMVAI_VERSION);

  expect(mockFsWrite.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "package.json",
      "{
      \\"dependencies\\": {
        \\"@tramvai/core\\": \\"1.115.6\\",
        \\"@tramvai/module-common\\": \\"1.115.6\\",
        \\"@tinkoff/router\\": \\"0.4.3\\",
        \\"@tinkoff/url\\": \\"0.4.1\\"
      },
      \\"devDependencies\\": {
        \\"@tramvai/cli\\": \\"1.115.6\\"
      },
      \\"peerDependencies\\": {
        \\"@tinkoff/dippy\\": \\"0.7.44\\"
      }
    }",
    ]
  `);
});
