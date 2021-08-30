import fs from 'fs';
import path from 'path';

describe('requestManager', () => {
  it('should emit not inlined typing for express request', () => {
    const compilationResult = fs.readFileSync(
      path.join(__dirname, '..', 'lib', 'requestManager.d.ts'),
      'utf-8'
    );
    expect(compilationResult).toContain('export declare const REQUEST: RequestExt');
    expect(compilationResult).toContain("import type { Request } from 'express'");
  });
});
