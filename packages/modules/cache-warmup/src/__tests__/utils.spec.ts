import { queueRequests, sendWarmUpRequest } from '../utils';
import { startMockServer } from '../../../../../test/utils/simpleMockServer';

const flushPromises = () => new Promise(setImmediate);

describe('warmup/utils', () => {
  describe('queueRequests', () => {
    beforeEach(() => {});

    it('makes max N requests at the time', async () => {
      const requestsOptions = [1000, 1500, 1500, 1000];
      const makeRequest = jest.fn(
        (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))
      );
      const max = 3;

      const result = queueRequests({ makeRequest, requestsOptions, maxSimultaneous: max });

      expect(makeRequest).toHaveBeenCalledTimes(3);

      jest.advanceTimersByTime(500);

      expect(makeRequest).toHaveBeenCalledTimes(3);

      jest.advanceTimersByTime(500);
      await flushPromises();

      expect(makeRequest).toHaveBeenCalledTimes(4);

      jest.runAllTimers();

      await expect(result).resolves.toEqual([
        { option: 1000, result: 'resolved' },
        { option: 1500, result: 'resolved' },
        { option: 1500, result: 'resolved' },
        { option: 1000, result: 'resolved' },
      ]);
    });

    it("doesn't crash if promises start getting rejected", async () => {
      const requestsOptions = [1500, 1500, 1000, 2000];
      const makeRequest = jest.fn(
        (timeout: number) =>
          new Promise((resolve, reject) => setTimeout(timeout >= 1500 ? reject : resolve, timeout))
      );
      const max = 2;

      const result = queueRequests({ makeRequest, requestsOptions, maxSimultaneous: max });

      expect(makeRequest).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(1500);
      await flushPromises();

      expect(makeRequest).toHaveBeenCalledTimes(4);

      jest.runAllTimers();

      await expect(result).resolves.toEqual([
        { option: 1500, result: 'rejected' },
        { option: 1500, result: 'rejected' },
        { option: 1000, result: 'resolved' },
        { option: 2000, result: 'rejected' },
      ]);
    });
  });

  describe('sendWarmUpRequest', () => {
    it('should follow redirects', async () => {
      const mockHandler = jest.fn();

      const { port, terminate } = await startMockServer((app) => {
        app.get('*', (req, res) => {
          mockHandler(req.path);

          if (req.path === '/test') {
            return res.redirect('/test/');
          }

          res.end();
        });
      });

      await sendWarmUpRequest({
        url: `http://localhost:${port}/test`,
      });

      expect(mockHandler).toHaveBeenCalledWith('/test');
      expect(mockHandler).toHaveBeenCalledWith('/test/');

      await terminate();
    });
  });
});
