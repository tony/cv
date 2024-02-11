import getYear from "date-fns/getYear";
import { configure } from "mobx";
import {
  type Instance,
  type SnapshotIn,
  applySnapshot,
  castToSnapshot,
  types,
} from "mobx-state-tree";
import moment from "moment";

import { LANGUAGE_FALLBACK_COLOR } from "@tony/cv-data/constants";
import type { fetchDataFn } from "@tony/cv-data/fetch";
import { CategoryName, Chart, OrgTypeName } from "@tony/cv-data/types";
import * as matchers from "@tony/cv-lib/search/utils";

import { hasAny } from "../utils";

configure({
  enforceActions: "always",
  // computedRequiresReaction: true,
  // reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  disableErrorBoundaries: true,
});

export type LanguageCountRecord = Record<string, number>;
export type ActivityCountRecord = Record<string, number>;

export const INITIAL_SEARCH_OPTIONS: SnapshotIn<typeof SearchOptions> = {
  showReleases: false,
  showTypos: false,
  showDocImprovements: false,
  showCodeStyleTweaks: false,
  showUnmerged: false,
  startYear: 2007,
  endYear: 2024,
};

export const INITIAL_UI: SnapshotIn<typeof UI> = {
  isLoading: true,
  showChartsMobile: false,
  showOptionsMobile: false,
  chart: Chart.Carbon,
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
  color: types.optional(types.string, "black"),
  backgroundColor: types.optional(types.string, LANGUAGE_FALLBACK_COLOR),
});

export const Language = types.model("Language", {
  id: types.identifier,
  ui: UiCssProperties,
});

export const Category = types.model("Category", {
  id: types.identifier,
  name: types.string,
  ui: UiCssProperties,
});

export const OrgType = types.model("OrgType", {
  id: types.identifier,
  name: types.string,
  ui: UiCssProperties,
});

export const BaseOrg = types.model("BaseOrg", {
  id: types.identifier,
  name: types.string,
  url: types.optional(types.maybeNull(types.string), null),
  repoUrl: types.maybe(types.string),
  languages: types.array(types.reference(Language)),
});

export const CompanyOrg = types
  .compose(
    types.model({
      orgType: types.literal(OrgTypeName.Company),
      oldUrl: types.maybe(types.string),
      logo: types.maybe(types.string),
    }),
    BaseOrg,
  )
  .named("CompanyOrg");

export const PublicationOrg = types
  .compose(
    types.model({
      orgType: types.literal(OrgTypeName.Publication),
      leanpubUrl: types.maybe(types.string),
      amazonUrl: types.maybe(types.string),
      goodreadsUrl: types.maybe(types.string),
      logo: types.maybe(types.string),
    }),
    BaseOrg,
  )
  .named("PublicationOrg");

export const WebsiteOrg = types
  .compose(
    types.model({
      orgType: types.literal(OrgTypeName.Website),
      url: types.maybe(types.string),
      logo: types.maybe(types.string),
    }),
    BaseOrg,
  )
  .named("WebsiteOrg");

export const OpenSourceOrg = types
  .compose(
    types.model({
      orgType: types.literal(OrgTypeName.OpenSource),
      oldUrl: types.maybe(types.string),
      repoUrl: types.maybe(types.string),
      docsUrl: types.maybe(types.string),
      apiUrl: types.maybe(types.string),
      ciUrl: types.maybe(types.string),
      coverageUrl: types.maybe(types.string),
      changelogUrl: types.maybe(types.string),
      issuesUrl: types.maybe(types.string),
      browseCodeTestsUrl: types.maybe(types.string),
      browseCodeUrl: types.maybe(types.string),
    }),
    BaseOrg,
  )
  .named("OpenSourceOrg");

export const Org = types.union(
  CompanyOrg,
  PublicationOrg,
  WebsiteOrg,
  OpenSourceOrg,
);

export const Link = types.model("UiCssProperties", {
  title: types.string,
  url: types.string,
});

export const BaseActivity = types
  .model("BaseActivity", {
    id: types.identifier,
    title: types.string,
    category: types.enumeration<CategoryName>(
      "CategoryName",
      Object.values(CategoryName),
    ),
    org: types.reference(Org),
    meta: ActivityMeta,

    // Dates
    createdAt: types.string,
    acceptedAt: types.optional(types.maybeNull(types.string), null),
    closedAt: types.optional(types.maybeNull(types.string), null),
    startedAt: types.optional(types.maybeNull(types.string), null),
    endedAt: types.optional(types.maybeNull(types.string), null),

    // URLs (OpenSource)
    qaUrl: types.optional(types.maybeNull(types.string), null),
    diffUrl: types.optional(types.maybeNull(types.string), null),

    // ActivityAcquisition (Acquisition)
    acquiringOrg: types.optional(types.maybeNull(types.reference(Org)), null),
    links: types.optional(types.maybeNull(types.map(Link)), null),
  })
  .preProcessSnapshot((activity) => {
    return {
      ...activity,
      meta: {
        isOptionDisabled: false,
        isRelease: matchers.isActivityRelease(castToSnapshot(activity)),
        isTypo: matchers.isActivityTypoFix(castToSnapshot(activity)),
        isDocImprovement: matchers.isActivityDocImprovement(
          castToSnapshot(activity),
        ),
        isCodeStyleTweak: matchers.isActivityCodeStyleTweak(
          castToSnapshot(activity),
        ),
        isMerged:
          activity.category === "Patch"
            ? matchers.isActivityMerged(castToSnapshot(activity))
            : true,
      },
    };
  });

export const OpenSourceCommit = types.model("OpenSourceCommit", {
  oid: types.string,
  abbreviatedOid: types.string,
  messageHeadline: types.string,
  url: types.string,
  commitUrl: types.string,
  zipballUrl: types.string,
  treeUrl: types.string,
  additions: types.number,
  deletions: types.number,
});

export const ActivityOpenSource = types
  .compose(
    types.model({
      category: types.literal(CategoryName.Patch),

      // URLs
      qaUrl: types.string,
      diffUrl: types.string,

      // Pull request
      number: types.number,
      mergeCommit: types.maybe(OpenSourceCommit),

      // Dates
      createdAt: types.string,
      acceptedAt: types.string,
      closedAt: types.string,
      startedAt: types.string,
      endedAt: types.string,
    }),
    BaseActivity,
  )
  .named("ActivityOpenSource");

export const ActivitySoftware = types
  .compose(
    types.model({
      category: types.union(
        types.literal(CategoryName.SoftwareLib),
        types.literal(CategoryName.SoftwareApp),
      ),
    }),
    BaseActivity,
  )
  .named("ActivitySoftware");

export const ActivityWebsite = types
  .compose(
    types.model({
      category: types.literal(CategoryName.Website),
    }),
    BaseActivity,
  )
  .named("ActivityWebsite");

export const ActivityVolunteer = types
  .compose(
    types.model({
      category: types.literal(CategoryName.Volunteer),
    }),
    BaseActivity,
  )
  .named("ActivityVolunteer");

export const ActivityArticleFeatured = types.model("ActivityArticleFeatured", {
  HN: types.maybe(types.string),
  "/r/python": types.maybe(types.string),
  "/r/flask": types.maybe(types.string),
  "/r/django": types.maybe(types.string),
});

export const ActivityArticle = types
  .compose(
    types.model({
      category: types.literal(CategoryName.Article),
      featured: ActivityArticleFeatured,
    }),
    BaseActivity,
  )
  .named("ActivityArticle");

export const ActivityPublication = types
  .compose(
    types.model({
      category: types.literal(CategoryName.Publication),
    }),
    BaseActivity,
  )
  .named("ActivityPublication");

export const ActivityWork = types
  .compose(
    types.model({
      category: types.literal(CategoryName.Work),

      // Dates
      createdAt: types.string,
      endedAt: types.string,
    }),
    BaseActivity,
  )
  .named("ActivityWork");

export const ActivityAcquisition = types
  .compose(
    types.model({
      category: types.literal(CategoryName.Acquisition),
      links: types.map(Link),
      acquiringOrg: types.reference(Org),

      // Dates
      createdAt: types.string,
    }),
    BaseActivity,
  )
  .named("ActivityAcquisition");

export const Activity = types.union(
  ActivityOpenSource,
  ActivitySoftware,
  ActivityWebsite,
  ActivityVolunteer,
  ActivityArticle,
  ActivityPublication,
  ActivityWork,
  ActivityAcquisition,
);

export const SearchOptions = types.model("SearchOptions", {
  showReleases: types.boolean,
  showTypos: types.boolean,
  showDocImprovements: types.boolean,
  showCodeStyleTweaks: types.boolean,
  showUnmerged: types.boolean,
  startYear: types.number,
  endYear: types.number,

  languages: types.array(types.reference(Language)),
  categories: types.array(types.reference(Category)),
  orgs: types.array(types.reference(Org)),
});

export const UI = types.model("UI", {
  isLoading: types.boolean,
  showChartsMobile: types.boolean,
  showOptionsMobile: types.boolean,
  chart: types.enumeration<Chart>("Chart", Object.values(Chart)),
});

export const sortActivities: (
  activities: Instance<typeof Activity>[],
) => Instance<typeof Activity>[] = (activities) => {
  return activities.sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : a.createdAt === b.createdAt ? 0 : -1,
  );
};

export const filterActivitiesByYear = (
  activities: Instance<typeof Activity>[],
  {
    startYear,
    endYear,
  }: Pick<Instance<typeof SearchOptions>, "startYear" | "endYear">,
): Instance<typeof Activity>[] => {
  return activities.filter((activity: Instance<typeof Activity>) => {
    const year = getYear(new Date(activity.createdAt));
    return year >= startYear && year <= endYear;
  });
};

export const filterActivitiesByFilters = (
  activities: Instance<typeof Activity>[],
  {
    showReleases,
    showTypos,
    showDocImprovements,
    showCodeStyleTweaks,
    showUnmerged,
    languages,
    orgs,
    categories,
  }: Instance<typeof SearchOptions>,
): Instance<typeof Activity>[] => {
  const activeLanguageIds = languages.map(({ id }) => id);
  const activeOrgIds = orgs.map(({ id }) => id);
  const activeCategoryIds = categories.map(({ id }) => id);

  const activitiesFilteredByLanguage =
    languages?.length > 0
      ? activities.filter(
          (activity: Instance<typeof Activity>) =>
            hasAny(
              new Set(
                activity.org.languages.map(
                  ({ id }: Instance<typeof Language>) => id,
                ),
              ),
              activeLanguageIds,
            ).length > 0,
        )
      : activities;

  const activitiesFilteredByOrg =
    orgs?.length > 0
      ? activitiesFilteredByLanguage.filter(
          (activity: Instance<typeof Activity>) =>
            activeOrgIds.includes(activity.org.id),
        )
      : activitiesFilteredByLanguage;

  const activitiesFilteredByCategory =
    categories?.length > 0
      ? activitiesFilteredByOrg.filter((activity: Instance<typeof Activity>) =>
          activeCategoryIds.includes(activity.category),
        )
      : activitiesFilteredByOrg;

  return activitiesFilteredByCategory.filter(
    (activity: Instance<typeof Activity>) => {
      if (activity.category !== "Patch") {
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
    },
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
    categories: types.array(Category),
  })
  .actions((self) => {
    const fetchData: fetchDataFn = async () => {
      return import(/* webpackChunkName: "cvData" */ "@tony/cv-data/raw");
    };
    async function afterCreate() {
      self.ui.isLoading = true;
      const data = await fetchData();

      applySnapshot(self, {
        ui: { ...INITIAL_UI, isLoading: false },
        searchOptions: INITIAL_SEARCH_OPTIONS,
        activities: castToSnapshot(data.activities),
        languages: data.languages,
        orgs: data.orgs,
        orgTypes: data.orgTypes,
        categories: data.categories,
      });
    }

    return {
      loadActivities: (items: Instance<typeof Activity>[]) => {
        for (const i of items) {
          self.activities.push(i);
        }
      },
      afterCreate,
      setLanguages(languageIds: string[]) {
        self.searchOptions.languages.splice(
          0,
          self.searchOptions.languages.length,
          ...languageIds,
        );
      },
      setShowChartsMobile(visible: boolean) {
        self.ui.showChartsMobile = visible;
      },
      setShowOptionsMobile(visible: boolean) {
        self.ui.showOptionsMobile = visible;
      },
      setChart(chart: Instance<Chart>) {
        self.ui.chart = chart;
      },
      setYears({ startYear, endYear }: { startYear: number; endYear: number }) {
        self.searchOptions.endYear = endYear;
        self.searchOptions.startYear = startYear;
      },
      setCategories(categoryIds: string[]) {
        self.searchOptions.categories.splice(
          0,
          self.searchOptions.categories.length,
          ...categoryIds,
        );
      },
      setOrgs(orgIds: string[]) {
        self.searchOptions.orgs.splice(
          0,
          self.searchOptions.orgs.length,
          ...orgIds,
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
    get sortedActivities(): Instance<typeof Activity>[] {
      return sortActivities(Array.from(self.activities.values()));
    },
    search({
      startYear = INITIAL_SEARCH_OPTIONS.startYear,
      endYear = INITIAL_SEARCH_OPTIONS.endYear,
      ...activityTraits
    }: Instance<typeof SearchOptions>) {
      return sortActivities(
        filterActivitiesByFilters(
          filterActivitiesByYear(Array.from(self.activities.values()), {
            startYear,
            endYear,
          }),
          { ...activityTraits, startYear, endYear },
        ),
      );
    },

    get filteredActivities(): Instance<typeof Activity>[] {
      return this.search({ ...self.searchOptions });
    },
    get activityYearMap(): ActivityCountRecord {
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
        {} as ActivityCountRecord,
      );
    },

    get languageUsageStats(): LanguageCountRecord {
      // Initialize the languages object with all available languages set to 0
      const initialLanguageCounts: LanguageCountRecord = this.languages.reduce(
        (acc, { id: languageName }) => {
          if (languageName) acc[languageName] = 0;
          return acc;
        },
        {},
      );

      // Accumulate language usage from filteredActivities
      const languageUsage = Array.from(this.filteredActivities.values()).reduce(
        (acc, activity) => {
          for (const { id: languageName } of activity.org.languages) {
            if (languageName) {
              acc[languageName] = (acc[languageName] || 0) + 1;
            }
          }
          return acc;
        },
        initialLanguageCounts,
      );

      return languageUsage;
    },

    get sortedLanguages(): [string, number][] {
      /** Languages sorted ascending by usage **/
      return Object.entries(this.languageUsageStats)
        .sort((a, b) => (a[1] > b[1] ? 1 : a[1] === b[1] ? 0 : -1))
        .reverse();
    },
    get dominantLanguage() {
      const dominantLanguageCount = this.sortedLanguages[0];
      const dominantLanguageId = dominantLanguageCount[0];

      const dominantLanguage = self.languages.find(
        (language) => language.id === dominantLanguageId,
      );
      return dominantLanguage;
    },
    get backgroundColors() {
      return Object.fromEntries<string>(
        self.languages
          .filter(({ id }: Instance<typeof Language>) => id)
          .map((language: Instance<typeof Language>) => [
            language.id, // as LanguageName,
            (language.ui?.backgroundColor as string) ?? LANGUAGE_FALLBACK_COLOR,
          ]),
      );
    },
    get textColors() {
      return Object.fromEntries<string>(
        self.languages
          .filter(({ id }: Instance<typeof Language>) => id)
          .map((language: Instance<typeof Language>) => [
            language.id, // as LanguageName,
            language.ui?.backgroundColor as string,
          ]),
      );
    },
  }));

export const state = CVState.create({
  searchOptions: INITIAL_SEARCH_OPTIONS,
  ui: INITIAL_UI,
  activities: [],
  languages: [],
  orgs: [],
  orgTypes: [],
  categories: [],
});
