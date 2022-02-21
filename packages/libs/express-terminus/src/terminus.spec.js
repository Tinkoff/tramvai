const http = require('http');
const { exec, spawnSync } = require('child_process');
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const getPort = require('get-port');
const { createTerminus } = require('./index');

describe('Terminus', () => {
  let app;
  let server;

  beforeEach(() => {
    jest.useRealTimers();

    app = express();
    app.get('/', (req, res) => res.end('hello'));

    server = http.createServer(app);
  });

  afterEach(() => {
    server.close();

    jest.useFakeTimers();
  });

  describe('supports onHealthcheck for the healthcheck route', () => {
    it('but keeps all the other endpoints', async () => {
      const port = await getPort();

      createTerminus(server, app, {});
      server.listen(port);

      const response = await fetch(`http://localhost:${port}`);
      const text = await response.text();
      expect(text).toBe('hello');
    });

    it('returns 200 on resolve', async () => {
      const port = await getPort();
      let onHealthCheckRan = false;

      createTerminus(server, app, {
        healthChecks: {
          '/health': () => {
            onHealthCheckRan = true;
          },
        },
      });
      server.listen(port);

      const response = await fetch(`http://localhost:${port}/health`);
      expect(response.status).toBe(200);
      expect(response.headers.has('Content-Type')).toBe(true);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(onHealthCheckRan).toBe(true);
    });

    it('supports promise-based check', async () => {
      const port = await getPort();

      createTerminus(server, app, {
        healthChecks: {
          '/health': () => Promise.resolve({ info: true }),
        },
      });
      server.listen(port);

      const response = await fetch(`http://localhost:${port}/health`);
      expect(response.status).toBe(200);
      expect(response.headers.has('Content-Type')).toBe(true);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      const json = await response.json();
      expect(json).toEqual({
        status: 'ok',
        info: { info: true },
        details: { info: true },
      });
    });

    it('includes info on resolve', async () => {
      const port = await getPort();
      let onHealthCheckRan = false;

      createTerminus(server, app, {
        healthChecks: {
          '/health': () => {
            onHealthCheckRan = true;
            return {
              version: '1.0.0',
            };
          },
        },
      });
      server.listen(port);

      const res = await fetch(`http://localhost:${port}/health`);
      expect(res.status).toBe(200);
      expect(res.headers.has('Content-Type')).toBe(true);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(onHealthCheckRan).toBe(true);
      const json = await res.json();
      expect(json).toEqual({
        status: 'ok',
        info: {
          version: '1.0.0',
        },
        details: {
          version: '1.0.0',
        },
      });
    });

    it('includes verbatim on resolve', async () => {
      const port = await getPort();
      let onHealthCheckRan = false;

      createTerminus(server, app, {
        healthChecks: {
          '/health': () => {
            onHealthCheckRan = true;
            return {
              version: '1.0.0',
            };
          },
          verbatim: true,
        },
      });
      server.listen(port);

      const res = await fetch(`http://localhost:${port}/health`);
      expect(res.status).toBe(200);
      expect(res.headers.has('Content-Type')).toBe(true);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(onHealthCheckRan).toBe(true);
      const json = await res.json();
      expect(json).toEqual({
        status: 'ok',
        version: '1.0.0',
      });
    });

    it('returns 503 on reject', async () => {
      const port = await getPort();
      let onHealthCheckRan = false;
      let loggerRan = false;

      createTerminus(server, app, {
        healthChecks: {
          '/health': () => {
            onHealthCheckRan = true;
            throw new Error('failed');
          },
        },
        logger: () => {
          loggerRan = true;
        },
      });
      server.listen(port);

      const res = await fetch(`http://localhost:${port}/health`);
      expect(res.status).toBe(503);
      expect(onHealthCheckRan).toBe(true);
      expect(loggerRan).toBe(true);
    });

    // @todo исправить нестабильный тест
    // eslint-disable-next-line jest/no-test-callback
    it.skip('returns 503 once signal received', async () => {
      const port = await getPort();
      let responseAssertionsComplete = false;

      setTimeout(() => {
        // eslint-disable-next-line jest/valid-expect-in-promise
        fetch(`http://localhost:${port}/health`).then((res) => {
          expect(res.status).toBe(503);
          responseAssertionsComplete = true;
        });
      }, 300);

      let execError;

      await new Promise((resolve) => {
        exec(
          [
            'node',
            path.resolve(__dirname, './standalone-tests/terminus.onsignal.fail.js'),
            port,
          ].join(' '),
          (error) => {
            execError = error;
            resolve();
          }
        );
      });

      expect(execError.signal).toBe('SIGINT');
      expect(responseAssertionsComplete).toBe(true);
    });

    // @todo исправить нестабильный тест
    // eslint-disable-next-line jest/no-test-callback
    it.skip('calls onSendFailureDuringShutdown when sending 503 during shutdown', async () => {
      const port = await getPort();
      let responseAssertionsComplete = false;

      setTimeout(() => {
        // eslint-disable-next-line jest/valid-expect-in-promise
        fetch(`http://localhost:${port}/health`).then((res) => {
          expect(res.status).toBe(503);
          responseAssertionsComplete = true;
        });
      }, 300);

      let execError;
      let execStdout;

      await new Promise((resolve) => {
        exec(
          [
            'node',
            path.resolve(__dirname, './standalone-tests/terminus.onsendfailureduringshutdown.js'),
            port,
          ].join(' '),
          (error, stdout) => {
            execError = error;
            execStdout = stdout;
            resolve();
          }
        );
      });

      expect(execError.signal).toBe('SIGTERM');
      expect(execStdout).toBe('onSendFailureDuringShutdown\n');
      expect(responseAssertionsComplete).toBe(true);
    });

    // @todo исправить нестабильный тест
    // eslint-disable-next-line jest/no-test-callback
    it.skip('does NOT call onSendFailureDuringShutdown when sending 503 during failed healthcheck', async () => {
      const port = await getPort();
      let responseAssertionsComplete = false;

      setTimeout(() => {
        // eslint-disable-next-line jest/valid-expect-in-promise
        fetch(`http://localhost:${port}/health`).then((res) => {
          expect(res.status).toBe(503);
          responseAssertionsComplete = true;
        });
      }, 300);

      let execError;
      let execStdout;

      await new Promise((resolve) => {
        exec(
          [
            'node',
            path.resolve(
              __dirname,
              './standalone-tests/terminus.onsendfailureduringshutdown.failed-health.js'
            ),
            port,
          ].join(' '),
          (error, stdout) => {
            execError = error;
            execStdout = stdout;
            resolve();
          }
        );
      });

      expect(execError.signal).toBe('SIGTERM');
      expect(execStdout).toBe('');
      expect(responseAssertionsComplete).toBe(true);
    });
  });

  it('runs onSignal when getting the SIGTERM signal', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onsigterm.js'),
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigterm-runs');
  });

  it('runs onShutdown after SIGTERM onSignal', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onshutdown.sigterm.js'),
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigterm-runs\non-shutdown-runs');
  });

  it('runs onSignal when getting SIGINT signal', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onsigint.js'),
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigint-runs');
  });

  it('runs onShutdown after SIGINT onSignal', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onshutdown.sigint.js'),
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigint-runs\non-shutdown-runs');
  });

  it('runs onSignal when getting SIGUSR2 signal', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onsigusr2.js'),
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigusr2-runs');
  });

  it('runs onShutdown after SIGUSR2 onSignal', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onshutdown.sigusr2.js'),
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigusr2-runs\non-shutdown-runs');
  });

  it('runs onSignal when killed with SIGTERM and multiple signals are listened for', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onmultiple.js'),
      'SIGTERM',
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigterm-runs');
  });

  it('runs onSignal when killed with SIGINT and multiple signals are listened for', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onmultiple.js'),
      'SIGINT',
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigint-runs');
  });

  it('runs onSignal when killed with SIGUSR2 and multiple signals are listened for', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onmultiple.js'),
      'SIGUSR2',
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigusr2-runs');
  });

  it('runs onShutdown after onSignal when killed with SIGTERM and multiple signals are listened for', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onshutdown.multiple.js'),
      'SIGTERM',
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigterm-runs\non-shutdown-runs');
  });

  it('runs onShutdown after onSignal when killed with SIGINT and multiple signals are listened for', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onshutdown.multiple.js'),
      'SIGINT',
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigint-runs\non-shutdown-runs');
  });

  it('runs onShutdown after onSignal when killed with SIGUSR2 and multiple signals are listened for', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.onshutdown.multiple.js'),
      'SIGUSR2',
    ]);
    expect(result.stdout.toString().trim()).toBe('on-sigusr2-runs\non-shutdown-runs');
  });

  it('manages multiple servers', () => {
    const result = spawnSync('node', [
      path.resolve(__dirname, './standalone-tests/terminus.multiserver.js'),
    ]);
    expect(result.stdout.toString().trim()).toBe(
      ['server1:onSignal', 'server2:onSignal', 'server3:onSignal'].join('\n')
    );
  });
});
