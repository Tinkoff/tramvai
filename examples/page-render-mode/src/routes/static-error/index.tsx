import type { PageComponent } from '@tramvai/react';

export const StaticErrorPage: PageComponent = () => {
  throw Error('Static Error Page');
};

StaticErrorPage.renderMode = 'static';

export default StaticErrorPage;
