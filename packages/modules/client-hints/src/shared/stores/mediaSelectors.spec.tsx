/**
 * @jest-environment jsdom
 */
import { createMockContext } from '@tramvai/test-mocks';
import { testHook } from '@tramvai/test-react';
import { createReducer } from '@tramvai/state';
import { useMedia, useFromClientHints, useIsSupposed, useIsRetina } from './mediaSelectors';
import { fromClientHints, isSupposed, isRetina } from './mediaCheckers';

jest.mock('./mediaCheckers');

const defaultMedia = {
  width: 1024,
  height: 768,
  isTouch: false,
  retina: false,
  supposed: false,
  synchronized: false,
};

describe('@tramvai/module-client-hints - селекторы для проверки media', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('хук useMedia возвращает содержимое стора media', () => {
    const context = createContext({ ...defaultMedia });
    const { result } = testHook(() => useMedia(), { context });

    expect(result.current).toStrictEqual(defaultMedia);
  });

  it('хук useFromClientHints возвращает результат метода fromClientHints, передавая в него media из контекста', () => {
    (fromClientHints as any).mockReturnValueOnce(true);

    const media = {
      ...defaultMedia,
      synchronized: true,
    };
    const context = createContext(media);
    const { result } = testHook(() => useFromClientHints(), { context });

    expect(fromClientHints).toHaveBeenCalledWith(media);
    expect(result.current).toBe(true);
  });

  it('хук useIsSupposed возвращает результат метода isSupposed, передавая в него media из контекста', () => {
    (isSupposed as any).mockReturnValueOnce(true);

    const media = {
      ...defaultMedia,
      supposed: true,
    };
    const context = createContext(media);
    const { result } = testHook(() => useIsSupposed(), { context });

    expect(isSupposed).toHaveBeenCalledWith(media);
    expect(result.current).toBe(true);
  });

  it('хук useIsRetina возвращает результат метода isRetina, передавая в него media из контекста', () => {
    (isRetina as any).mockReturnValueOnce(true);

    const media = {
      ...defaultMedia,
      retina: true,
    };
    const context = createContext(media);
    const { result } = testHook(() => useIsRetina(), { context });

    expect(isRetina).toHaveBeenCalledWith(media);
    expect(result.current).toBe(true);
  });
});

function createContext(mediaInitialState) {
  return createMockContext({
    stores: [createReducer('media', mediaInitialState)],
  });
}
