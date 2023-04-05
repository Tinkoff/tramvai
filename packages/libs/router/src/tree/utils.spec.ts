import { PartType } from './types';
import { getParts, parse, makePath } from './utils';

describe('router/tree/utils', () => {
  describe('getParts', () => {
    it('simple cases', () => {
      expect(getParts('/')).toEqual([]);
      expect(getParts('/a')).toEqual(['a']);
      expect(getParts('/a/')).toEqual(['a']);
      expect(getParts('/a/b')).toEqual(['a', 'b']);
      expect(getParts('/a/b/')).toEqual(['a', 'b']);
      expect(getParts('/a/b/c')).toEqual(['a', 'b', 'c']);
      expect(getParts('/*')).toEqual(['*']);
      expect(getParts('*')).toEqual(['*']);
      expect(getParts('/inner/*/')).toEqual(['inner', '*']);
    });

    it('complex', () => {
      expect(getParts('/*')).toEqual(['*']);
      expect(getParts('/test/a/*')).toEqual(['test', 'a', '*']);
      expect(getParts('/abc/<history-fallback>')).toEqual(['abc', '<history-fallback>']);
      expect(getParts('/a/pref:dynamic(d+):end/test')).toEqual([
        'a',
        'pref:dynamic(d+):end',
        'test',
      ]);
    });
  });

  describe('parse', () => {
    it('simple cases', () => {
      expect(parse('abc')).toEqual({ type: PartType.literal, value: 'abc' });
      expect(parse('test')).toEqual({ type: PartType.literal, value: 'test' });
      expect(parse('<history-fallback>')).toEqual({ type: PartType.historyFallback });
      expect(parse('*')).toEqual({ type: PartType.wildcard });
    });

    it('with parameter', () => {
      expect(parse(':test')).toEqual({
        type: PartType.parameter,
        paramName: 'test',
        optional: false,
      });
      expect(parse(':test:')).toEqual({
        type: PartType.parameter,
        paramName: 'test',
        optional: false,
      });
      expect(parse('pref:ab?')).toEqual({
        type: PartType.parameter,
        paramName: 'ab',
        regexp: /^pref(.+)?$/,
        optional: false,
      });
      expect(parse(':test(\\d{3,})')).toEqual({
        type: PartType.parameter,
        paramName: 'test',
        regexp: /^(\d{3,})$/,
        optional: false,
      });
      expect(parse(':test?')).toEqual({
        type: PartType.parameter,
        paramName: 'test',
        optional: true,
      });
      expect(parse('prefix-:id([a-d]+)?:-me')).toEqual({
        type: PartType.parameter,
        paramName: 'id',
        regexp: /^prefix-([a-d]+)?-me$/,
        optional: false,
      });
    });

    it('literal looks like parameter', () => {
      expect(parse('test:')).toEqual({
        type: PartType.literal,
        value: 'test:',
      });
      expect(parse(':')).toEqual({
        type: PartType.literal,
        value: ':',
      });
    });
  });

  describe('makePath', () => {
    it('simple cases', () => {
      expect(makePath('/', {})).toBe('/');
      expect(makePath('/a/b/c', {})).toBe('/a/b/c');
      expect(makePath('/test/a', { a: '1' })).toBe('/test/a');
    });

    it('special cases', () => {
      expect(() => makePath('/a/b/*', {})).toThrow();
      expect(() => makePath('/<history-fallback>', {})).toThrow();
    });

    it('with params', () => {
      expect(() => makePath('/a/:b/c', {})).toThrow();
      expect(makePath('/a/:b/c', { b: '123' })).toBe('/a/123/c');
      expect(makePath('/:a/pref:b:pof/c', { a: '5', b: 'ABV' })).toBe('/5/prefABVpof/c');
      expect(makePath('/a/:b(\\d+)/c', { b: '444' })).toBe('/a/444/c');
      expect(() => makePath('/a/:b(\\d+)/c', { b: 'baf' })).toThrow();
      expect(makePath('/a/:b?/', { b: '23' })).toBe('/a/23/');
    });
  });
});
