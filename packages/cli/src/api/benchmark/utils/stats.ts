import type { Stats } from '../types';

export const getSamplesStats = (samples: number[]): Stats => {
  const n = samples.length;

  let sum = 0;

  for (let i = 0; i < n; i++) {
    sum += samples[i];
  }

  const mean = sum / n;

  sum = 0;

  for (let i = 0; i < n; i++) {
    sum += (samples[i] - mean) * (samples[i] - mean);
  }

  const std = Math.sqrt(sum / n);
  const variance = (100 * std) / mean;

  return {
    samples,
    mean,
    std,
    variance,
  };
};
