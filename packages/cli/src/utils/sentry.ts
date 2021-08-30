import * as Sentry from '@sentry/node';

let localSentry;

export function initSentry() {
  if (localSentry) {
    return localSentry;
  }
  Sentry.init({
    dsn: '',
  });
  const projectContext = {
    pipeline: process?.env.CI_PIPELINE_URL,
    job: process?.env.CI_JOB_URL,
    repo: process?.env.CI_REPOSITORY_URL,
    branch: process?.env.CI_COMMIT_REF_NAME,
  };
  Sentry.setContext('project', projectContext);

  localSentry = Sentry;
  return localSentry;
}
