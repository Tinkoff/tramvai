import { command } from 'execa';
import type { Context } from '../../../models/context';

export const migrate = async (context: Context) => {
  try {
    await command(`npx tramvai-migrate`, { stdio: 'inherit' });
  } catch (e) {
    throw new Error('Migrations failed');
  }
};
