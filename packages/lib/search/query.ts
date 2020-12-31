import {
  combineQueries,
  EntityUIQuery,
  Query,
  QueryConfig,
  QueryEntity,
  Order,
} from "@datorama/akita";
import { map, take } from "rxjs/operators";
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
import type { Language, IActivity } from "../types";

export interface LanguageCount {
  [key: string]: number;
}

interface CVCount {
  activities: number;
  languages: number;
  orgTypes: number;
  orgs: number;
  activityTypes: number;
}

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
  ui!: EntityUIQuery<ActivitiesUIState>;

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

  visibleLanguages$(): Observable<Language[]> {
    /* Return available languages based on currently visible activities */
    return combineQueries([
      this.visibleActivities$(),
      this.languagesQuery.selectAll(),
    ]).pipe(
      map(([visibleActivities, languages]) => {
        const a = visibleActivities;
        if (!visibleActivities.length) {
          // If no filters selected, return all activities
          return [];
        }

        const languageNames = Array.from(
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
        return languages.filter((language) =>
          languageNames.includes(language.id)
        );
      })
    );
  }

  // await $$queries.CV.selectLanguageActivitiesCount$().forEach((count) => console.log(count))
  selectLanguageActivitiesCount$(
    {
      onlyVisible,
    }: {
      onlyVisible: boolean;
    } = { onlyVisible: false }
  ): Observable<LanguageCount> {
    const selectActivity = onlyVisible
      ? this.visibleActivities$()
      : this.activitiesQuery.selectAll();
    return combineQueries([selectActivity]).pipe(
      map(([activities]) => {
        return activities.reduce(
          (languages, activity) => {
            const org = this.orgsQuery.getEntity(activity.orgId);
            if (!org?.languages || !org?.languages?.length) {
              return languages;
            }

            org.languages.forEach((languageName) => {
              if (languageName) {
                if (languageName in languages) {
                  languages[languageName] += 1;
                } else {
                  languages[languageName] = 1;
                }
              }
            });
            return languages;
          },
          Object.fromEntries<number>(
            this.languagesQuery
              .getAll()
              .filter((language) => language?.id)
              .map((language) => [language.id as string, 0])
          )
        ) as LanguageCount;
      })
    );
  }

  // await $$queries.CV.getLanguageActivitiesCount()
  // await $$queries.CV.getLanguageActivitiesCount({onlyVisible: true})
  getLanguageActivitiesCount(
    {
      onlyVisible,
    }: {
      onlyVisible: boolean;
    } = { onlyVisible: false }
  ): Promise<{ [keyof: string]: number }> {
    return this.selectLanguageActivitiesCount$({ onlyVisible })
      .pipe(take(1))
      .toPromise();
  }

  // $$queries.CV.selectCountAll$().forEach((count) => console.log(count))
  selectCountAll$(): Observable<CVCount> {
    return combineQueries([this.visibleActivities$()]).pipe(
      map(([visibleActivities]) => {
        return {
          activities: visibleActivities.length,
          languages: 0,
          orgTypes: 0,
          orgs: 0,
          activityTypes: 0,
        };
      })
    );
  }

  // await $$queries.CV.getCountAll()
  getCountAll(): Promise<CVCount> {
    return this.selectCountAll$().pipe(take(1)).toPromise();
  }
}
