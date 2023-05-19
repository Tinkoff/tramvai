export type WebManifestOptions = {
  /**
   * @title Create webmanifest file
   * @default false
   */
  enabled?: boolean;
  /**
   * @title Name of generated manifest file (will be placed in "output.client" directory). You can use `[hash]` placeholder for manifest cache busting
   * @default "/manifest.[hash].json"
   */
  dest?: string;
  /**
   * @title prefer to use "pwa.sw.scope" instead, this field will be generated automatically
   */
  scope?: string;
  name?: string;
  short_name?: string;
  description?: string;
  // @todo - example or default with `/?standalone=true`?
  start_url?: string;
  display?: string;
  /**
   * @title prefer to use "pwa.meta.themeColor" instead, this field will be generated automatically
   */
  theme_color?: string;
  background_color?: string;
  /**
   * @title prefer to use "pwa.icon" instead, this field will be generated automatically
   */
  icons?: Array<PwaIconItem>;
};

export type PwaIconItem = {
  src: string;
  sizes: string;
  type?: string;
  density?: number;
  purpose?: string;
};

export type PwaIconOptions = {
  /**
   * @title Path to icon file (relative to "root" directory)
   */
  src: string;
  /**
   * @title Folder for generated icons (will be placed in "output.client" directory)
   * @default "pwa-icons"
   */
  dest?: string;
  /**
   * @title Icon sizes
   * @default [36, 48, 72, 96, 144, 192, 512]
   */
  sizes?: number[];
  // @todo: dest directory
};

export type PwaMetaOptions = {
  viewport?: string;
  themeColor?: string;
  mobileApp?: string;
  mobileAppIOS?: string;
  appleTitle?: string;
  appleStatusBarStyle?: string;
};
