export interface Browser {
  name: string | undefined;
  /**
   * With client-hints there will be only major version
   */
  version: string | undefined;
  /**
   * @deprecated use version
   */
  major: string | undefined;
  browserEngine: string;
}

export interface Engine {
  name: string | undefined;
  version: string | undefined;
}

export interface Device {
  type: string | undefined;
  model: string | undefined;
  /**
   * @deprecated This info is not provided by client-hints
   */
  vendor: string | undefined;
}

export interface OS {
  name: string | undefined;
  version: string | undefined;
}

export interface Cpu {
  /**
   * @deprecated This is not provided by default with client-hints
   */
  architecture: string | undefined;
}

export interface UserAgent {
  browser: Browser;
  engine: Engine;
  device: Device;
  os: OS;
  /**
   * @deprecated This is not provided by default with client-hints
   */
  cpu: Cpu;
  mobileOS?: string;
  sameSiteNoneCompatible: boolean;
}
