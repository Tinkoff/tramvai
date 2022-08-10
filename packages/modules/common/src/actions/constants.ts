/**
 * @deprecated only for compatibility with legacy createAction
 */
export const actionType = {
  global: 'global' as const,
  local: 'local' as const,
};

/**
 * @deprecated only for compatibility with legacy createAction
 */
export type ActionType = keyof typeof actionType;
