import ini from 'ini';
import path from 'path';
import fs from 'fs';

function readNpmRc(cwd: string): string {
  const npmrcPath = path.join(cwd, '.npmrc');
  return fs.existsSync(npmrcPath) ? fs.readFileSync(npmrcPath).toString('utf8') : '';
}

export function fixYarnSettingsOverride() {
  const cwd = process.cwd();
  const npmRc = readNpmRc(cwd);
  const classicYarn = process.env.npm_config_user_agent
    ? process.env.npm_config_user_agent.indexOf('yarn/1') !== -1
    : false;

  // yarn 1 overrides npmrc settings with its own set of npm config envs so `yarn publish-command` wont work if it depends on those
  // strict-ssl is one of those important settings, so copy it to envs and override yarn default one
  if (classicYarn && npmRc) {
    if (npmRc.indexOf('strict-ssl') !== -1) {
      const parsedNpmRc = ini.parse(npmRc);

      if (parsedNpmRc['strict-ssl'] !== undefined) {
        process.env.npm_config_strict_ssl = parsedNpmRc['strict-ssl'];
      }
      if (parsedNpmRc.registry !== undefined) {
        process.env.npm_config_registry = parsedNpmRc.registry;
      }
      if (parsedNpmRc.ca !== undefined) {
        process.env.npm_config_ca = parsedNpmRc.ca;
      }
    }
  }
}
