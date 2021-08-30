import { useContext } from 'react';
import { UrlContext } from './context';

export const useUrl = () => {
  return useContext(UrlContext);
};
