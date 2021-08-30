import { useContext } from 'react';
import { RouteContext } from './context';

export const useRoute = () => {
  return useContext(RouteContext);
};
