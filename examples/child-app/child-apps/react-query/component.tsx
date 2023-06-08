import { useQuery } from '@tramvai/react-query';
import { query } from './query';

export const Cmp = () => {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
};
