import shuffle from '@tinkoff/utils/array/shuffle';

import path from 'path';
import type { Container } from '@tinkoff/dippy';
import findCacheDir from 'find-cache-dir';
import { readJSONSync, outputJsonSync } from 'fs-extra';
import { tips as publicTips } from './tips';
import type { TramvaiTip, TramvaiTipUsageInfo } from './types';

const SHOW_ALL_TIPS_WINDOW = 1000 * 60 * 60 * 5; // 5 hours
const SHOW_SINGLE_TIP_WINDOW = 1000 * 60 * 60 * 24 * 14; // 2 weeks

let docUrl = 'https://tramvai.dev/docs/';
let tips = publicTips;

try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { tips: privateTips, docUrl: privateDocUrl } = require('@tramvai-tinkoff/cli-tips');

  tips = tips.concat(privateTips);

  docUrl = privateDocUrl;
} catch (_) {}

const cacheDirectory = findCacheDir({ name: 'tramvai' });
const tipsFile = path.resolve(cacheDirectory ?? '', 'showed-tips');

const DEFAULT_TIP_USAGE_INFO: TramvaiTipUsageInfo = {
  lastTimeShowed: 0,
  lastTimeShowedByTip: {},
};

const getTipUsageInfo = (): TramvaiTipUsageInfo => {
  if (!cacheDirectory) {
    return DEFAULT_TIP_USAGE_INFO;
  }

  try {
    return readJSONSync(tipsFile);
  } catch (_) {
    return DEFAULT_TIP_USAGE_INFO;
  }
};

const updateTipUsageInfo = (usageInfo: TramvaiTipUsageInfo) => {
  if (!cacheDirectory) {
    return;
  }

  try {
    outputJsonSync(
      tipsFile,
      {
        ...usageInfo,
        lastTimeShowed: Date.now(),
      } as TramvaiTipUsageInfo,
      {
        spaces: 2,
      }
    );
  } catch (_) {}
};

export const getTip = (di: Container): TramvaiTip | undefined => {
  if (process.env.TRAMVAI_DISABLE_TIPS) {
    return;
  }

  const tipUsageInfo: TramvaiTipUsageInfo = getTipUsageInfo();
  const now = Date.now();

  // show tips only once in a time window
  if (now - tipUsageInfo.lastTimeShowed < SHOW_ALL_TIPS_WINDOW) {
    return;
  }

  // ignore tips that were showed recently
  // add shuffle to pick up random tip
  const filteredTips = shuffle(
    tips.filter((tip) => {
      return (
        !tipUsageInfo.lastTimeShowedByTip[tip.docLink] ||
        now - tipUsageInfo.lastTimeShowedByTip[tip.docLink] > SHOW_SINGLE_TIP_WINDOW
      );
    })
  );

  let tip;

  for (const possibleTip of filteredTips) {
    tipUsageInfo.lastTimeShowedByTip[possibleTip.docLink] = Date.now();

    if (possibleTip.isApplicable(di)) {
      // show first tip that is applicable
      tip = possibleTip;
      break;
    }
  }

  updateTipUsageInfo(tipUsageInfo);

  return tip;
};

export const getDocUrl = (relativeUrl: string) => {
  return `${docUrl}${relativeUrl}`;
};
