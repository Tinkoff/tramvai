export interface PackageConfigEntry {
  type: 'package';
  /**
   * @title Package name
   */
  name: string;
  /**
   * @title Package root folder
   */
  root?: string;
}
