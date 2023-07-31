import { Session } from 'inspector';
import fs from 'fs';

// reference - https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cpu-profile.ts
export function enableCpuProfile(key: string) {
  const session = new Session();
  let saved = false;

  session.connect();

  session.post('Profiler.enable');
  session.post('Profiler.start');

  function saveProfile() {
    if (saved) {
      return;
    }
    saved = true;

    session.post('Profiler.stop', (error, param) => {
      if (error) {
        console.error('Cannot generate CPU profiling:', error);
        return;
      }

      // Write profile to disk
      const filename = `${key}.${Date.now()}.cpuprofile`;
      fs.writeFileSync(`./${filename}`, JSON.stringify(param.profile));
      process.exit(0);
    });
  }

  process.on('SIGINT', saveProfile);
  process.on('SIGTERM', saveProfile);
  process.on('exit', saveProfile);
}
