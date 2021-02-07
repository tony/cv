import {
  CVStore,
  ActivitiesStore,
  ActivityTypesStore,
  LanguagesStore,
  OrgsStore,
  OrgTypesStore,
} from "./store";

export class CVService {
  constructor(
    private cvStore: CVStore,
    private activitiesStore: ActivitiesStore,
    private activityTypeStore: ActivityTypesStore,
    private languagesStore: LanguagesStore,
    private orgsStore: OrgsStore,
    private orgTypesStore: OrgTypesStore
  ) {}

  setYears({ startYear, endYear }: { startYear?: number; endYear?: number }) {
    this.cvStore.update({
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
    });
  }
}
