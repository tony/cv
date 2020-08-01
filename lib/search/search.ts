/*
 * Naming conventions inspired by data-forge-ts
 */
import {
  ActivityType,
  OrgLanguage,
  OrgName,
  OrgType,
  IActivity,
  IOrg,
  IOrgs
} from "../types";

interface IStateData {
  activities: IActivity[];
  activityTypes: ActivityType[];
  orgTypes: OrgType[];
  orgs: IOrgs;
  languages: OrgLanguage[];
}

export type SearchFn<ValueT> = (
  value: ValueT,
  activity: IActivity,
  data: IStateData
) => boolean;
export type SearchType = keyof IStateData;
export interface ISearchFilters {
  [SearchType: string]: SearchFn<any>;
  languages: SearchFn<OrgLanguage>;
}

interface ISearches {
  [key: string]: Set<string | OrgLanguage>;
  activityTypes: Set<string>;
  orgTypes: Set<string>;
  orgs: Set<string>;
  languages: Set<OrgLanguage>;
}

// const SearchFilters: Map<SearchType, SearchFn<any>> = new Map({
const SearchFilters: ISearchFilters = {
  languages: (value, activity, data): boolean => {
    const org = data.orgs[activity.orgId];
    if (!org || !org.languages || !org.languages.length) {
      return false;
    }
    return org.languages.includes(value);
  }
};

const difference = (left: Set<any> | any[], right: Set<any> | any[]) => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter(x => !b.has(x));
};

export class Search {
  /**
   * Raw data
   */
  public data: Readonly<IStateData>;

  /**
   * Filters based on results returned
   */
  public availableSearches: ISearches = {
    activityTypes: new Set(),
    orgTypes: new Set(),
    orgs: new Set(),
    languages: new Set()
  };

  /**
   * activeSearches
   */
  public activeSearches: ISearches = {
    activityTypes: new Set(),
    orgTypes: new Set(),
    orgs: new Set(),
    languages: new Set()
  };

  constructor(
    data: IStateData = {
      activities: [],
      activityTypes: [],
      orgTypes: [],
      orgs: {},
      languages: []
    }
  ) {
    this.data = data;
  }

  public setState({
    activities,
    activityTypes,
    orgTypes,
    orgs,
    languages
  }: IStateData) {
    this.data = {
      activities,
      activityTypes,
      orgTypes,
      orgs,
      languages
    };
  }

  public searchExists(searchType: SearchType, value: any) {
    return this.activeSearches[searchType].has(value);
  }

  public addSearch(searchType: SearchType, value: any) {
    this.activeSearches[searchType].add(value);
  }

  public deleteSearch(searchType: SearchType, value: any) {
    this.activeSearches[searchType].delete(value);
  }

  /* Returns true if updated */
  public setSearches(searchType: SearchType, values: string[]): boolean {
    let updated = false;
    const added = difference(values, this.activeSearches[searchType]);
    const removed = difference(this.activeSearches[searchType], values);

    for (const v of added) {
      if (!this.searchExists(searchType, v)) {
        this.addSearch(searchType, v);
        updated = true;
      }
    }

    for (const v of removed) {
      if (this.searchExists(searchType, v)) {
        this.deleteSearch(searchType, v);
        updated = true;
      }
    }

    return updated;
  }

  public getData(): IStateData {
    const { orgs, activityTypes, orgTypes, languages } = this.data;
    let activities: IActivity[] = [];
    const langs = Array.from(languages.values());
    if (langs) {
      activities = activities.concat(
        this.data.activities.filter(activity => {
          return langs.some(language =>
            SearchFilters.languages(language, activity, this.data)
          );
        })
      );
    }

    return {
      activities,
      activityTypes,
      orgTypes,
      orgs,
      languages
    };
  }

  public getResults(): IStateData {
    const {
      orgs,
      activityTypes,
      orgTypes,
      activities: initialActivities
    } = this.data;

    let activities: IActivity[] = [];

    const languages = this.data.languages.filter(language => {
      return (Object.values(orgs) as IOrg[])
        .filter(org => org && org.languages && org.languages.length)
        .some(org => org.languages.includes(language));
    });
    const langs = this.activeSearches.languages.size
      ? this.activeSearches.languages
      : languages;
    if (langs) {
      for (const language of Array.from(langs.values())) {
        // append behavior, so adding a language widens scope to an additional language
        activities = activities.concat(
          initialActivities.filter(activity => {
            return SearchFilters.languages(language, activity, this.data);
          })
        );
      }
    }
    return {
      activities,
      activityTypes,
      orgTypes,
      orgs,
      languages
    };
  }

  /**
   * Get global counts, without filters
   */
  public getCounts() {
    const { activities, orgs } = this.getData();

    interface IStatCell {
      [SearchType: string]: {
        count: number;
      };
    }
    interface IStats {
      activityTypes: IStatCell;
      orgs: IStatCell;
      orgTypes: IStatCell;
      languages: IStatCell;
    }
    return {
      activityTypes: activities.reduce(
        (acc: IStats["activityTypes"], activity: IActivity) => {
          const { componentName } = activity;
          if (acc[componentName] === undefined) {
            acc[componentName] = { count: 0 };
          }
          acc[componentName].count++;
          return acc;
        },
        {}
      ),
      orgTypes: activities.reduce(
        (acc: IStats["orgTypes"], activity: IActivity) => {
          const { orgType } = orgs[activity.orgId];
          if (acc[orgType] === undefined) {
            acc[orgType] = { count: 0 };
          }
          acc[orgType].count++;
          return acc;
        },
        {}
      ),
      orgs: activities.reduce((acc: IStats["orgs"], activity: IActivity) => {
        const { orgId } = activity;
        if (acc[orgId] === undefined) {
          acc[orgId] = { count: 0 };
        }
        acc[orgId].count++;
        return acc;
      }, {}),
      languages: activities.reduce(
        (acc: IStats["languages"], activity: IActivity) => {
          const org = orgs[activity.orgId];
          for (const language of Array.from(org.languages.values())) {
            if (language === undefined) {
              continue;
            }
            if (acc[language] === undefined) {
              acc[language] = { count: 0 };
            }
            acc[language].count++;
          }
          return acc;
        },
        {}
      )
    };
  }

  public getAvailableSearches() {
    const { activities, orgs } = this.getResults();
    this.availableSearches = {
      activityTypes: new Set(
        activities.reduce((acc, activity) => {
          const { componentName } = activity;
          if (acc.includes(componentName) === false) {
            return acc.concat(componentName);
          }
          return acc;
        }, [] as ActivityType[])
      ),
      orgTypes: new Set(
        activities.reduce((acc, activity) => {
          const orgType = orgs[activity.orgId].orgType;
          if (acc.includes(orgType) === false) {
            return acc.concat(orgType);
          }
          return acc;
        }, [] as OrgType[])
      ),
      orgs: new Set(
        activities.reduce((acc, activity) => {
          const org = activity.orgId;
          if (acc.includes(org) === false) {
            return acc.concat(org);
          }
          return acc;
        }, [] as OrgName[])
      ),
      languages: new Set(
        activities.reduce((acc, activity) => {
          const { languages } = orgs[activity.orgId];
          languages.map(language => {
            if (acc.includes(language) === false) {
              return acc.concat(language);
            }
          });
          return acc;
        }, [] as OrgLanguage[])
      )
    };
  }
}
