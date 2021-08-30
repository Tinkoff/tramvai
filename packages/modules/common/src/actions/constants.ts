export const actionType = {
  global: 'global' as const,
  local: 'local' as const,
};

export type ActionType = keyof typeof actionType;
