import fs from 'fs';
import path from 'path';
import tinkoffBrowsersListConfig from '@tinkoff/browserslist-config';
import { satisfies } from '../satisfies';

function readDataset(p: string) {
  return fs
    .readFileSync(path.join(__dirname, 'uaDatasets', p), 'utf-8')
    .split('\n')
    .map((s) => s.trim());
}

function getDatasetLineLink(line: number, file: string) {
  return `${path.join(__dirname, 'uaDatasets', file)}:${line}`;
}

function testDatasets(datasetFiles: string[] = [], res: boolean | null, browsersListConfig?: any) {
  datasetFiles.forEach((f) => {
    const userAgents = readDataset(f);

    userAgents.forEach((ua, i) => {
      if (!ua) {
        return;
      }

      it(`${ua}`, () => {
        try {
          expect(satisfies(ua, browsersListConfig)).toBe(res);
        } catch (e: any) {
          e.message += `\n\n${ua}\n${getDatasetLineLink(i + 1, f)}\n`;

          throw e;
        }
      });
    });
  });
}

describe('user-agent/satisfies', () => {
  describe('default options from @tinkoff/browserslist-config', () => {
    describe('supported', () => {
      testDatasets(['supported.txt'], true);
    });

    describe('not supported', () => {
      testDatasets(['not_supported.txt'], false);
    });

    describe('unknown', () => {
      testDatasets(['unknown.txt', 'bots.txt'], null);
    });
  });
});

describe('user-agent/satisfies modern2', () => {
  describe('supported modern', () => {
    testDatasets(['supported_modern.txt'], true, tinkoffBrowsersListConfig.modern);
  });

  describe('not supported modern', () => {
    testDatasets(['not_supported_modern.txt'], false, tinkoffBrowsersListConfig.modern);
  });
});
