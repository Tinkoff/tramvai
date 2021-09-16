describe('pack-polyfills', () => {
  it('Инициализация полифилов', () => {
    expect(() => require('./index.ts')).not.toThrow();
  });
});
