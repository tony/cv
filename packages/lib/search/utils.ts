import type { IActivity } from "@tony/cv-data/types";
import {
  reActivityTypoFix,
  reActivityDocImprovement,
  reActivityCodeStyleTweak,
} from "@tony/cv-data/constants";

// via v1: https://github.com/tony/cv/blob/v1/lib/selectors.js
export const isActivityTypoFix = (activity: IActivity): boolean =>
  !!activity.title.match(reActivityTypoFix);
export const isActivityDocImprovement = (activity: IActivity): boolean =>
  !!activity.title.match(reActivityDocImprovement);
export const isActivityCodeStyleTweak = (activity: IActivity): boolean =>
  !!activity.title.match(reActivityCodeStyleTweak);
export const isActivityMerged = (activity: IActivity): boolean =>
  activity?.acceptedDate ? true : false;
