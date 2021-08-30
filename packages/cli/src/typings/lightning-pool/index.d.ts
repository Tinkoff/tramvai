declare module 'lightning-pool' {
  export enum PoolState {
    IDLE,
    STARTED,
    CLOSING,
    CLOSED,
  }

  interface Pool<T> {
    start: () => Promise<void>;
    close: (force?: boolean) => Promise<void>;
    acquire: () => Promise<T>;
    release: (resource: T) => Promise<void>;
    destroy: (resource: T) => void;

    state: PoolState;
  }

  interface PoolFactory<T> {
    create: () => Promise<T>;
    destroy: (resource: T) => void;
    reset: (resource: T) => Promise<void>;
  }

  interface Options {
    min?: number;
    minIdle?: number;
    max?: number;
  }

  export function createPool<T>(factory: PoolFactory<T>, options: Options): Pool<T>;
}
