import { CVQuery } from "./search/query";
import { CVService } from "./search/service";
import {
  ActivitiesStore,
  ActivityTypesStore,
  CVStore,
  LanguagesStore,
  OrgsStore,
  OrgTypesStore,
} from "./search/store";
import {
  ActivitiesQuery,
  ActivityTypesQuery,
  LanguagesQuery,
  OrgsQuery,
  OrgTypesQuery,
} from "./search/query";

import type {
  ActivityType,
  Language,
  OrgType,
  IActivity,
  IOrg,
} from "./data/types";

export const activityTypesStore = new ActivityTypesStore();
export const activitiesStore = new ActivitiesStore();
export const orgsStore = new OrgsStore();
export const orgTypesStore = new OrgTypesStore();
export const languagesStore = new LanguagesStore();
export const cvStore = new CVStore();
export const search = new CVService(
  cvStore,
  activitiesStore,
  activityTypesStore,
  languagesStore,
  orgsStore,
  orgTypesStore
);
export const activitiesQuery = new ActivitiesQuery(activitiesStore);
export const activityTypesQuery = new ActivityTypesQuery(activityTypesStore);
export const languagesQuery = new LanguagesQuery(languagesStore);
export const orgsQuery = new OrgsQuery(orgsStore);
export const orgTypesQuery = new OrgTypesQuery(orgTypesStore);
export const query = new CVQuery(
  cvStore,
  activitiesQuery,
  activityTypesQuery,
  languagesQuery,
  orgsQuery,
  orgTypesQuery
);

/**
 * Load lib/data/raw's fixtures into akita's stores
 */
export const loadStores = ({
  activities,
  orgs,
  languages,
  orgTypes,
  activityTypes,
}: {
  activities: IActivity[];
  orgs: IOrg[];
  languages: Language[];
  orgTypes: OrgType[];
  activityTypes: ActivityType[];
}): void => {
  activitiesStore.setLoading(true);
  console.log("setting storage");
  orgsStore.set(orgs);
  orgTypesStore.set(orgTypes);
  languagesStore.set(languages);
  activityTypesStore.set(activityTypes);
  activitiesStore.set(activities);
  activitiesStore.setLoading(false);
};
