type RenderModuleConfig = {
  polyfillCondition?: string;
  /**
   * @deprecated tramvai will automatically detect React version, and use hydrateRoot API for 18+ version
   * For Strict Mode, use options `useStrictMode`
   */
  mode?: 'legacy' | 'strict' | 'blocking' | 'concurrent';
  useStrictMode?: boolean;
};

export { RenderModuleConfig };
