import { execSync } from 'child_process';

interface Payload {
  request?: number;
  fallback: number;
}

/**
 * Try to detect port synchronously considering the fact, that if user requests
 * a port explicitly, we should not try to detect a free one.
 *
 * Also, handle zero port (it means any random port) as the edge case,
 * because we must pass a final number to the config manager.
 */
export const detectPortSync = ({ request, fallback }: Payload): number => {
  if (request !== undefined && request !== 0) {
    return request;
  }

  const commandResult = execSync(`npx detect-port ${request ?? fallback}`);

  return parseInt(commandResult.toString('utf-8'), 10);
};
