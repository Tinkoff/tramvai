import { command } from 'execa';
import type { Context } from '../../../models/context';

export const checkVersions = async (context: Context) => {
  try {
    await command(`npx tramvai-check-versions`, { stdio: 'inherit' });
  } catch (e) {
    throw new Error('Versions check failed');
  }
};
