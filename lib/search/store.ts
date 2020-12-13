/*
 * Naming conventions inspired by data-forge-ts
 */
import {
  EntityState,
  EntityStore,
  MultiActiveState,
  Store,
  StoreConfig,
} from "@datorama/akita";

import {
  ActivityType,
  LanguageName,
  Language,
  OrgName,
  OrgType,
  IActivity,
  IOrg,
} from "../types";

export interface ISearches {
  [key: string]: Set<string | LanguageName>;
  activityTypes: Set<string>;
  orgTypes: Set<string>;
  orgs: Set<string>;
  languages: Set<LanguageName>;
}
export interface CVState {
  activities: IActivity[];
  activityTypes: ActivityType[];
  orgTypes: OrgType[];
  orgs: IOrg[];
  languages: Language[];
}

export interface ActivitiesState
  extends EntityState<IActivity>,
    MultiActiveState {}

@StoreConfig({ name: "activities" })
export class ActivitiesStore extends EntityStore<ActivitiesState, IActivity> {
  constructor() {
    super({ active: [] });
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

@StoreConfig({ name: "orgs", idKey: "name" })
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

export function createInitialState(): Partial<CVState> {
  return {
    // State
    languages: [],
  };
}

@StoreConfig({ name: "CV" })
export class CVStore extends Store<CVState> {
  constructor() {
    super(createInitialState());
  }
}