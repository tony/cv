import {
  CVStore,
  ActivitiesStore,
  ActivityTypesStore,
  LanguagesStore,
  OrgsStore,
  OrgTypesStore,
} from "./store";

import {
  ActivityType,
  LanguageName,
  OrgName,
  OrgType,
  IActivity,
  IOrg,
} from "../types";

export class CVService {
  constructor(
    private cvStore: CVStore,
    private activitiesStore: ActivitiesStore,
    private activityTypeStore: ActivityTypesStore,
    private languagesStore: LanguagesStore,
    private orgsStore: OrgsStore,
    private orgTypesStore: OrgTypesStore
  ) {}
}
