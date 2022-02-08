import type { EventEmitter } from 'events';
import type { Container } from '@tinkoff/dippy';

export interface Worker extends EventEmitter {
  on(event: 'exit', listener: (code: number, signal: string) => void): this;
}

export interface WorkerMessages {
  script: { script: Buffer; filename: string };
}
export interface WorkerBridge<T extends Worker> {
  setup(): Promise<void>;
  create(): Promise<T>;
  destroy(worker: T): Promise<void>;

  send<U extends keyof WorkerMessages>(
    worker: T,
    type: U,
    message: WorkerMessages[U]
  ): Promise<void>;
}

export interface WorkerBridgeFactory<T extends Worker> {
  (di: Container): WorkerBridge<T>;
}
