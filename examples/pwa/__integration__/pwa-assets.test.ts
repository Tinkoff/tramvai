import path from 'path';
import fs from 'fs';
import { readJson } from 'fs-extra';
import { build } from '@tramvai/cli';

const contenthashPngRegexp = /\.([\w\d]+?)\.png/;

describe('packages/modules/pwa - assets', () => {
  let swFilename: string;
  let swModernFilename: string;
  let statsFilename: string;
  let statsModernFilename: string;
  let webmanifestFilename: string;
  let iconsFilenames: string[];

  beforeAll(async () => {
    await build({
      rootDir: path.resolve(__dirname, '../'),
      disableProdOptimization: true,
      target: 'pwa',
    });

    const distClientDirectory = path.resolve(__dirname, '../dist', 'client');

    swFilename = path.join(distClientDirectory, 'service-worker.js');
    swModernFilename = path.join(distClientDirectory, 'service-worker.modern.js');
    statsFilename = path.join(distClientDirectory, 'stats.json');
    statsModernFilename = path.join(distClientDirectory, 'stats.modern.json');
    webmanifestFilename = path.join(
      distClientDirectory,
      (await fs.promises.readdir(distClientDirectory)).find((filename) =>
        filename.endsWith('.webmanifest')
      )!
    );
    iconsFilenames = (await readJson(webmanifestFilename)).icons.map((icon: any) => {
      return icon.src.replace('http://localhost:4000/dist/client', distClientDirectory);
    });
  }, 250000);

  describe('Service Worker', () => {
    it('should be created', () => {
      expect(fs.existsSync(swFilename)).toBe(true);
    });

    it('should contain chunks from "include" parameter', () => {
      const swContent = fs.readFileSync(swFilename, 'utf-8');
      const statsContent: Record<string, any> = require(statsFilename);

      const chunks = ['react', 'platform', 'tramvai-workbox-window']
        .map((chunkname) => {
          return statsContent.assetsByChunkName[chunkname][0];
        })
        .concat(path.basename(webmanifestFilename));

      chunks.forEach((chunkname) => {
        expect(swContent.includes(chunkname)).toBe(true);
      });
    });
  });

  describe('modern Service Worker', () => {
    it('should be created', () => {
      expect(fs.existsSync(swModernFilename)).toBe(true);
    });

    it('should contain chunks from "include" parameter', () => {
      const swContent = fs.readFileSync(swModernFilename, 'utf-8');
      const statsContent: Record<string, any> = require(statsModernFilename);

      const chunks = ['react', 'platform', 'tramvai-workbox-window']
        .map((chunkname) => {
          return statsContent.assetsByChunkName[chunkname][0];
        })
        .concat(path.basename(webmanifestFilename));

      chunks.forEach((chunkname) => {
        expect(swContent.includes(chunkname)).toBe(true);
      });
    });
  });

  describe('Webmanifest', () => {
    let webmanifestContent: Record<string, any>;

    beforeAll(async () => {
      webmanifestContent = JSON.parse(await fs.promises.readFile(webmanifestFilename, 'utf-8'));
    });

    it('should contain hash in filename', () => {
      expect(/\/manifest\.[\w\d]+?\.webmanifest$/.test(webmanifestFilename)).toBe(true);
    });

    it('should use "name" parameter', () => {
      expect(webmanifestContent.name).toBe('my manifest');
      expect(webmanifestContent.short_name).toBe('my manifest');
    });

    it('should borrow scope from "pwa.sw.scope" parameter', () => {
      expect(webmanifestContent.scope).toBe('/scope/');
    });

    it('should borrow theme_color from "pwa.meta.themeColor" parameter', () => {
      expect(webmanifestContent.theme_color).toBe('#ffdd2d');
    });

    it('should contain generated icons', () => {
      expect(
        webmanifestContent.icons.map((icon: any) => {
          return {
            ...icon,
            src: icon.src.replace(contenthashPngRegexp, '.[contenthash].png'),
          };
        })
      ).toEqual([
        {
          src: 'http://localhost:4000/dist/client/images/36x36.[contenthash].png',
          sizes: '36x36',
          type: 'image/png',
        },
        {
          src: 'http://localhost:4000/dist/client/images/512x512.[contenthash].png',
          sizes: '512x512',
          type: 'image/png',
        },
      ]);
    });
  });

  describe('Icons', () => {
    it('should be created', () => {
      iconsFilenames.forEach((filename) => {
        expect(fs.existsSync(filename)).toBe(true);
      });
    });
  });
});
