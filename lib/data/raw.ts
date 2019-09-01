import handPickedActivitiesRaw from "../../data/my_activities.json";
import handPickedActorsRaw from "../../data/my_actors.json";
import ghActivitiesRaw from "../../data/scraped/gh_activities.json";
import ghActorsRaw from "../../data/scraped/gh_actors.json";

import {
  ActivityType,
  ActorLanguage,
  ActorType,
  IActivity,
  IActor,
  IActors
} from "../types";

// Join raw data from JSON into lists
export const myActorsRaw: IActors = {
  ...(handPickedActorsRaw as IActors),
  ...(ghActorsRaw as IActors)
};

export const myActivitiesRaw: IActivity[] = [
  ...handPickedActivitiesRaw,
  ...ghActivitiesRaw
];

// Calculated at runtime, based on the content of above
export const myLanguagesRaw: ActorLanguage[] = Array.from(
  new Set(
    [
      ...Object.values(myActorsRaw)
        .map(a => a.languages)
        .flat()
    ].filter(Boolean)
  )
);

export const myActorTypesRaw: ActorType[] = Array.from(
  new Set(
    Object.values(myActorsRaw)
      .map(a => a.actorType)
      .filter(Boolean)
  )
);

export const myActivityTypesRaw: ActivityType[] = Array.from(
  new Set(myActivitiesRaw.map(a => a.componentName).filter(Boolean))
);
