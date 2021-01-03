import {
  combineQueries,
  EntityUIQuery,
  Query,
  QueryConfig,
  QueryEntity,
  Order,
} from "@datorama/akita";
import { map, take } from "rxjs/operators";
import { of } from "rxjs";
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
} from "./store";
import {
  CVStore,
  ActivitiesStore,
  ActivityTypesStore,
  LanguagesStore,
  OrgsStore,
  OrgTypesStore,
} from "./store";
import type { IActivity, Language, LanguageName } from "../data/types";
import { hasAny } from "../utils";

export type LanguageCount = Record<LanguageName, number>;
export type ActivityCount = Record<string, number>;

export type DonutChartProps = Record<string, never>;
export type LineChartProps = Record<string, never>;

export interface Results {
  activities: IActivity[];
  languages: Language[];

  // Counts
  languageCount: LanguageCount;
  activityCount: ActivityCount;

  // Charts
  donutChart: DonutChartProps;
  lineChart: LineChartProps;

  // UX
  ui: {
    isLoading: boolean;
  };
}

export const DEFAULT_RESULTS: Results = {
  activities: [],
  languages: [],

  // Counts
  languageCount: {},
  activityCount: {},

  // Charts
  donutChart: {},
  lineChart: {},

  // UX
  ui: { isLoading: false },
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
              language.ui.backgroundColor as string,
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
        return org.id;
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
          if (activity.createdDate) {
            const year = moment(activity.createdDate).get("year").toString();
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

  //
  // Chart
  //
  subDonutChart$(): Observable<DonutChartProps> {
    return of({});
  }

  // await $queries.CV.getDonutChart()
  getDonutChart(): Promise<DonutChartProps> {
    return this.subDonutChart$().pipe(take(1)).toPromise();
  }

  subLineChart$(): Observable<LineChartProps> {
    return of({});
  }

  // await $queries.CV.getLineChart()
  getLineChart(): Promise<LineChartProps> {
    return this.subLineChart$().pipe(take(1)).toPromise();
  }

  subResults$(): Observable<Results> {
    // return DEFAULT_RESULTS;
    return combineQueries([
      this.visibleActivities$(),
      this.visibleLanguages$(),
      this.visibleLanguageCount$(),
      this.visibleActivityYearCount$(),
      this.subLineChart$(),
      this.subDonutChart$(),
      this.activitiesQuery.selectLoading(),
    ]).pipe(
      map(
        ([
          activities,
          languages,
          languageCount,
          activityCount,
          lineChart,
          donutChart,
          isLoading,
        ]) => {
          return {
            ...DEFAULT_RESULTS,
            activities,
            languages,
            languageCount,
            activityCount,
            donutChart,
            lineChart,
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
