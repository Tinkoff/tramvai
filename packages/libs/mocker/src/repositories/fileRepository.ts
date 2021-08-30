import eachObj from '@tinkoff/utils/object/each';
import { resolve } from 'path';
import glob from 'fast-glob';
import type { Mock } from '../mocker.h';
import type { MockRepository, FSMockRepositoryOptions, FSMock } from './repository.h';

export class FileSystemMockRepository implements MockRepository {
  private cwd: string;
  private root: string;

  private mocks: Record<string, Record<string, Mock>>;

  constructor(options: FSMockRepositoryOptions = {}) {
    const { cwd = process.cwd(), root = 'mocks' } = options;

    this.cwd = cwd;
    this.root = root;
  }

  async getAll() {
    if (!this.mocks) {
      this.mocks = await this.readMocks();
    }

    return this.mocks;
  }

  async get(api: string, endpoint: string) {
    return this.getAll()[api]?.[endpoint];
  }

  async add(api: string, endpoint: string, mock: Mock) {
    // @todo implement
  }

  async delete(api: string, endpoint: string) {
    // @todo implement
  }

  private async readMocks() {
    const mocks: Record<string, Record<string, Mock>> = {};
    const rootFolderPath = resolve(this.cwd, this.root);

    const mocksFiles = await glob(`**/*.{js,json}`, {
      cwd: rootFolderPath,
    });

    for (const mocksFile of mocksFiles) {
      const fsMock: FSMock = runtimeRequire(resolve(rootFolderPath, mocksFile));

      mocks[fsMock.api] = mocks[fsMock.api] ?? {};

      eachObj((mock, methodAndUrl) => {
        mocks[fsMock.api][methodAndUrl] = mock;
      }, fsMock.mocks);
    }

    return mocks;
  }
}

// @todo implement RemoteMockRepository

// @todo implement InMemoryMockRepository

function runtimeRequire(path: string) {
  try {
    const requireFunc =
      // @ts-ignore
      typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;

    return requireFunc(path);
  } catch (e) {
    return null;
  }
}
