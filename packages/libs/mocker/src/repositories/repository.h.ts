import type { Mock } from '../mocker.h';

export interface MockRepository {
  get(api: string, endpoint: string): Promise<Mock>;
  getAll(): Promise<Record<string, Record<string, Mock>>>;
  add(api: string, endpoint: string, mock: Mock): Promise<void>;
  delete(api: string, endpoint: string): Promise<void>;
}

export interface FSMock {
  api: string;
  mocks: Record<string, Mock>;
}

export interface FSMockRepositoryOptions {
  cwd?: string;
  root?: string;
}
