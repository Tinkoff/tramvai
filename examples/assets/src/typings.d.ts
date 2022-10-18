import type { SvgComponent } from '@tramvai/cli';

declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }

  const classNames: IClassNames;

  export = classNames;
}

declare module '*.svg' {
  export = string;
}
declare module '*.svg?react' {
  const Svg: SvgComponent;
  export = Svg;
}
