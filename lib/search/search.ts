/*
 * Naming conventions inspired by data-forge-ts
 */
import {
  ActivityType,
  ActorLanguage,
  ActorName,
  ActorType,
  IActivity,
  IActor,
  IActors,
} from "../types";

interface IStateData {
  activities: IActivity[];
  activityTypes: ActivityType[];
  actorTypes: ActorType[];
  actors: IActors;
  languages: ActorLanguage[];
}

export type SearchFn<ValueT> = (
  value: ValueT,
  activity: IActivity,
  data: IStateData
) => boolean;
export type SearchType = keyof IStateData;
export interface ISearchFilters {
  [SearchType: string]: SearchFn<any>;
  languages: SearchFn<ActorLanguage>;
}

interface ISearches {
  [key: string]: Set<string | ActorLanguage>;
  activityTypes: Set<string>;
  actorTypes: Set<string>;
  actors: Set<string>;
  languages: Set<ActorLanguage>;
}

// const SearchFilters: Map<SearchType, SearchFn<any>> = new Map({
const SearchFilters: ISearchFilters = {
  languages: (value, activity, data): boolean => {
    const actor = data.actors[activity.actorId];
    if (!actor || !actor.languages || !actor.languages.length) {
      return false;
    }
    return actor.languages.includes(value);
  },
};

const difference = (left: Set<any> | any[], right: Set<any> | any[]) => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter((x) => !b.has(x));
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
    actorTypes: new Set(),
    actors: new Set(),
    languages: new Set(),
  };

  /**
   * activeSearches
   */
  public activeSearches: ISearches = {
    activityTypes: new Set(),
    actorTypes: new Set(),
    actors: new Set(),
    languages: new Set(),
  };

  constructor(
    data: IStateData = {
      activities: [],
      activityTypes: [],
      actorTypes: [],
      actors: {},
      languages: [],
    }
  ) {
    this.data = data;
  }

  public setState({
    activities,
    activityTypes,
    actorTypes,
    actors,
    languages,
  }: IStateData) {
    this.data = {
      activities,
      activityTypes,
      actorTypes,
      actors,
      languages,
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
    const { actors, activityTypes, actorTypes, languages } = this.data;
    let activities: IActivity[] = [];
    const langs = Array.from(languages.values());
    if (langs) {
      activities = activities.concat(
        this.data.activities.filter((activity) => {
          return langs.some((language) =>
            SearchFilters.languages(language, activity, this.data)
          );
        })
      );
    }

    return {
      activities,
      activityTypes,
      actorTypes,
      actors,
      languages,
    };
  }

  public getResults(): IStateData {
    const {
      actors,
      activityTypes,
      actorTypes,
      activities: initialActivities,
    } = this.data;

    let activities: IActivity[] = [];

    const languages = this.data.languages.filter((language) => {
      return (Object.values(actors) as IActor[])
        .filter((actor) => actor && actor.languages && actor.languages.length)
        .some((actor) => actor.languages.includes(language));
    });
    const langs = this.activeSearches.languages.size
      ? this.activeSearches.languages
      : languages;
    if (langs) {
      for (const language of Array.from(langs.values())) {
        // append behavior, so adding a language widens scope to an additional language
        activities = activities.concat(
          initialActivities.filter((activity) => {
            return SearchFilters.languages(language, activity, this.data);
          })
        );
      }
    }
    return {
      activities,
      activityTypes,
      actorTypes,
      actors,
      languages,
    };
  }

  /**
   * Get global counts, without filters
   */
  public getCounts() {
    const { activities, actors } = this.getData();

    interface IStatCell {
      [SearchType: string]: {
        count: number;
      };
    }
    interface IStats {
      activityTypes: IStatCell;
      actors: IStatCell;
      actorTypes: IStatCell;
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
      actorTypes: activities.reduce(
        (acc: IStats["actorTypes"], activity: IActivity) => {
          const { actorType } = actors[activity.actorId];
          if (acc[actorType] === undefined) {
            acc[actorType] = { count: 0 };
          }
          acc[actorType].count++;
          return acc;
        },
        {}
      ),
      actors: activities.reduce(
        (acc: IStats["actors"], activity: IActivity) => {
          const { actorId } = activity;
          if (acc[actorId] === undefined) {
            acc[actorId] = { count: 0 };
          }
          acc[actorId].count++;
          return acc;
        },
        {}
      ),
      languages: activities.reduce(
        (acc: IStats["languages"], activity: IActivity) => {
          const actor = actors[activity.actorId];
          for (const language of Array.from(actor.languages.values())) {
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
      ),
    };
  }

  public getAvailableSearches() {
    const { activities, actors } = this.getResults();
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
      actorTypes: new Set(
        activities.reduce((acc, activity) => {
          const actorType = actors[activity.actorId].actorType;
          if (acc.includes(actorType) === false) {
            return acc.concat(actorType);
          }
          return acc;
        }, [] as ActorType[])
      ),
      actors: new Set(
        activities.reduce((acc, activity) => {
          const actor = activity.actorId;
          if (acc.includes(actor) === false) {
            return acc.concat(actor);
          }
          return acc;
        }, [] as ActorName[])
      ),
      languages: new Set(
        activities.reduce((acc, activity) => {
          const { languages } = actors[activity.actorId];
          languages.map((language) => {
            if (acc.includes(language) === false) {
              return acc.concat(language);
            }
          });
          return acc;
        }, [] as ActorLanguage[])
      ),
    };
  }
}
