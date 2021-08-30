import any from '@tinkoff/utils/array/any';

const tramvaiPatterns = [
  /^@tramvai\/cli$/,
  /^@tramvai\/core$/,
  /^@tramvai\/test$/,
  /^@tramvai\/state$/,
  /^@tramvai\/react$/,
  /^@tramvai\/papi$/,
  /^@tramvai\/module-/,
  /^@tramvai-tinkoff\/module-/,
  /^@tramvai\/tokens-/,
  /^@tramvai-tinkoff\/tokens-/,
];

export const isTramvai = (dep: string) => {
  return any((pattern) => pattern.test(dep), tramvaiPatterns);
};
