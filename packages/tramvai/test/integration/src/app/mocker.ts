import type { Mocker } from '@tinkoff/mocker';
import type { wrapPapi } from './papi';

interface Options {
  papi: ReturnType<typeof wrapPapi>;
}

const MOCKER_API_PATH = 'mocker-api';

export const wrapMocker = ({ papi }: Options): Pick<Mocker, 'addMocks' | 'removeMocks'> => {
  return {
    addMocks(api, mocks) {
      return papi
        .publicPapi(`${MOCKER_API_PATH}/mocks`, {
          method: 'post',
          body: {
            api,
            mocks,
          },
        })
        .expect(200);
    },
    removeMocks(api, mocks) {
      return papi
        .publicPapi(`${MOCKER_API_PATH}/mocks`, {
          method: 'delete',
          body: {
            api,
            mocks,
          },
        })
        .expect(200);
    },
  };
};
