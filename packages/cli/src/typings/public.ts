import type { ComponentType, SVGProps } from 'react';

export interface ImageObject {
  src: string;
  width: number;
  height: number;
}

export type SvgComponent = ComponentType<SVGProps<SVGElement>>;
