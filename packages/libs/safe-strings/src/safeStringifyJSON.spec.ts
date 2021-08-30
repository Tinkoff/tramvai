import { safeStringifyJSON } from './safeStringifyJSON';

describe('utils/safeStringifyJSON', () => {
  it('should work for simple json', () => {
    expect(safeStringifyJSON({ a: '1', b: 2 })).toMatchInlineSnapshot(
      `"{\\"a\\":\\"1\\",\\"b\\":2}"`
    );
    expect(safeStringifyJSON(24)).toMatchInlineSnapshot(`"24"`);
    expect(safeStringifyJSON(null)).toMatchInlineSnapshot(`"null"`);
  });

  it('should work for circular references', () => {
    const obj = { a: 1, b: [1, 2, 3] };

    (obj as any).c = { test: 'str', ref: obj };

    expect(safeStringifyJSON(obj)).toMatchInlineSnapshot(
      `"{\\"a\\":1,\\"b\\":[1,2,3],\\"c\\":{\\"test\\":\\"str\\",\\"ref\\":\\"[~Circular~]\\"}}"`
    );
  });
});
