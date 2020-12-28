import {
  combineQueries,
  EntityUIQuery,
  Query,
  QueryConfig,
  QueryEntity,
  Order,
} from "@datorama/akita";
import { map } from "rxjs/operators";
import type { Observable } from "rxjs";

import type {
  ActivitiesState,
  CVState,
  OrgsState,
  OrgTypesState,
  LanguagesState,
  ActivityTypesState,
  ActivitiesUIState,
} from "./store";
import {
  CVStore,
  ActivitiesStore,
  ActivityTypesStore,
  LanguagesStore,
  OrgsStore,
  OrgTypesStore,
} from "./store";
import type { LanguageName, IActivity } from "../types";

export const difference = (
  left: Set<unknown> | unknown[],
  right: Set<unknown> | unknown[]
): unknown[] => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter((x) => !b.has(x));
};

export const hasAny = (
  left: Set<unknown> | unknown[],
  right: Set<unknown> | unknown[]
): unknown[] => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter((x) => b.has(x));
};

@QueryConfig({
  sortBy: "createdDate",
  sortByOrder: Order.DESC,
})
export class ActivitiesQuery extends QueryEntity<ActivitiesState> {
  ui: EntityUIQuery<ActivitiesUIState>;

  selectLoading$(): Observable<boolean> {
    return this.select((state) => state.ui.isLoading);
  }

  constructor(protected store: ActivitiesStore) {
    super(store);
    this.createUIQuery();
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

  visibleActivities$(): Observable<IActivity[]> {
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
            return activeActivityTypes.some((v) => v === activity.activityType);
          });
        }
        return a;
      })
    );
  }

  visibleLanguages$(): Observable<LanguageName[]> {
    /* Return available languages based on currently visible activities */
    return combineQueries([this.visibleActivities$()]).pipe(
      map(([visibleActivities]) => {
        const a = visibleActivities;
        if (!visibleActivities.length) {
          // If no filters selected, return all activities
          return [];
        }

        return Array.from(
          new Set(
            a
              .map((activity) => {
                const org = this.orgsQuery.getEntity(activity.orgId);
                if (!org?.languages) {
                  return [];
                }

                return org?.languages;
              })
              .flat()
          )
        ).filter(Boolean);
      })
    );
  }
}
