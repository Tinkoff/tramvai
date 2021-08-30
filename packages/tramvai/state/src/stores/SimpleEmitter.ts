type Listener = (...args: Array<any>) => void;
export class SimpleEmitter {
  listeners: Listener[] = [];
  emit(name?: string) {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  addListener(event: string, fn: Listener) {
    this.listeners.push(fn);
  }

  on(event: string, fn: Listener) {
    this.addListener(event, fn);
  }

  removeListener(event: string, fn: Listener) {
    const listeners = [];
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i] !== fn) {
        listeners.push(this.listeners[i]);
      }
    }
    this.listeners = listeners;
  }

  off(event: string, fn: Listener) {
    this.removeListener(event, fn);
  }
}
