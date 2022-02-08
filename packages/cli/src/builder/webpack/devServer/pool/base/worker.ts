// @ts-ignore
import { Module } from 'module';
import { Server } from 'net';
import path from 'path';

declare module 'net' {
  interface Server {
    __tramvai_cli_port?: number;
  }
}

export const installServerWrapper = (onListen: (port: number) => void) => {
  const originalListen = Server.prototype.listen;
  const originalAddress = Server.prototype.address;

  const envPort = process.env.PORT;

  // переопределяем то, на каком порту будет запущен сервер приложения
  // если этот порт это тот на котором запущен прокси-сервер, то переопределяем порт на любой свободный
  // если это какой-то другой порт - просто игнорим, это не наш кейс
  Server.prototype.listen = function listen(this: Server, opts?: any, ...args) {
    let hasPort = false;

    if (`${opts}` === envPort) {
      hasPort = true;
      this.__tramvai_cli_port = opts;
      originalListen.call(this, 0, ...args);
    } else if (`${opts?.port}` === envPort) {
      hasPort = true;
      this.__tramvai_cli_port = opts.port;
      originalListen.call(this, { ...opts, port: 0 }, ...args);
    }

    if (hasPort) {
      this.once('listening', () => {
        onListen((this.address() as any).__tramvai_cli_port);
      });

      return this;
    }

    return originalListen.call(this, opts, ...args);
  };

  // переопределяем что возвращает address в тех случаях когда подменяем порт
  // чтобы приложение думало что оно запущено на порту из настроек cli
  Server.prototype.address = function address(this: Server) {
    const addr = originalAddress.call(this);

    if (typeof this.__tramvai_cli_port !== 'undefined') {
      return {
        ...addr,
        __tramvai_cli_port: addr.port,
        port: +envPort,
      };
    }

    return addr;
  };
};

export const requireFromString = (code: string, filename: string) => {
  const newModule = new Module(filename, module.parent);

  newModule.filename = filename;
  newModule.paths = (Module as any)._nodeModulePaths(path.dirname(filename));
  (newModule as any)._compile(code, filename);

  return newModule.exports;
};
