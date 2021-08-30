export enum StorageRecord {
  iconLink = 'iconLink',
  meta = 'meta',
  inlineScript = 'inlineScript',
  script = 'script',
  asIs = 'asIs',
  preconnectLink = 'preconnectLink',
  preloadLink = 'preloadLink',
  inlineStyle = 'inlineStyle',
  style = 'style',
}

interface RecordBase {
  type: StorageRecord;
}

export interface IconLinkRecord extends RecordBase {
  rel: string;
  href: string;
  sizes: string;
  dataType: string;
  color?: string;
}

interface PayloadRecord extends RecordBase {
  payload: string;
}

interface PreconnectLinkRecord extends RecordBase {
  link: string;
}

export interface BundleScript extends RecordBase {
  id: string;
  src: string;
}

export type IRecord = IconLinkRecord | BundleScript | PayloadRecord | PreconnectLinkRecord;

export const ICON_LINK: StorageRecord = StorageRecord.iconLink;
export const META: StorageRecord = StorageRecord.meta;
export const INLINE_SCRIPT: StorageRecord = StorageRecord.inlineScript;
export const SCRIPT: StorageRecord = StorageRecord.script;
export const AS_IS: StorageRecord = StorageRecord.asIs;
export const PRECONNECT_LINK: StorageRecord = StorageRecord.preconnectLink;
export const PRELOAD_LINK: StorageRecord = StorageRecord.preloadLink;
export const INLINE_STYLE: StorageRecord = StorageRecord.inlineStyle;
export const STYLE: StorageRecord = StorageRecord.style;
