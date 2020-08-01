import handPickedActivitiesRaw from "../../data/my_activities.json";
import handPickedOrgsRaw from "../../data/my_orgs.json";
import ghActivitiesRaw from "../../data/scraped/gh_activities.json";
import ghOrgsRaw from "../../data/scraped/gh_orgs.json";

import { ActivityType, OrgLanguage, OrgType, IActivity, IOrgs } from "../types";

// Join raw data from JSON into lists
export const myOrgsRaw: IOrgs = {
  ...(handPickedOrgsRaw as IOrgs),
  ...(ghOrgsRaw as IOrgs)
};

export const myActivitiesRaw: IActivity[] = [
  ...(handPickedActivitiesRaw as IActivity[]),
  ...(ghActivitiesRaw as IActivity[])
];

// Calculated at runtime, based on the content of above
export const myLanguagesRaw: OrgLanguage[] = Array.from(
  new Set(
    [
      ...Object.values(myOrgsRaw)
        .map(a => a.languages)
        .flat()
    ].filter(Boolean)
  )
);

export const myOrgTypesRaw: OrgType[] = Array.from(
  new Set(
    Object.values(myOrgsRaw)
      .map(a => a.orgType)
      .filter(Boolean)
  )
);

export const myActivityTypesRaw: ActivityType[] = Array.from(
  new Set(myActivitiesRaw.map(a => a.componentName).filter(Boolean))
);
