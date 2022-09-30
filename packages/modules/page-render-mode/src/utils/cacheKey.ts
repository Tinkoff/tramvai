export const getCacheKey = ({
  method,
  host,
  path,
  deviceType,
  modern,
}: {
  method: string;
  host: string;
  path: string;
  deviceType: 'desktop' | 'mobile';
  modern: boolean;
}) => {
  return `${method}=${host}=${path}=${deviceType}=${modern ? 'modern' : 'default'}`;
};

export const parseCacheKey = (key: string): string[] => {
  return key.split('=');
};
