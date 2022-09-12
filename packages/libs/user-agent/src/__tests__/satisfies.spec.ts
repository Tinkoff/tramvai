import fs from 'fs';
import path from 'path';
import tinkoffBrowsersListConfig from '@tinkoff/browserslist-config';
import { satisfies } from '../satisfies';

function readDataset(p) {
  return fs
    .readFileSync(path.join(__dirname, 'uaDatasets', p), 'utf-8')
    .split('\n')
    .map((s) => s.trim());
}

function getDatasetLineLink(line, file) {
  return `${path.join(__dirname, 'uaDatasets', file)}:${line}`;
}

function testDatasets(datasetFiles = [], res, browsersListConfig?) {
  datasetFiles.forEach((f) => {
    const userAgents = readDataset(f);

    userAgents.forEach((ua, i) => {
      if (!ua) {
        return;
      }

      it(`${ua}`, () => {
        try {
          expect(satisfies(ua, browsersListConfig)).toBe(res);
        } catch (e) {
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
    testDatasets(['supported_modern.txt'], true);
  });

  describe('not supported modern', () => {
    testDatasets(['not_supported_modern.txt'], false, tinkoffBrowsersListConfig.modern);
  });
});
