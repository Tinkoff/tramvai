import { external } from './external';
import { testNested } from './nested/foo.server';

console.log(testNested);

export const foo = `bar ${external}`;
