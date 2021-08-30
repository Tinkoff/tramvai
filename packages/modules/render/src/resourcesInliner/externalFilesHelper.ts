import fetch from 'node-fetch';

const thirtySeconds = 1000 * 30;

export const getFileContentLength = async (url: string): Promise<string> => {
  const info = await fetch(url, { method: 'HEAD', timeout: thirtySeconds });
  return info.headers.get('content-length');
};

export const getFile = async (url: string): Promise<string> => {
  const fileResponse = await fetch(url, { timeout: thirtySeconds });
  const file = await fileResponse.text();
  return file;
};
