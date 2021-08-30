import fs from 'fs';
import { EOL } from 'os';

export function syncJsonFile({ path, newContent }): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(newContent, null, 4) + EOL, null, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
