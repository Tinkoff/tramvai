import React from 'react';

export const BaseCmp = ({ fromRoot }: { fromRoot: string }) => {
  return (
    <>
      <div id="base-not-preloaded">Child App</div>
    </>
  );
};
