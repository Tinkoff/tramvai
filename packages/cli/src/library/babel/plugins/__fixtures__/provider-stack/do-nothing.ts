export const providers = [
  {
    provide: 'test',
  },
  {
    provide: 'a',
    a: 'a',
  },
  {
    useClass: 'test',
    b: 'b',
  },
  {
    useValue: 'c',
  },
];
