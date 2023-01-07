import getYear from "date-fns/getYear";
import { configure } from "mobx";
import { types, SnapshotIn } from "mobx-state-tree";
import { Instance, applySnapshot } from "mobx-state-tree";
import moment from "moment";

import { LANGUAGE_FALLBACK_COLOR } from "@tony/cv-data/constants";
import type { fetchDataFn } from "@tony/cv-data/fetch";
import { ActivityTypeName, OrgTypeName } from "@tony/cv-data/types";
import * as matchers from "@tony/cv-lib/search/utils";

import { hasAny } from "../utils";

configure({
  enforceActions: "always",
  // computedRequiresReaction: true,
  // reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  disableErrorBoundaries: true,
});

export type LanguageCount = Record<string, number>;
export type ActivityCount = Record<string, string>;

export const INITIAL_SEARCH_OPTIONS: SnapshotIn<typeof SearchOptions> = {
  showReleases: false,
  showTypos: false,
  showDocImprovements: false,
  showCodeStyleTweaks: false,
  showUnmerged: false,
  startYear: 2007,
  endYear: 2022,
};

export const INITIAL_UI: SnapshotIn<typeof UI> = {
  isLoading: true,
};

export const ActivityMeta = types.model("ActivityMeta", {
  isOptionDisabled: types.boolean,
  isRelease: types.boolean,
  isTypo: types.boolean,
  isDocImprovement: types.boolean,
  isCodeStyleTweak: types.boolean,
  isMerged: types.boolean,
});

export const activityUI = ActivityMeta.create({
  isOptionDisabled: false,
  isRelease: false,
  isTypo: false,
  isDocImprovement: false,
  isCodeStyleTweak: false,
  isMerged: false,
});

export const UiCssProperties = types.model("UiCssProperties", {
  color: types.optional(types.maybeNull(types.string), null),
  backgroundColor: types.optional(types.maybeNull(types.string), null),
});

export const Language = types.model("Language", {
  id: types.identifier,
  ui: UiCssProperties,
});

export const ActivityType = types.model("ActivityType", {
  id: types.identifier,
  name: types.string,
  ui: UiCssProperties,
});

export const OrgType = types.model("OrgType", {
  id: types.identifier,
  name: types.string,
  ui: UiCssProperties,
});

export const Org = types.model("Org", {
  id: types.identifier,
  orgType: types.enumeration<OrgTypeName>(
    "OrgTypeName",
    Object.values(OrgTypeName)
  ),
  name: types.string,
  url: types.optional(types.maybeNull(types.string), null),
  languages: types.array(types.reference(Language)),
});

export const Activity = types
  .model("Activity", {
    id: types.identifier,
    title: types.string,
    activityType: types.enumeration<ActivityTypeName>(
      "ActivityTypeName",
      Object.values(ActivityTypeName)
    ),
    org: types.reference(Org),
    meta: ActivityMeta,

    // Dates
    createdAt: types.string,
    acceptedAt: types.optional(types.maybeNull(types.string), null),
    startedAt: types.optional(types.maybeNull(types.string), null),
    endedAt: types.optional(types.maybeNull(types.string), null),

    // URLs (OpenSource)
    qaUrl: types.optional(types.maybeNull(types.string), null),
    diffUrl: types.optional(types.maybeNull(types.string), null),
  })
  .preProcessSnapshot((activity): Instance<typeof Activity> => {
    return {
      ...activity,
      meta: {
        isOptionDisabled: false,
        isRelease: matchers.isActivityRelease(activity),
        isTypo: matchers.isActivityTypoFix(activity),
        isDocImprovement: matchers.isActivityDocImprovement(activity),
        isCodeStyleTweak: matchers.isActivityCodeStyleTweak(activity),
        isMerged:
          activity.activityType == "Patch"
            ? matchers.isActivityMerged(activity)
            : true,
      },
    };
  });

export const SearchOptions = types.model("SearchOptions", {
  showReleases: types.boolean,
  showTypos: types.boolean,
  showDocImprovements: types.boolean,
  showCodeStyleTweaks: types.boolean,
  showUnmerged: types.boolean,
  startYear: types.number,
  endYear: types.number,

  languages: types.array(types.reference(Language)),
  activityTypes: types.array(types.reference(ActivityType)),
  orgs: types.array(types.reference(Org)),
});

export const UI = types.model("UI", {
  isLoading: types.boolean,
});

export const sortActivities = (
  activities: Instance<typeof CVState>["activities"]
) => {
  return activities
    .sort((a: Instance<typeof Activity>, b: Instance<typeof Activity>) =>
      a?.createdAt > b?.createdAt ? 1 : a.createdAt === b.createdAt ? 0 : -1
    )
    .reverse();
};

export const filterActivitiesByYear = (
  activities: Instance<typeof CVState>["activities"],
  { startYear, endYear }: { startYear: number; endYear: number }
) => {
  return activities.filter((activity: Instance<typeof Activity>) => {
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

export const filterActivitiesByFilters = (
  activities: Instance<typeof CVState>["activities"],
  {
    showReleases,
    showTypos,
    showDocImprovements,
    showCodeStyleTweaks,
    showUnmerged,
    languages,
    orgs,
    activityTypes,
  }: Instance<typeof SearchOptions>
) => {
  const activeLanguageIds = languages.map(({ id }) => id);
  const activeOrgIds = orgs.map(({ id }) => id);
  const activeActivityTypeIds = activityTypes.map(({ id }) => id);
  const activitiesFilteredByLanguage =
    languages?.length > 0
      ? activities.filter((activity: Instance<typeof Activity>) => {
          return (
            hasAny(
              new Set(
                activity.org.languages.map(
                  ({ id }: Instance<typeof Language>) => id
                )
              ),
              activeLanguageIds
            ).length > 0
          );
        })
      : activities;
  const activitiesFilteredByOrg =
    orgs?.length > 0
      ? activitiesFilteredByLanguage.filter(
          (activity: Instance<typeof Activity>) => {
            return activeOrgIds.includes(activity.org.id);
          }
        )
      : activitiesFilteredByLanguage;
  const activitiesFilteredByActivityType =
    activityTypes?.length > 0
      ? activitiesFilteredByOrg.filter(
          (activity: Instance<typeof Activity>) => {
            return activeActivityTypeIds.includes(activity.activityType);
          }
        )
      : activitiesFilteredByOrg;
  return activitiesFilteredByActivityType.filter(
    (activity: Instance<typeof Activity>) => {
      if (activity.activityType !== "Patch") {
        return true;
      }

      if (!showReleases && activity.meta.isRelease) {
        return false;
      }
      if (!showTypos && activity.meta.isTypo) {
        return false;
      }
      if (!showDocImprovements && activity.meta.isDocImprovement) {
        return false;
      }
      if (!showCodeStyleTweaks && activity.meta.isCodeStyleTweak) {
        return false;
      }
      if (!showUnmerged && !activity.meta.isMerged) {
        return false;
      }

      return true;
    }
  );
};

export const CVState = types
  .model("CVState", {
    searchOptions: SearchOptions,
    ui: UI,

    // Data
    activities: types.array(Activity),
    languages: types.array(Language),
    orgs: types.array(Org),
    orgTypes: types.array(OrgType),
    activityTypes: types.array(ActivityType),
  })
  .actions((self) => {
    const fetchData: fetchDataFn = async () => {
      return import(/* webpackChunkName: "cvData" */ "@tony/cv-data/raw");
    };
    async function afterCreate() {
      self.ui.isLoading = true;
      const data = await fetchData();

      applySnapshot(self, {
        ui: { isLoading: false },
        searchOptions: INITIAL_SEARCH_OPTIONS,
        activities: data.activities,
        languages: data.languages,
        orgs: data.orgs,
        orgTypes: data.orgTypes,
        activityTypes: data.activityTypes,
      });
    }

    return {
      loadActivities: (items: any) => {
        for (const i of items) {
          self.activities.push(i as unknown as any);
        }
      },
      afterCreate,
      setLanguages(languageIds: string[]) {
        self.searchOptions.languages.splice(
          0,
          self.searchOptions.languages.length,
          ...languageIds
        );
      },
      setYears({ startYear, endYear }: { startYear: number; endYear: number }) {
        self.searchOptions.endYear = endYear;
        self.searchOptions.startYear = startYear;
      },
      setActivityTypes(activityTypeIds: string[]) {
        self.searchOptions.activityTypes.splice(
          0,
          self.searchOptions.activityTypes.length,
          ...activityTypeIds
        );
      },
      setOrgs(orgIds: string[]) {
        self.searchOptions.orgs.splice(
          0,
          self.searchOptions.orgs.length,
          ...orgIds
        );
      },
      setSearchOptions(searchOptions: Partial<Instance<typeof SearchOptions>>) {
        self.searchOptions = {
          ...self.searchOptions,
          ...searchOptions,
        };
      },
    };
  })
  .views((self) => ({
    get languageCount(): number {
      return self.languages.length;
    },
    get sortedActivities(): Instance<typeof Activity>[] {
      return sortActivities(Array.from(self.activities.values()));
    },
    search({
      startYear = INITIAL_SEARCH_OPTIONS["startYear"],
      endYear = INITIAL_SEARCH_OPTIONS["endYear"],
      ...activityTraits
    }: Instance<typeof SearchOptions>) {
      return sortActivities(
        filterActivitiesByFilters(
          filterActivitiesByYear(Array.from(self.activities.values()), {
            startYear,
            endYear,
          }),
          activityTraits
        )
      );
    },

    get filteredActivities(): Instance<typeof Activity>[] {
      return this.search({ ...self.searchOptions });
    },

    get activityYearMap() {
      return Array.from(this.filteredActivities.values()).reduce(
        (jsonData, activity) => {
          if (activity.createdAt) {
            const year = moment(activity.createdAt).get("year").toString();
            if (year in jsonData) {
              jsonData[year] += 1;
            } else {
              jsonData[year] = 1;
            }
          }
          return jsonData;
        },
        {} as ActivityCount
      );
    },
    get languageYearMap() {
      return Array.from(this.filteredActivities.values()).reduce(
        (languages, activity) => {
          activity.org.languages.forEach(
            ({ id: languageName }: Instance<typeof Language>) => {
              if (languageName) {
                if (languageName in languages) {
                  languages[languageName] += 1;
                } else {
                  languages[languageName] = 1;
                }
              }
            }
          );
          return languages;
        },
        Object.fromEntries<number>(
          self.languages
            .filter(({ id }: Instance<typeof Language>) => id)
            .map(({ id }) => [id as string, 0])
        )
      ) as LanguageCount;
    },
    get backgroundColors() {
      return Object.fromEntries<string>(
        self.languages
          .filter(({ id }: Instance<typeof Language>) => id)
          .map((language: Instance<typeof Language>) => [
            language.id, // as LanguageName,
            (language.ui?.backgroundColor as string) ?? LANGUAGE_FALLBACK_COLOR,
          ])
      );
    },
    get textColors() {
      return Object.fromEntries<string>(
        self.languages
          .filter(({ id }: Instance<typeof Language>) => id)
          .map((language: Instance<typeof Language>) => [
            language.id, // as LanguageName,
            language.ui?.backgroundColor as string,
          ])
      );
    },
  }));

export const state = CVState.create({
  searchOptions: INITIAL_SEARCH_OPTIONS,
  ui: { isLoading: true },
  activities: [],
  languages: [],
  orgs: [],
  orgTypes: [],
  activityTypes: [],
});
