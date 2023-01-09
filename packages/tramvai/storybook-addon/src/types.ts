import type { ReactElement, ComponentType } from 'react';

// simple types for storybook integrations
// as we do not want to bring storybook dependencies at all
// that will mess up our babel and webpack deps in the tramvai repo
export interface StorybookOptions {
  tramvaiAppName?: string;
  tramvaiDir?: string;
}

export type StorybookDecorator<Params> = (
  Story: ComponentType,
  options: { parameters: Params }
) => ReactElement;
