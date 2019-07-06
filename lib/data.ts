import handPickedActivitiesRaw from "../data/my_activities.json";
import handPickedActorsRaw from "../data/my_actors.json";
import ghActivitiesRaw from "../data/scraped/gh_activities.json";
import ghActorsRaw from "../data/scraped/gh_actors.json";

import { IActivity, IActor } from "./types";

// Join raw data from JSON into lists
export const myActors: IActor[] = [
  ...(handPickedActorsRaw as IActor[]),
  ...(ghActorsRaw as IActor[])
];

export const myActivitiesRaw: IActivity[] = [
  ...handPickedActivitiesRaw,
  ...ghActivitiesRaw
];

export const myActivities = myActivitiesRaw;
