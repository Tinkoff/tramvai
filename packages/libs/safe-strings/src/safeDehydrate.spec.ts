import { safeDehydrate } from './safeDehydrate';

describe('utils/safeDehydrate', () => {
  const sample = {
    s: {
      test: 'abc',
      someString: "fawf 'fasf' fawf",
    },
  };

  it('should replace not allowed characters', () => {
    expect(safeDehydrate(sample)).toMatchInlineSnapshot(
      `"{"s":{"test":"abc","someString":"fawf \\'fasf\\' fawf"}}"`
    );
  });
});
