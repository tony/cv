import handPickedActivitiesRaw from "../data/my_activities.json";
import handPickedActorsRaw from "../data/my_actors.json";
import ghActivitiesRaw from "../data/scraped/gh_activities.json";
import ghActorsRaw from "../data/scraped/gh_actors.json";

import { IActivity, IActor } from "./types";

// Join JSON files into a normal list
export const myActors: IActor[] = [
  ...(handPickedActorsRaw as IActor[]),
  ...(ghActorsRaw as IActor[])
];

// print all languages: new Set([].concat(...myActors.map(a => a.languages)))

export const myActivitiesRaw: IActivity[] = [
  ...handPickedActivitiesRaw,
  ...ghActivitiesRaw
];
