import { safeStringify } from './safeStringify';

describe('utils/safeStringify', () => {
  const sample = {
    s: 'Как быстро\u2028 открыть расчетный \u2029счет для ИП?<script>var a=5;</script>',
  };

  it('replaces 0x2028 and 0x2029 unicode chars to their corresponding abbreviations', () => {
    const result = safeStringify(sample);
    const matchBadUnicode = expect.stringMatching(/[\u2028-\u2029<]/);

    expect(result).not.toEqual(matchBadUnicode);
    expect(sample.s).toEqual(matchBadUnicode);
  });

  it('only 0x2028 text', () => {
    const result = safeStringify({ j: 'Как быстро\u2028 открыть' });
    const matchBadUnicode = expect.stringMatching(/[\u2028-\u2029]/);

    expect(result).not.toEqual(matchBadUnicode);
    expect(sample.s).toEqual(matchBadUnicode);
  });

  it("don't modify original object in the end", () => {
    expect(JSON.parse(safeStringify(sample))).toEqual(sample);
  });

  it("don't have xss", () => {
    expect(safeStringify(sample)).toMatchInlineSnapshot(
      `"{"s":"Как быстро\\u2028 открыть расчетный \\u2029счет для ИП?\\u003Cscript>var a=5;\\u003C/script>"}"`
    );
  });

  it('simple example without transform', () => {
    expect(
      safeStringify({ store: { route: { href: 'dsa.com' }, future: { a: true } } })
    ).toMatchInlineSnapshot(`"{"store":{"route":{"href":"dsa.com"},"future":{"a":true}}}"`);
  });
});
