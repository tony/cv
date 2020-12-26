import handPickedActivitiesRaw from "../../data/my_activities.json";
import handPickedOrgsRaw from "../../data/my_orgs.json";
import ghColors from "../../data/gh_colors.json";
import ghActivitiesRaw from "../../data/scraped/gh_activities.json";
import ghOrgsRaw from "../../data/scraped/gh_orgs.json";
import { ActivityTypeNameMap, LANGUAGE_FALLBACK_COLOR } from "../constants";
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

const ghColorsMissing: { [key: string]: { color: string } } = {
  Sass: {
    color: "#a53b70",
  },
  ShellScript: {
    color: "#89e051",
  },
  "Vim Snippet": {
    color: "#199f4b",
  },
  Markdown: {
    color: "#083fa1",
  },
  CMake: {
    color: "#ccc",
  },
};

// Calculated at runtime, based on the content of above
export const myLanguagesRaw: Language[] = Array.from(
  Array.from(
    new Set([...myOrgsRaw.map((a) => a.languages).flat()].filter(Boolean))
  ).map((languageName: LanguageName) => {
    const ghColor =
      languageName in ghColorsMissing
        ? ghColorsMissing[languageName]
        : ghColors[languageName];

    if (!ghColor) {
      if (!(languageName in ghColors)) {
        console.warn(`${languageName} not found in colors`);
      } else if (!ghColors?.[languageName]?.color) {
        console.groupCollapsed(`${languageName} missing color`);
        console.table(ghColors?.[languageName]);
        console.groupEnd();
      }
    }
    return {
      id: languageName, // identify under original name
      ...(ghColor.color
        ? {
            ui: {
              backgroundColor: ghColor.color ?? LANGUAGE_FALLBACK_COLOR,
              color: invert(ghColor.color, true),
            },
          }
        : {}),
    } as Language;
  })
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
