import { flushFiles } from './flushFiles';

const webpackStats = require('./__mocks__/stats.json');

describe('render/utils/flushFiles', () => {
  it('should return dependent chunks by default', () => {
    expect(flushFiles(['platform'], webpackStats).scripts).toMatchInlineSnapshot(`
      Array [
        "manifest.7fde3260cd45b71f40e4.js",
        "platform.8e8cf615482fa889494e.chunk.js",
      ]
    `);
    expect(flushFiles(['manifest', 'vendor'], webpackStats).scripts).toMatchInlineSnapshot(`
      Array [
        "manifest.7fde3260cd45b71f40e4.js",
        "vendor.fe87c85dfa655e250486.js",
      ]
    `);
    expect(flushFiles(['coin'], webpackStats).scripts).toMatchInlineSnapshot(`
      Array [
        "coin.43f21dd68938300fcd23.chunk.js",
      ]
    `);
  });

  it('should ignore dependent chunks if ignoreDependencies is set', () => {
    expect(flushFiles(['platform'], webpackStats, { ignoreDependencies: true }).scripts)
      .toMatchInlineSnapshot(`
      Array [
        "platform.8e8cf615482fa889494e.chunk.js",
      ]
    `);
    expect(flushFiles(['manifest', 'vendor'], webpackStats, { ignoreDependencies: true }).scripts)
      .toMatchInlineSnapshot(`
      Array [
        "manifest.7fde3260cd45b71f40e4.js",
        "vendor.fe87c85dfa655e250486.js",
      ]
    `);
    expect(flushFiles(['polyfill'], webpackStats, { ignoreDependencies: true }).scripts)
      .toMatchInlineSnapshot(`
      Array [
        "polyfill.3641dbc6ffbad3dd6966.chunk.js",
      ]
    `);
  });

  describe('ignore missing chunks', () => {
    it('should not warn about missing chunks by default', () => {
      expect(flushFiles(['random123', 'vendor'], webpackStats).scripts).toMatchInlineSnapshot(`
        Array [
          "vendor.fe87c85dfa655e250486.js",
        ]
      `);
    });
  });
});
