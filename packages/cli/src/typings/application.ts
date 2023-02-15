interface ImageObject {
  src: string;
  width: number;
  height: number;
}

declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.woff2' {
  const font: string;
  export = font;
}

type ImageString = string;

declare module '*.png' {
  export default ImageString;
  export const image: ImageObject;
}
declare module '*.jpg' {
  export default ImageString;
  export const image: ImageObject;
}
declare module '*.jpeg' {
  export default ImageString;
  export const image: ImageObject;
}

declare module '*.svg' {
  const image: ImageString;
  export = image;
}
declare module '*.svg?react' {
  import type { ComponentType, SVGProps } from 'react';

  type SvgComponent = ComponentType<SVGProps<SVGElement>>;

  /**
   * React component transformed with https://react-svgr.com/
   */
  const Svg: SvgComponent;

  export = Svg;
}
