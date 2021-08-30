import { useContext } from 'react';
import { RouterContext } from './context';

export const useRouter = () => {
  return useContext(RouterContext);
};
