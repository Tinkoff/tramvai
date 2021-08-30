import { ComponentRegistry } from './componentRegistry';

describe('componentRegistry', () => {
  it('should store components by bundle', () => {
    const cr = new ComponentRegistry();
    const cmp1 = 'cpm1';
    const cmp2 = 'cmp2';
    const cmp3 = 'cmp3';
    const cmp4 = 'cmp4';
    const bundle = 'bundle';
    const otherBundle = 'other_bundle';

    cr.add('a', cmp1, bundle);
    cr.add('a', cmp2);
    cr.add('b', cmp3, bundle);
    cr.add('c', cmp4);

    expect(cr.get('a', bundle)).toBe(cmp1);
    expect(cr.get('a')).toBe(cmp2);

    expect(cr.get('b')).toBeUndefined();
    expect(cr.get('b', bundle)).toBe(cmp3);

    expect(cr.get('c')).toBe(cmp4);
    expect(cr.get('c', bundle)).toBe(cmp4);
    expect(cr.get('c', otherBundle)).toBe(cmp4);
  });
});
