type Callback = (payload: any) => void;

export class EventEmitter {
  handlers: Map<string, Set<Callback>> = new Map();

  on(event: string, cb: Callback) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(cb);
  }

  off(event: string, cb: Callback) {
    if (this.handlers.has(event)) {
      this.handlers.get(event)!.delete(cb);
    }
  }

  emit(event: string, payload: any) {
    if (this.handlers.has(event)) {
      this.handlers.get(event)!.forEach((cb) => cb(payload));
    }
  }
}
