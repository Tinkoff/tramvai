import React from 'react';
import { useStoreSelector } from '@tramvai/state';
import { useNavigate } from '@tramvai/module-router';
import { CommandLinesStore } from './store';

export const Cmp = ({ fromRoot }: { fromRoot: string }) => {
  const lastLines = useStoreSelector(CommandLinesStore, (state) => state.lastLines);
  const navigate = useNavigate({
    query: {
      test: `${Math.random()}`,
    },
  });

  return (
    <>
      <div>List of last called commandLineListTokens: {JSON.stringify(lastLines)}</div>
      <button type="button" onClick={navigate}>
        Generate Spa transition
      </button>
    </>
  );
};
