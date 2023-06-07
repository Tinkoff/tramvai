import type { PageComponent } from '@tramvai/react';

export const MainPage: PageComponent = () => {
  return <h2>Main Page</h2>;
};

MainPage.seo = {
  metaTags: {
    title: 'Main Page Title',
  },
};

export default MainPage;
