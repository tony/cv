import invert from "invert-color";

import handPickedActivitiesJson from "../../data/my_activities.json";
import handPickedOrgsJson from "../../data/my_orgs.json";
import ghColorsJson from "../../data/gh_colors.json";
import ghActivitiesJson from "../../data/scraped/gh_activities.json";
import ghOrgsJson from "../../data/scraped/gh_orgs.json";

import {
  ActivityTypeNameMap,
  ActivityTypeColors,
  LANGUAGE_FALLBACK_COLOR,
} from "../constants";

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

export const orgData: IOrg[] = [
  // Make Object Key the ID
  ...Object.entries(handPickedOrgsJson).map(
    ([key, org]) => ({ ...org, id: key as unknown } as IOrg)
  ),
  ...Object.entries(ghOrgsJson).map(
    ([key, org]) => ({ ...org, id: key as unknown } as IOrg)
  ),
];

export const activityData: IActivity[] = [
  ...(handPickedActivitiesJson as IActivity[]),
  ...(ghActivitiesJson as IActivity[]),
];

const ghColorsJsonMissing: { [key: string]: { color: string } } = {
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
export const languageData: Language[] = Array.from(
  Array.from(
    new Set([...orgData.map((a) => a.languages).flat()].filter(Boolean))
  ).map((languageName: LanguageName) => {
    const ghColor =
      languageName in ghColorsJsonMissing
        ? ghColorsJsonMissing[languageName]
        : ghColorsJson[languageName];

    if (!ghColor) {
      if (!(languageName in ghColorsJson)) {
        console.warn(`${languageName} not found in colors`);
      } else if (!ghColorsJson?.[languageName]?.color) {
        console.groupCollapsed(`${languageName} missing color`);
        console.table(ghColorsJson?.[languageName]);
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

export const orgTypesData: OrgType[] = Array.from(
  new Set(orgData.map((a) => a.orgType as OrgTypeName).filter(Boolean))
).map(
  (orgTypeName: OrgTypeName) =>
    ({
      id: orgTypeName,
      name: orgTypeName,
    } as OrgType)
);

export const activityTypeData: ActivityType[] = Array.from(
  new Set(activityData.map((a) => a.componentName).filter(Boolean))
).map(
  (activityTypeName: ActivityTypeName) =>
    ({
      id: activityTypeName,
      name: ActivityTypeNameMap[activityTypeName] ?? activityTypeName,
      ui: ActivityTypeColors[activityTypeName],
    } as ActivityType)
);
