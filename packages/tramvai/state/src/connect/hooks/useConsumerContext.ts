import { useContext } from 'react';
import { ConnectContext } from '../context';
import type { ConsumerContext } from '../types';

export const useConsumerContext = (): ConsumerContext => {
  return useContext<ConsumerContext>(ConnectContext);
};
