import type { MetaWalk, WalkItem } from './MetaWalk';

export type ListSources = Array<(walker: MetaWalk, ...args: any[]) => void>;
export type TransformValue = (value: WalkItem) => WalkItem;

export type TagRecord = { tag: string; attributes?: Record<string, string>; innerHtml?: string };
export type Converter = (value: string | TagRecord) => TagRecord | TagRecord[] | null;
