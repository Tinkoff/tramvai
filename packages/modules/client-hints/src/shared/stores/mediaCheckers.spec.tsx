import { fromClientHints, isSupposed, isRetina } from './mediaCheckers';

const defaultMedia = {
  width: 1024,
  height: 768,
  isTouch: false,
  retina: false,
  supposed: false,
  synchronized: false,
};

describe('@tramvai/module-client-hints - методы для проверки media', () => {
  it('метод fromClientHints проходит проверку при synchronized = true', () => {
    expect(
      fromClientHints({
        ...defaultMedia,
        synchronized: true,
      })
    ).toBe(true);
  });

  it('метод fromClientHints не проходит проверку при synchronized = false', () => {
    expect(
      fromClientHints({
        ...defaultMedia,
        synchronized: false,
      })
    ).toBe(false);
  });

  it('метод isSupposed проходит проверку при supposed = true', () => {
    expect(
      isSupposed({
        ...defaultMedia,
        supposed: true,
      })
    ).toBe(true);
  });

  it('метод isSupposed не проходит проверку при supposed = false', () => {
    expect(
      isSupposed({
        ...defaultMedia,
        supposed: false,
      })
    ).toBe(false);
  });

  it('метод isRetina проходит проверку при retina = true', () => {
    expect(
      isRetina({
        ...defaultMedia,
        retina: true,
      })
    ).toBe(true);
  });

  it('метод isRetina не проходит проверку при retina = false', () => {
    expect(
      isRetina({
        ...defaultMedia,
        retina: false,
      })
    ).toBe(false);
  });
});
