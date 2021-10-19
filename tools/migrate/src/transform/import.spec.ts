import { withParser } from 'jscodeshift';
import { addImport } from './import';

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
});
