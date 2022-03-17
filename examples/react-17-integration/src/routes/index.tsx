import React from 'react';

import './index.module.css';

export const MainPage = () => {
  return <div>Main Page with React {process.env.__TRAMVAI_CONCURRENT_FEATURES ? 18 : 17}</div>;
};

export default MainPage;
