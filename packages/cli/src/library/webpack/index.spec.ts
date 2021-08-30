describe('external webpack config', () => {
  it('should return resolve config', () => {
    const config = require('./index');

    expect(config).toMatchObject({
      resolve: expect.objectContaining({
        alias: expect.any(Object),
        extensions: expect.any(Array),
        mainFields: expect.any(Array),
        modules: expect.any(Array),
      }),
    });
  });
});
