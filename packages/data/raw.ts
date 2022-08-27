import invert from "invert-color";

import handPickedActivitiesJson from "@tony/cv-data/my_activities.json";
import handPickedOrgsJson from "@tony/cv-data/my_orgs.json";
import ghColorsJson from "@tony/cv-data/gh_colors.json";
import ghActivitiesJson from "@tony/cv-data/scraped/gh_activities.json";
import ghOrgsJson from "@tony/cv-data/scraped/gh_orgs.json";

import {
  ActivityTypeNameMap,
  ActivityTypeColors,
  LANGUAGE_FALLBACK_COLOR,
  OrgTypeColors,
} from "./constants";
import {
  ActivityType,
  ActivityTypeName,
  Language,
  LanguageName,
  OrgType,
  OrgTypeName,
  IActivity,
  IOrg,
} from "./types";

export const orgs: IOrg[] = [
  // Make Object Key the ID
  ...Object.entries(handPickedOrgsJson).map(
    ([key, org]) => ({ ...org, id: key as unknown } as IOrg)
  ),
  ...Object.entries(ghOrgsJson).map(
    ([key, org]) => ({ ...org, id: key as unknown } as IOrg)
  ),
].map((org) => {
  if (!org.languages.length) {
    org.languages = ["Text"];
  }
  return org;
});

export const activities: IActivity[] = [
  ...(handPickedActivitiesJson as IActivity[]),
  ...(ghActivitiesJson as IActivity[]),
];

const ghColorsJsonMissing: {
  [key: string]: { color: string };
} = {
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
  Text: {
    color: LANGUAGE_FALLBACK_COLOR,
  },
};

// Calculated at runtime, based on the content of above
export const languages: Language[] = Array.from(
  new Set([
    ...orgs
      .filter((a) => a.languages)
      .map((a) => a.languages)
      .flat(),
  ])
)
  .filter(Boolean)
  .map((languageName: LanguageName) => {
    if (!languageName) {
      throw new Error("empty languageName");
    }

    if (!ghColorsJson) {
      throw new Error("ghColorsJson not found");
    }

    const ghColor =
      languageName in ghColorsJsonMissing
        ? ghColorsJsonMissing[languageName]
        : // @ts-ignore
          ghColorsJson[languageName];

    if (!ghColor) {
      if (!(languageName in ghColorsJson)) {
        console.warn(`${languageName} not found in colors`);
      } else if (!ghColor?.color) {
        console.groupCollapsed(`${languageName} missing color`);
        console.table(ghColor);
        console.groupEnd();
      }
    }
    return {
      id: languageName, // identify under original name
      ...(ghColor?.color
        ? {
            ui: {
              backgroundColor: ghColor.color ?? LANGUAGE_FALLBACK_COLOR,
              color: invert(ghColor.color ?? LANGUAGE_FALLBACK_COLOR, true),
            },
          }
        : {}),
    } as Language;
  });

export const orgTypes: OrgType[] = Array.from(
  new Set(orgs.map((a) => a.orgType as OrgTypeName).filter(Boolean))
).map(
  (orgTypeName: OrgTypeName) =>
    ({
      id: orgTypeName,
      name: orgTypeName,
      ui: OrgTypeColors[orgTypeName],
    } as OrgType)
);

export const activityTypes: ActivityType[] = Array.from(
  new Set(activities.map((a) => a.activityType).filter(Boolean))
).map(
  (activityTypeName: ActivityTypeName) =>
    ({
      id: activityTypeName,
      name: ActivityTypeNameMap[activityTypeName] ?? activityTypeName,
      ui: ActivityTypeColors[activityTypeName],
    } as ActivityType)
);
