export const isApplicationAsset = (request: Request) =>
  request.url.startsWith(process.env.ASSETS_PREFIX!);

export const isApplicationScope = (request: Request) => {
  return new URL(request.url).pathname.startsWith(process.env.TRAMVAI_PWA_SW_SCOPE!);
};
