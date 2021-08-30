import { safeStringify } from './safeStringify';

describe('utils/safeStringify', () => {
  const sample = {
    s: 'Как быстро\u2028 открыть расчетный \u2029счет для ИП?<script>var a=5;</script>',
  };

  it('replaces 0x2028 and 0x2029 unicode chars to their corresponding abbreviations', () => {
    const result = safeStringify(sample);
    const matchBadUnicode = expect.stringMatching(/[\u2028-\u2029><]/);

    expect(result).not.toEqual(matchBadUnicode);
    expect(sample.s).toEqual(matchBadUnicode);
  });

  it("don't modify original object in the end", () => {
    expect(JSON.parse(safeStringify(sample))).toEqual(sample);
  });
});
