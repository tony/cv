import {
  combineQueries,
  EntityUIQuery,
  Query,
  QueryConfig,
  QueryEntity,
  Order,
} from "@datorama/akita";
import getYear from "date-fns/getYear";
import { map, take } from "rxjs/operators";
import type { Observable } from "rxjs";
import moment from "moment";

import type {
  ActivitiesState,
  CVState,
  OrgsState,
  OrgTypesState,
  LanguagesState,
  ActivityTypesState,
  ActivitiesUIState,
  ActivityUI,
} from "./store";
import {
  CVStore,
  ActivitiesStore,
  ActivityTypesStore,
  LanguagesStore,
  OrgsStore,
  OrgTypesStore,
} from "./store";
import { LANGUAGE_FALLBACK_COLOR } from "@tony/cv-data/constants";
import type {
  IActivity,
  IOrg,
  Language,
  LanguageName,
} from "@tony/cv-data/types";
import { hasAny } from "../utils";

export type LanguageCount = Record<LanguageName, number>;
export type ActivityCount = Record<string, number>;

export interface Results {
  activities: IActivity[];
  languages: Language[];

  // Counts
  languageCount: LanguageCount;
  activityCount: ActivityCount;

  // UX
  ui: {
    isLoading: boolean;
  };
}

export const DEFAULT_FILTERS: CVState = {
  showReleases: false,
  showTypos: false,
  showDocImprovements: false,
  showCodeStyleTweaks: false,
  showUnmerged: false,
  startYear: 2007,
  endYear: 2022,
};

export const DEFAULT_RESULTS: Results = {
  activities: [],
  languages: [],

  // Counts
  languageCount: {},
  activityCount: {},

  // UX
  ui: { isLoading: false },
};

@QueryConfig({
  sortBy: "createdAt",
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
const ORG_WEIGHT_MAP = {
  Company: 0,
  Publication: 1,
  Website: 2,
  "Open Source": 3,
};

@QueryConfig({
  sortBy: (orgA: IOrg, orgB: IOrg) => {
    return ORG_WEIGHT_MAP[orgA.orgType] == ORG_WEIGHT_MAP[orgB.orgType]
      ? 1
      : -1;
  },
})
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

  selectBackgroundColors$(
    ...args: Parameters<typeof LanguagesQuery.prototype.selectAll>
  ): Observable<Record<LanguageName, string>> {
    return this.selectAll(...args).pipe(
      map((languages) => {
        return Object.fromEntries<string>(
          languages
            .filter((language) => language.id)
            .map((language) => [
              language.id as LanguageName,
              (language.ui?.backgroundColor as string) ??
                LANGUAGE_FALLBACK_COLOR,
            ])
        );
      })
    ) as Observable<Record<LanguageName, string>>;
  }

  // await $$queries.languages.getBackgroundColors()
  // await $$queries.languages.getBackgroundColors({filterBy: (lang) => lang.id == 'Python'})
  getBackgroundColors(
    ...args: Parameters<typeof LanguagesQuery.prototype.selectBackgroundColors$>
  ): Promise<Record<LanguageName, string>> {
    return this.selectBackgroundColors$(...args)
      .pipe(take(1))
      .toPromise();
  }

  selectTextColors$(
    ...args: Parameters<typeof LanguagesQuery.prototype.selectAll>
  ): Observable<Record<LanguageName, string>> {
    return this.selectAll(...args).pipe(
      map((languages) => {
        return Object.fromEntries<string>(
          languages
            .filter((language) => language.id)
            .map((language) => [language.id, language.ui.color as string])
        );
      })
    ) as Observable<Record<LanguageName, string>>;
  }

  // await $$queries.languages.getBackgroundColors()
  // await $$queries.languages.getTextColors({filterBy: (lang) => lang.id == 'Python'})
  getTextColors(
    ...args: Parameters<typeof LanguagesQuery.prototype.selectTextColors$>
  ): Promise<Record<LanguageName, string>> {
    return this.selectTextColors$(...args)
      .pipe(take(1))
      .toPromise();
  }
}

const filterActivitiesByYear = (
  activities: IActivity[],
  { startYear, endYear }: { startYear: number; endYear: number }
) => {
  return activities.filter((activity: IActivity) => {
    if (activity?.createdAt) {
      const createdAt = new Date(activity.createdAt);
      const createdYear = getYear(createdAt);
      if (startYear > createdYear) {
        return false;
      }

      if (endYear < createdYear) {
        return false;
      }
    }
    return true;
  });
};

const filterActivitiesByFilters = (
  activities: IActivity[],
  activityTraits: Record<number, ActivityUI>,
  {
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
  }
) => {
  return activities.filter((activity: IActivity) => {
    const traits = activityTraits[activity.id];
    if (!showReleases && traits.isRelease) {
      return false;
    }
    if (!showTypos && traits.isTypo) {
      return false;
    }
    if (!showDocImprovements && traits.isDocImprovement) {
      return false;
    }
    if (!showCodeStyleTweaks && traits.isCodeStyleTweak) {
      return false;
    }
    if (!showUnmerged && !traits.isMerged) {
      return false;
    }

    return true;
  });
};

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
      this.select(),
      this.activitiesQuery.selectAll(),
      this.activitiesQuery.ui.selectAll({ asObject: true }),
      this.languagesQuery.selectActive((language) => {
        return language.id;
      }),
      this.orgsQuery.selectActive((org) => {
        return org.id;
      }),
      this.activityTypesQuery.selectActive((activityType) => {
        return activityType.id;
      }),
    ]).pipe(
      map(
        ([
          cv,
          activities,
          activityTraits,
          activeLanguages,
          activeOrgs,
          activeActivityTypes,
        ]) => {
          let a = filterActivitiesByYear(activities, {
            startYear: cv.startYear,
            endYear: cv.endYear,
          });
          a = filterActivitiesByFilters(a, activityTraits, {
            showTypos: cv.showTypos,
            showReleases: cv.showReleases,
            showDocImprovements: cv.showDocImprovements,
            showCodeStyleTweaks: cv.showCodeStyleTweaks,
            showUnmerged: cv.showUnmerged,
          });
          if (
            !activeLanguages.length &&
            !activeOrgs.length &&
            !activeActivityTypes.length
          ) {
            // If no filters selected, return all activities
            return a;
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
                (v) => v === activity.activityType
              );
            });
          }
          return a;
        }
      )
    );
  }

  visibleLanguages$(): Observable<Language[]> {
    /* Return available languages based on currently visible activities */
    return this.visibleActivities$().pipe(
      map((visibleActivities) => {
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
        return this.languagesQuery
          .getAll()
          .filter((language) => languageNames.includes(language.id));
      })
    );
  }

  _activitiesToYearMap(
    selectActivity: Observable<IActivity[]>
  ): Observable<ActivityCount> {
    return selectActivity.pipe(
      map((activities) => {
        return activities.reduce((jsonData, activity) => {
          if (activity.createdAt) {
            const year = moment(activity.createdAt).get("year").toString();
            if (year in jsonData) {
              jsonData[year] += 1;
            } else {
              jsonData[year] = 1;
            }
          }
          return jsonData;
        }, {} as ActivityCount);
      })
    );
  }

  // await $$queries.CV.activityYearCount$().forEach((count) => console.log(count))
  activityYearCount$(
    ...args: Parameters<typeof LanguagesQuery.prototype.selectTextColors$>
  ): Observable<ActivityCount> {
    return this._activitiesToYearMap(this.activitiesQuery.selectAll(...args));
  }

  // await $$queries.CV.visibleActivityYearCount$().forEach((count) => console.log(count))
  visibleActivityYearCount$(): Observable<ActivityCount> {
    return this._activitiesToYearMap(this.visibleActivities$());
  }

  // await $$queries.CV.getVisibleActivityYearCount()
  getVisibleActivityYearCount(): Promise<ActivityCount> {
    return this.visibleActivityYearCount$().pipe(take(1)).toPromise();
  }

  _activitiesToLanguageCountMap(
    selectActivity: Observable<IActivity[]>
  ): Observable<LanguageCount> {
    return selectActivity.pipe(
      map((activities) => {
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

  // await $$queries.CV.languageCount$().forEach((count) => console.log(count))
  languageCount$(): Observable<LanguageCount> {
    return this._activitiesToLanguageCountMap(this.activitiesQuery.selectAll());
  }

  // await $$queries.CV.visibleLanguageCount$().forEach((count) => console.log(count))
  visibleLanguageCount$(): Observable<LanguageCount> {
    return this._activitiesToLanguageCountMap(this.visibleActivities$());
  }

  // await $$queries.CV.getVisibleLanguageCount()
  getVisibleLanguageCount(): Promise<Record<LanguageName, number>> {
    return this.visibleLanguageCount$().pipe(take(1)).toPromise();
  }

  subResults$(): Observable<Results> {
    // return DEFAULT_RESULTS;
    return combineQueries([
      this.visibleActivities$(),
      this.visibleLanguages$(),
      this.visibleLanguageCount$(),
      this.visibleActivityYearCount$(),
      this.activitiesQuery.selectLoading(),
    ]).pipe(
      map(
        ([activities, languages, languageCount, activityCount, isLoading]) => {
          return {
            ...DEFAULT_RESULTS,
            activities,
            languages,
            languageCount,
            activityCount,
            ui: { isLoading },
          };
        }
      )
    );
  }

  // await $queries.CV.getResults()
  getResults(): Promise<Results> {
    return this.subResults$().pipe(take(1)).toPromise();
  }
}
