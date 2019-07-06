import handPickedActivitiesRaw from "../../data/my_activities.json";
import handPickedActorsRaw from "../../data/my_actors.json";
import ghActivitiesRaw from "../../data/scraped/gh_activities.json";
import ghActorsRaw from "../../data/scraped/gh_actors.json";

import { ActorLanguage, IActivity, IActor } from "../types";

// Join raw data from JSON into lists
export const myActorsRaw: IActor[] = [
  ...(handPickedActorsRaw as IActor[]),
  ...(ghActorsRaw as IActor[])
];

export const myActivitiesRaw: IActivity[] = [
  ...handPickedActivitiesRaw,
  ...ghActivitiesRaw
];

export const myLanguagesRaw: ActorLanguage[] = Array.from(
  new Set([].concat(...myActorsRaw.map(a => a.languages).filter(Boolean)))
);

export const myActorTypeRaw: string[] = Array.from(
  new Set([].concat(...myActorsRaw.map(a => a.actorType).filter(Boolean)))
);

export const myActivityTypeRaw: string[] = Array.from(
  new Set(
    [].concat(...myActivitiesRaw.map(a => a.componentName).filter(Boolean))
  )
);
