import type { Mocker } from '@tinkoff/mocker';
import type { wrapPapi } from './papi';

interface Options {
  papi: ReturnType<typeof wrapPapi>;
}

const MOCKER_API_PATH = 'mocker-api';

export const wrapMocker = ({ papi }: Options): Pick<Mocker, 'addMocks' | 'removeMocks'> => {
  return {
    addMocks(api, mocks) {
      return papi.publicPapi
        .post(`${MOCKER_API_PATH}/mocks`)
        .send({
          api,
          mocks,
        })
        .expect(200);
    },
    removeMocks(api, mocks) {
      return papi.publicPapi
        .delete(`${MOCKER_API_PATH}/mocks`)
        .send({
          api,
          mocks,
        })
        .expect(200);
    },
  };
};
