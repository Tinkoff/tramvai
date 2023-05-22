import React from 'react';
import { useMedia } from '@tramvai/module-client-hints';

export const ClientHintsCmp = () => {
  const media = useMedia();

  return (
    <>
      <div>Media State: {JSON.stringify(media)}</div>
    </>
  );
};
