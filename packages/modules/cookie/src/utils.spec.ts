import { calculateExpires, trimSubdomains } from './utils';

const DateConstructor = Date;

describe('cookie utils', () => {
  it('calculateExpires', () => {
    // @ts-ignore
    jest.spyOn(global, 'Date').mockImplementation((args: any) => {
      if (args) {
        return new DateConstructor(args);
      }
      return new DateConstructor('2020-03-06T15:00:00.478Z');
    });
    const currentDate = new Date();

    expect(calculateExpires()).toBeUndefined();
    expect(calculateExpires(25).toUTCString()).toEqual('Fri, 06 Mar 2020 15:00:25 GMT');
    expect(calculateExpires(currentDate)).toEqual(currentDate);
  });

  it('extractDomain', () => {
    expect(trimSubdomains('www.tinkoff.ru')).toBe('.tinkoff.ru');
    expect(trimSubdomains('test-state.tinkoff.ru:2020')).toBe('.tinkoff.ru');
    expect(trimSubdomains('localhost:3000')).toBe('localhost');
    expect(trimSubdomains('192.168.1.3')).toBe('192.168.1.3');
  });
});
