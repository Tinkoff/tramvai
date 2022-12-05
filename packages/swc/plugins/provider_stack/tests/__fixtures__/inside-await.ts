export const func = async () => {
  await Promise.resolve([
    {
      provide: 'a',
      useValue: 'a',
    },
    {
      provide: 'b',
      useValue: 'b',
    },
  ]);
}
