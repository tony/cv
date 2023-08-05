import {
  reActivityCodeStyleTweak,
  reActivityDocImprovement,
  reActivityRelease,
  reActivityTypoFix,
} from "@tony/cv-data/constants";
import type { Activity, ActivityOpenSource } from "@tony/cv-data/types";

// via v1: https://github.com/tony/cv/blob/v1/lib/selectors.js
export const isActivityRelease = (activity: Activity): boolean =>
  !!activity.title.match(reActivityRelease);
export const isActivityTypoFix = (activity: Activity): boolean =>
  !!activity.title.match(reActivityTypoFix);
export const isActivityDocImprovement = (activity: Activity): boolean =>
  !!activity.title.match(reActivityDocImprovement);
export const isActivityCodeStyleTweak = (activity: Activity): boolean =>
  !!activity.title.match(reActivityCodeStyleTweak);
export const isActivityMerged = (activity: ActivityOpenSource): boolean =>
  activity?.acceptedAt ? true : false;
