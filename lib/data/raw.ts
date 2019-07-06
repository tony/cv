import { normalize, schema } from "normalizr";

import handPickedActivitiesRaw from "../../data/my_activities.json";
import handPickedActorsRaw from "../../data/my_actors.json";
import ghActivitiesRaw from "../../data/scraped/gh_activities.json";
import ghActorsRaw from "../../data/scraped/gh_actors.json";

import { IActivity, IActor } from "../types";

// Join raw data from JSON into lists
export const myActorsRaw: IActor[] = [
  ...(handPickedActorsRaw as IActor[]),
  ...(ghActorsRaw as IActor[])
];

export const myActivitiesRaw: IActivity[] = [
  ...handPickedActivitiesRaw,
  ...ghActivitiesRaw
];

const language = new schema.Entity(
  "language",
  {},
  { idAttribute: value => value.componentName }
);

const actor = new schema.Entity(
  "actor",
  { languages: [language] },
  {
    idAttribute: (value, parentr, key) => {
      console.log({ value, parentr, key });
      return value.id;
    }
  }
);

const activityType = new schema.Entity(
  "activityTypes",
  {},
  {
    idAttribute: v => v.componentName
  }
);

const activity = new schema.Entity("activity", {
  actor,
  componentName: activityType
});

const normalizeData = normalize(
  myActivitiesRaw,
  // { actor: myActorsRaw, activities: myActivitiesRaw, componentName: {} },
  [activity]
);

console.log({ normalizeData });
