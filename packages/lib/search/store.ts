/*
 * Naming conventions inspired by data-forge-ts
 */
import {
  EntityUIStore,
  EntityState,
  EntityStore,
  MultiActiveState,
  Store,
  StoreConfig,
} from "@datorama/akita";

import { ActivityTypeName } from "@tony/cv-data/types";

import type {
  ActivityType,
  Language,
  OrgType,
  IActivity,
  IActivityOpenSource,
  IOrg,
} from "@tony/cv-data/types";
import {
  isActivityRelease,
  isActivityTypoFix,
  isActivityDocImprovement,
  isActivityCodeStyleTweak,
  isActivityMerged,
} from "@tony/cv-lib/search/utils";

export type CVState = {
  showReleases: boolean;
  showTypos: boolean;
  showDocImprovements: boolean;
  showCodeStyleTweaks: boolean;
  showUnmerged: boolean;
  startYear: number;
  endYear: number;
}; // Record<string, never>;
import { DEFAULT_FILTERS } from "@tony/cv-lib/search/query";

export interface ActivityUI {
  isOptionDisabled: boolean;
  isRelease: boolean;
  isTypo: boolean;
  isDocImprovement: boolean;
  isCodeStyleTweak: boolean;
  isMerged: boolean;
}

const ACTIVITY_UI_DEFAULTS: ActivityUI = {
  isOptionDisabled: false,
  isRelease: false,
  isTypo: false,
  isDocImprovement: false,
  isCodeStyleTweak: false,
  isMerged: false,
};

export interface ActivitiesState
  extends EntityState<IActivity>,
    MultiActiveState {
  ui: { isLoading: boolean };
}

export type ActivitiesUIState = EntityState<ActivityUI>;
// export interface ActivitiesUIState extends EntityState<ActivityUI> {}

const setUIDefaults = (activity: IActivity): ActivityUI => {
  return {
    ...ACTIVITY_UI_DEFAULTS,
    isRelease: isActivityRelease(activity),
    isTypo: isActivityTypoFix(activity),
    isDocImprovement: isActivityDocImprovement(activity),
    isCodeStyleTweak: isActivityCodeStyleTweak(activity),
    isMerged:
      activity.activityType == ActivityTypeName.Patch
        ? isActivityMerged(activity as IActivityOpenSource)
        : true,
  };
};

@StoreConfig({ name: "activities" })
export class ActivitiesStore extends EntityStore<ActivitiesState, IActivity> {
  ui!: EntityUIStore<ActivitiesUIState>;

  constructor() {
    super({
      active: [],
      ui: { isLoading: false },
    });

    // Set state of item being selected, disabled, etc.
    // $$queries.activities.ui.getAll({filterBy: (entity) => entity.isTypo})
    // $$queries.activities.ui.getAll({filterBy: (entity) => entity.isTypo && entity.isMerged})
    // $$queries.activities.ui.getCount((entity) => entity.isTypo)
    this.createUIStore().setInitialEntityState(setUIDefaults);
  }

  setLoading(isLoading: boolean): void {
    this.update({ ui: { isLoading } });
  }
}

export interface ActivityTypesState
  extends EntityState<ActivityType>,
    MultiActiveState {}

@StoreConfig({ name: "activityTypes" })
export class ActivityTypesStore extends EntityStore<
  ActivityTypesState,
  ActivityType
> {
  constructor() {
    super({ active: [] });
  }
}

export interface OrgTypesState extends EntityState<OrgType>, MultiActiveState {}

@StoreConfig({ name: "orgTypes" })
export class OrgTypesStore extends EntityStore<OrgTypesState, OrgType> {
  constructor() {
    super({ active: [] });
  }
}

export interface OrgsState extends EntityState<IOrg>, MultiActiveState {}

@StoreConfig({ name: "orgs" })
export class OrgsStore extends EntityStore<OrgsState, IOrg> {
  constructor() {
    super({ active: [] });
  }
}

export interface LanguagesState
  extends EntityState<Language>,
    MultiActiveState {}

@StoreConfig({ name: "languages" })
export class LanguagesStore extends EntityStore<LanguagesState, Language> {
  constructor() {
    super({ active: [] });
  }
}

@StoreConfig({ name: "CV" })
export class CVStore extends Store<CVState> {
  constructor() {
    super(DEFAULT_FILTERS);
  }
}
