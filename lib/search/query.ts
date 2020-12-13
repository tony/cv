import { combineQueries, Query, QueryEntity } from "@datorama/akita";
import { filter, map, tap } from "rxjs/operators";

import type {
  ActivitiesState,
  CVState,
  OrgsState,
  OrgTypesState,
  LanguagesState,
  ActivityTypesState,
} from "./store";
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

const difference = (left: Set<any> | any[], right: Set<any> | any[]) => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter((x) => !b.has(x));
};

const hasAny = (left: Set<any> | any[], right: Set<any> | any[]) => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter((x) => b.has(x));
};

export class ActivitiesQuery extends QueryEntity<ActivitiesState> {
  constructor(protected store: ActivitiesStore) {
    super(store);
  }
}

export class ActivityTypesQuery extends QueryEntity<ActivityTypesState> {
  constructor(protected store: ActivityTypesStore) {
    super(store);
  }
}

export class OrgsQuery extends QueryEntity<OrgsState> {
  constructor(protected store: OrgsStore) {
    super(store);
  }
}

export class OrgTypesQuery extends QueryEntity<OrgTypesState> {
  constructor(protected store: OrgTypesStore) {
    super(store);
  }
}

export class LanguagesQuery extends QueryEntity<LanguagesState> {
  constructor(protected store: LanguagesStore) {
    super(store);
  }
}

export class CVQuery extends Query<CVState> {
  constructor(
    protected store: CVStore,
    protected activitiesQuery: ActivitiesQuery,
    protected activityTypesQuery: ActivityTypesQuery,
    protected languagesQuery: LanguagesQuery,
    protected orgsQuery: OrgsQuery,
    protected orgTypesQuery: OrgTypesQuery
  ) {
    super(store);
  }
  // get getData() {
  //   const data = this.getValue();
  //   const { orgs, activityTypes, orgTypes, languages } = data;
  //   let activities: IActivity[] = [];
  //   const langs = Array.from(languages.values());
  //   if (langs) {
  //     activities = activities.concat(
  //       data.activities.filter((activity) => {
  //         return langs.some((language) =>
  //           SearchFilters.languages(language, activity, data)
  //         );
  //       })
  //     );
  //   }
  //
  //   return {
  //     activities,
  //     activityTypes,
  //     orgTypes,
  //     orgs,
  //     languages,
  //   };
  // }

  get getResults(): CVState & { orgs: IOrg[] } {
    // const data = this.getValue();
    const data = this.store.getValue();

    const orgs = this.orgsQuery.getAll();
    const activityTypes = this.activityTypesQuery.getAll();
    const orgTypes = this.orgTypesQuery.getAll();

    return {
      activityTypes: this.activityTypesQuery.getAll(),
      activities: this.activitiesQuery.getAll(),
      languages: this.languagesQuery.getAll(),
      orgs: this.orgsQuery.getAll(),
      orgTypes: this.orgTypesQuery.getAll(),
    };
  }

  activities$() {
    return combineQueries([
      this.activitiesQuery.selectAll(),

      this.languagesQuery.selectActive((language) => {
        return language.id;
      }),
      this.orgsQuery.selectActive((org) => {
        return org.name;
      }),
      this.activityTypesQuery.selectActive((activityType) => {
        return activityType.id;
      }),
    ]).pipe(
      map(([activities, activeLanguages, activeOrgs, activeActivityTypes]) => {
        let a = activities;
        if (
          !activeLanguages.length &&
          !activeOrgs.length &&
          !activeActivityTypes.length
        ) {
          // If no filters selected, return all activities
          return activities;
        }

        if (activeLanguages.length) {
          a = a.filter((activity) => {
            const org = this.orgsQuery.getEntity(activity.orgId);
            if (!org?.languages) {
              return false;
            }

            return hasAny(new Set(org.languages), activeLanguages).length > 0;
          });
        }
        if (activeOrgs.length) {
          a = a.filter((activity) => {
            return activeOrgs.some((v) => v === activity.orgId);
          });
        }
        if (activeActivityTypes.length) {
          a = a.filter((activity) => {
            return activeActivityTypes.some(
              (v) => v === activity.componentName
            );
          });
        }
        return a;
      })
    );
  }
}