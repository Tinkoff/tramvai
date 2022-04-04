import type {
  CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
  CHILD_APP_PRELOAD_MANAGER_TOKEN,
} from '@tramvai/tokens-child-app';

export const runCommand = async ({
  status,
  runner,
  preloader,
}: {
  status: string;
  runner: typeof CHILD_APP_COMMAND_LINE_RUNNER_TOKEN;
  preloader: typeof CHILD_APP_PRELOAD_MANAGER_TOKEN;
}) => {
  const childApps = preloader.getPreloadedList();

  await Promise.all(
    childApps.map((config) => {
      return runner.run('client', status, config);
    })
  );
};
