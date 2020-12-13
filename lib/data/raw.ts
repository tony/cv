import handPickedActivitiesRaw from "../../data/my_activities.json";
import handPickedOrgsRaw from "../../data/my_orgs.json";
import ghColors from "../../data/gh_colors.json";
import ghActivitiesRaw from "../../data/scraped/gh_activities.json";
import ghOrgsRaw from "../../data/scraped/gh_orgs.json";
import { ActivityTypeNameMap } from "../constants";
import invert from "invert-color";

import {
  ActivityType,
  ActivityTypeName,
  Language,
  LanguageName,
  OrgType,
  OrgTypeName,
  IActivity,
  IOrg,
} from "../types";

export const myOrgsRaw: IOrg[] = [
  // Make Object Key the ID
  ...Object.entries(handPickedOrgsRaw).map(
    ([key, org]) => ({ ...org, id: key as unknown } as IOrg)
  ),
  ...Object.entries(ghOrgsRaw).map(
    ([key, org]) => ({ ...org, id: key as unknown } as IOrg)
  ),
];

export const myActivitiesRaw: IActivity[] = [
  ...(handPickedActivitiesRaw as IActivity[]),
  ...(ghActivitiesRaw as IActivity[]),
];

// Calculated at runtime, based on the content of above
export const myLanguagesRaw: Language[] = Array.from(
  Array.from(
    new Set([...myOrgsRaw.map((a) => a.languages).flat()].filter(Boolean))
  ).map(
    (languageName: LanguageName) =>
      ({
        id: languageName,
        ...(languageName in ghColors && ghColors[languageName]?.color
          ? {
              color: ghColors[languageName]?.color,
              textColor: invert(ghColors[languageName]?.color, true),
            }
          : {}),
      } as Language)
  )
);

export const myOrgTypesRaw: OrgType[] = Array.from(
  new Set(myOrgsRaw.map((a) => a.orgType as OrgTypeName).filter(Boolean))
).map(
  (orgTypeName: OrgTypeName) =>
    ({
      id: orgTypeName,
      name: orgTypeName,
    } as OrgType)
);

export const myActivityTypesRaw: ActivityType[] = Array.from(
  new Set(myActivitiesRaw.map((a) => a.componentName).filter(Boolean))
).map(
  (activityTypeName: ActivityTypeName) =>
    ({
      id: activityTypeName,
      name: ActivityTypeNameMap[activityTypeName] ?? activityTypeName,
    } as ActivityType)
);
