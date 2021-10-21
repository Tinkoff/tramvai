import { withParser } from 'jscodeshift';
import { addImport, removeImport, findImport } from './import';

const j = withParser('tsx');

describe('migration/utils/transform/import', () => {
  it('should add import', async () => {
    const parsed = j(`
console.log('aaa')
`);

    addImport.call(
      parsed,
      j.importDeclaration(
        [j.importSpecifier(j.identifier('testComponent'), j.identifier('testComponent'))],
        j.literal('@tramvai/test')
      )
    );

    expect(parsed.toSource()).toMatchInlineSnapshot(`
"
import { testComponent } from \\"@tramvai/test\\";
console.log('aaa')
"
`);
  });

  it('should extend already existing import source', async () => {
    const parsed = j(`
import { testAction } from '@tramvai/test';

console.log('aaa')
`);

    addImport.call(
      parsed,
      j.importDeclaration(
        [j.importSpecifier(j.identifier('testComponent'), j.identifier('testComponent'))],
        j.literal('@tramvai/test')
      )
    );

    expect(parsed.toSource()).toMatchInlineSnapshot(`
"
import { testAction, testComponent } from '@tramvai/test';

console.log('aaa')
"
`);
  });

  it('should not add already existing import', async () => {
    const parsed = j(`
import { testComponent, testAction } from '@tramvai/test';

console.log('aaa')
`);

    addImport.call(
      parsed,
      j.importDeclaration(
        [j.importSpecifier(j.identifier('testComponent'), j.identifier('testComponent'))],
        j.literal('@tramvai/test')
      )
    );

    expect(parsed.toSource()).toMatchInlineSnapshot(`
"
import { testComponent, testAction } from '@tramvai/test';

console.log('aaa')
"
`);
  });

  it('should add additional import', async () => {
    const parsed = j(`
import { testComponent as tc, testAction } from '@tramvai/test';

console.log('aaa')
`);

    addImport.call(
      parsed,
      j.importDeclaration(
        [j.importSpecifier(j.identifier('testComponent'), j.identifier('testComponent'))],
        j.literal('@tramvai/test')
      )
    );

    expect(parsed.toSource()).toMatchInlineSnapshot(`
"
import { testComponent as tc, testAction, testComponent } from '@tramvai/test';

console.log('aaa')
"
`);
  });

  it('should remove import', async () => {
    const parsed = j(`import { foo } from "@tramvai/foo";
import { bar } from "@tramvai/bar";`);

    removeImport.call(parsed, '@tramvai/bar');

    expect(parsed.toSource()).toMatchInlineSnapshot(`"import { foo } from \\"@tramvai/foo\\";"`);
  });

  it('should find import', async () => {
    const parsed = j(`import { foo } from "@tramvai/foo";
import { bar } from "@tramvai/bar";`);

    expect(
      findImport.call(
        parsed,
        j.importDeclaration([j.importSpecifier(j.identifier('foo'))], j.literal('@tramvai/foo'))
      )
    ).toBe(true);
    expect(findImport.call(parsed, j.importDeclaration([], j.literal('@tramvai/foo')))).toBe(true);
    expect(
      findImport.call(
        parsed,
        j.importDeclaration([j.importSpecifier(j.identifier('bar'))], j.literal('@tramvai/foo'))
      )
    ).toBe(false);
  });
});
