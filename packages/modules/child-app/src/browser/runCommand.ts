import type {
  CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
  CHILD_APP_PRELOAD_MANAGER_TOKEN,
} from '@tramvai/tokens-child-app';

export const runCommand = async ({
  status,
  forcePreload,
  runner,
  preloader,
}: {
  status: string;
  forcePreload: boolean;
  runner: typeof CHILD_APP_COMMAND_LINE_RUNNER_TOKEN;
  preloader: typeof CHILD_APP_PRELOAD_MANAGER_TOKEN;
}) => {
  const childApps = preloader.getPreloadedList();

  await Promise.all(
    childApps.map(async (config) => {
      if (forcePreload) {
        // need to wait while actual child-app is loaded in case it wasn't preloaded before
        await preloader.preload(config);
      }

      return runner.run('client', status, config);
    })
  );
};
