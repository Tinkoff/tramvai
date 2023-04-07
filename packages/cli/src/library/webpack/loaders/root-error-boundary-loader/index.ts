import type { LoaderDefinition } from 'webpack';

import type { BuildType } from '../../../../typings/projectType';
import { shouldUseReactRoot } from '../../../../utils/shouldUseReactRoot';

interface Options {
  buildType: BuildType;
  // Path to root error boundary component
  path: string;
}
const COMPONENT_NAME = 'RootErrorBoundary';
const REACT_18_HYDRATION_CODE = `
const { hydrateRoot } = require('react-dom/client')

hydrateRoot(
  document,
  <${COMPONENT_NAME} error={window.serverError} url={window.serverUrl} />,
);
`;
const REACT_HYDRATION_CODE = `
const { hydrate } = require('react-dom')

hydrate(
  <${COMPONENT_NAME} error={window.serverError} url={window.serverUrl} />,
  document,
);
`;

// eslint-disable-next-line func-style
const rootErrorBoundaryLoader: LoaderDefinition<Options> = function (content) {
  const options = this.getOptions();

  this.cacheable(false);

  // We don't need hydration code on the server
  if (options.buildType === 'client') {
    const IMPORT_CODE = `import ${COMPONENT_NAME} from "${options.path}"\n`;
    const HYDRATION_CODE = shouldUseReactRoot() ? REACT_18_HYDRATION_CODE : REACT_HYDRATION_CODE;

    return IMPORT_CODE.concat(HYDRATION_CODE);
  }

  return content;
};

export default rootErrorBoundaryLoader;
