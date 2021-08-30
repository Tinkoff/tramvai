enum Descriptions {
  static = 'static',
  dynamic = 'dynamic',
}

export const STATIC: Descriptions.static = Descriptions.static;
export const DYNAMIC: Descriptions.dynamic = Descriptions.dynamic;

interface Descriptor {
  type: Descriptions;
}

export interface StaticDescriptor extends Descriptor {
  payload: string;
}

export interface DynamicDescriptor extends Descriptor {
  slot: string;
}

export type Description = Array<StaticDescriptor & DynamicDescriptor>;

export const staticRender = (payload: string): StaticDescriptor => ({
  payload,
  type: Descriptions.static,
});
export const dynamicRender = (slot: string): DynamicDescriptor => ({
  slot,
  type: Descriptions.dynamic,
});

export function isStatic(descriptor: Descriptor): descriptor is StaticDescriptor {
  return descriptor.type === Descriptions.static;
}

export function isDynamic(descriptor: Descriptor): descriptor is DynamicDescriptor {
  return descriptor.type === Descriptions.dynamic;
}
