// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { createToken } from '@tinkoff/dippy';
import { Module } from '@tramvai/core'

export const TOKEN = createToken('token');
const module = Module({
  providers: []
});
