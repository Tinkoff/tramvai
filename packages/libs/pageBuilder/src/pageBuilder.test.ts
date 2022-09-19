import { buildPage } from './pageBuilder';
import { dynamicRender, staticRender } from '../lib';
import { StorageRecord } from './constants/records';

const BODY_START = 'body:start';

describe('PageBuilder', () => {
  test('base case', async () => {
    const description = [staticRender('<!DOCTYPE html>'), dynamicRender(BODY_START)];

    const result = buildPage({
      description,
      slotHandlers: {
        [BODY_START]: [
          {
            type: StorageRecord.asIs,
            payload: `<div>MY APP</div>`,
          },
        ],
      },
    });

    expect(result).toMatchInlineSnapshot(`"<!DOCTYPE html><div>MY APP</div>"`);
  });
});
