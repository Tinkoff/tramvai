import { createToken } from './createToken';

describe('createToken', () => {
  it('Создание токена без названия', () => {
    const token = createToken();

    expect(token).toEqual({
      name: expect.any(Symbol),
      isToken: true,
      isModernToken: true,
      options: {},
    });
    expect(token.toString()).toBe('token');
  });

  it('Создание токена', () => {
    const token = createToken('tok');

    expect(token).toEqual({
      name: expect.any(Symbol),
      isToken: true,
      isModernToken: true,
      options: {},
    });
    expect(token.toString()).toBe('tok');
  });

  it('Создание токена с типами', () => {
    interface A {
      a: 1;
    }
    const token = createToken<A>('tak');

    expect(token.toString()).toBe('tak');
  });

  it('Создание тока с опцияим', () => {
    const token = createToken('tuk', { multi: true });

    expect(token).toEqual({
      name: expect.any(Symbol),
      isToken: true,
      isModernToken: true,
      options: { multi: true },
    });
    expect(token.toString()).toBe('tuk');
  });
});
