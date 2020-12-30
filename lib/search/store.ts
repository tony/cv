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

import type {
  ActivityType,
  Language,
  OrgType,
  IActivity,
  IOrg,
} from "../types";
import {
  isActivityTypoFix,
  isActivityDocImprovement,
  isActivityCodeStyleTweak,
  isActivityMerged,
} from "./utils";

export type CVState = Record<string, never>;

interface ActivityUI {
  isOptionDisabled: boolean;
  isTypo: boolean;
  isDocImprovement: boolean;
  isCodeStyleTweak: boolean;
  isMerged: boolean;
}

const ACTIVITY_UI_DEFAULTS: ActivityUI = {
  isOptionDisabled: false,
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

// export type ActivitiesUIState = EntityState<ActivityUI>;
export interface ActivitiesUIState extends EntityState<ActivityUI> {}

const setUIDefaults = (activity: IActivity): ActivityUI => {
  return {
    ...ACTIVITY_UI_DEFAULTS,
    isTypo: isActivityTypoFix(activity),
    isDocImprovement: isActivityDocImprovement(activity),
    isCodeStyleTweak: isActivityCodeStyleTweak(activity),
    isMerged: isActivityMerged(activity),
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
    super();
    super({ active: [] });
  }
}

export interface OrgTypesState extends EntityState<OrgType>, MultiActiveState {}

@StoreConfig({ name: "orgTypes" })
export class OrgTypesStore extends EntityStore<OrgTypesState, OrgType> {
  constructor() {
    super();
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
    super({});
  }
}
