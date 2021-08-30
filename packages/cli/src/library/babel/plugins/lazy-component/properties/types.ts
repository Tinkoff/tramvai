import { types, template, NodePath } from '@babel/core';
import {
  FunctionExpression,
  CallExpression,
  ObjectMember,
  ArrowFunctionExpression,
} from '@babel/types';

export type LazyCallPath = NodePath<CallExpression>;
export type FuncPath = NodePath<FunctionExpression | ArrowFunctionExpression>;
export type ImportPath = NodePath<CallExpression>;

export type PropertyFactory = (arg: {
  types: typeof types;
  template: typeof template;
}) => (arg: {
  lazyCallPath: LazyCallPath;
  funcPath: FuncPath;
  importPath: ImportPath;
}) => ObjectMember;
