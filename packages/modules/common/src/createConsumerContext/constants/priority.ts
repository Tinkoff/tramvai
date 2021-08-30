export const P_LOW = 3;
const P_NORMAL = 5;
const P_HIGH = 7;
const P_IMPORTANT = 10;

export type Priority = typeof P_LOW | typeof P_NORMAL | typeof P_HIGH | typeof P_IMPORTANT;
