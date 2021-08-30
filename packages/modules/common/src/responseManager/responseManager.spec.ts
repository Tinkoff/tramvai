import { ResponseManager } from './responseManager';

const createResponseManager = () => {
  return new ResponseManager();
};

describe('responseManager', () => {
  it('should set body', () => {
    const responseManager = createResponseManager();

    expect(responseManager.getBody()).toBe('');
    responseManager.setBody('lalala');
    expect(responseManager.getBody()).toBe('lalala');
  });

  it('should set headers', () => {
    const responseManager = createResponseManager();

    expect(responseManager.getHeaders()).toEqual({});

    responseManager.setHeader('a', '123');
    responseManager.setHeader('b', '456');

    expect(responseManager.getHeader('a')).toBe('123');
    expect(responseManager.getHeader('b')).toBe('456');
    expect(responseManager.getHeader('c')).toBeUndefined();
    expect(responseManager.getHeaders()).toEqual({ a: '123', b: '456' });
  });
});
