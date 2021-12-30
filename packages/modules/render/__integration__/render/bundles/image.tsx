import React from 'react';
import { createBundle } from '@tramvai/core';
// @ts-ignore
import cityImage from './assets/city.jpg';

const PageComponent = () => {
  return (
    <div>
      <img id="page-image" alt="city" src={cityImage} />
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'image',
  components: {
    pageDefault: PageComponent,
  },
});
