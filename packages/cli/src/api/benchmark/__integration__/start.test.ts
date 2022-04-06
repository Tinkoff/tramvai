import { resolve } from 'path';
import { benchmark } from '@tramvai/cli';

const FIXTURES_DIR = resolve(__dirname, '__fixtures__');

jest.useRealTimers();
jest.setTimeout(120000);

const matchStats = {
  samples: expect.any(Array),
  mean: expect.any(Number),
  std: expect.any(Number),
  variance: expect.any(Number),
};
const matchFullStats = {
  client: matchStats,
  server: matchStats,
};

describe('@tramvai/cli benchmark command', () => {
  describe('application', () => {
    it('should benchmark application start command', async () => {
      const result = await benchmark({
        command: 'start',
        commandOptions: {
          rootDir: FIXTURES_DIR,
          target: 'app',
          resolveSymlinks: false,
          port: 0,
          staticPort: 0,
        },
        times: 2,
      });

      expect(result).toMatchObject({
        cache: matchFullStats,
        noCache: matchFullStats,
        rebuild: matchFullStats,
      });
    });
  });
});
