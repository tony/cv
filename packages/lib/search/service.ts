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

  setYears({
    startYear,
    endYear,
  }: {
    startYear?: number;
    endYear?: number;
  }): void {
    this.cvStore.update({
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
    });
  }

  setActivityFilters({
    showReleases,
    showTypos,
    showDocImprovements,
    showCodeStyleTweaks,
    showUnmerged,
  }: {
    showReleases?: boolean;
    showTypos?: boolean;
    showDocImprovements?: boolean;
    showCodeStyleTweaks?: boolean;
    showUnmerged?: boolean;
  }): void {
    console.log({
      showReleases,
      showTypos,
      showDocImprovements,
      showCodeStyleTweaks,
      showUnmerged,
    });
    this.cvStore.update({
      ...(showReleases !== undefined && { showReleases }),
      ...(showTypos !== undefined && { showTypos }),
      ...(showDocImprovements !== undefined && { showDocImprovements }),
      ...(showCodeStyleTweaks !== undefined && { showCodeStyleTweaks }),
      ...(showUnmerged !== undefined && { showUnmerged }),
    });
  }
}
