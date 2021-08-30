import { createRequest } from 'node-mocks-http';
import { fillHeaderIp, fillHeaders } from './fillHeaders';
import { RequestManager } from '../../../common/src/requestManager/requestManager';

describe('http-client/utils/fillHeaders', () => {
  it('fillHeaderIp', () => {
    const ip = '348.348.348.348';
    const request = createRequest({
      headers: {
        'x-real-ip': ip,
      },
    });
    const requestManager = new RequestManager({ request });
    const params = { a: 1, b: 2, headers: { myHeader: '123' } };

    expect(fillHeaderIp({ requestManager })(params)).toEqual({
      a: 1,
      b: 2,
      headers: {
        myHeader: '123',
        'X-real-ip': ip,
      },
    });
  });

  it('fillHeaders', () => {
    const headersList = ['a', 'c'];
    const request = createRequest({
      headers: {
        a: 'a',
        b: 'b',
        c: 'c',
      },
    });
    const requestManager = new RequestManager({ request });
    const params = { a: 1, b: 2, headers: { myHeader: '123' } };

    expect(fillHeaders({ requestManager, headersList })(params)).toEqual({
      a: 1,
      b: 2,
      headers: {
        myHeader: '123',
        a: 'a',
        c: 'c',
      },
    });
  });
});
