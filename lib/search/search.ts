/*
 * Naming conventions inspired by data-forge-ts
 */
import {
  ActivityType,
  ActorLanguage,
  ActorType,
  IActivity,
  IActor,
  IActors
} from "../types";

interface IStateData {
  activities: IActivity[];
  activityTypes: ActivityType[];
  actorTypes: ActorType[];
  actors: IActors;
  languages: ActorLanguage[];
}

export type FilterFn<ValueT> = (
  value: ValueT,
  activity: IActivity,
  data: IStateData
) => boolean;
export type FacetType = keyof IStateData;
export interface ISearchFilters {
  [FacetType: string]: FilterFn<any>;
  languages: FilterFn<ActorLanguage>;
}

interface IFacets {
  [key: string]: Set<string | ActorLanguage>;
  activityTypes: Set<string>;
  actorTypes: Set<string>;
  actors: Set<string>;
  languages: Set<ActorLanguage>;
}

// const SearchFilters: Map<FacetType, FilterFn<any>> = new Map({
const SearchFilters: ISearchFilters = {
  languages: (value, activity, data) => {
    const actor = data.actors[activity.actorId];
    if (!actor || !actor.languages || !actor.languages.length) {
      return false;
    }
    return actor.languages.includes(value);
  }
};

const difference = (left: Set<any> | any[], right: Set<any> | any[]) => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter(x => !b.has(x));
};

export class Search<ValueT> {
  /**
   * Raw data
   */
  public data: Readonly<IStateData>;

  /**
   * Filters based on results returned
   */
  public availableFacets: IFacets = {
    activityTypes: new Set(),
    actorTypes: new Set(),
    actors: new Set(),
    languages: new Set()
  };

  /**
   * activeFacets
   */
  public activeFacets: IFacets = {
    activityTypes: new Set(),
    actorTypes: new Set(),
    actors: new Set(),
    languages: new Set()
  };

  constructor(
    data: IStateData = {
      activities: [],
      activityTypes: [],
      actorTypes: [],
      actors: {},
      languages: []
    }
  ) {
    this.data = data;
  }

  public setState({
    activities,
    activityTypes,
    actorTypes,
    actors,
    languages
  }: IStateData) {
    this.data = {
      activities,
      activityTypes,
      actorTypes,
      actors,
      languages
    };
  }

  public facetExists(facetType: FacetType, value: any) {
    return this.activeFacets[facetType].has(value);
  }

  public addFacet(facetType: FacetType, value: any) {
    this.activeFacets[facetType].add(value);
  }

  public deleteFacet(facetType: FacetType, value: any) {
    this.activeFacets[facetType].delete(value);
  }

  /* Returns true if updated */
  public setFacets(facetType: FacetType, values: string[]): boolean {
    let updated = false;
    const added = difference(values, this.activeFacets[facetType]);
    const removed = difference(this.activeFacets[facetType], values);

    for (const v of added) {
      if (!this.facetExists(facetType, v)) {
        this.addFacet(facetType, v);
        updated = true;
      }
    }

    for (const v of removed) {
      if (this.facetExists(facetType, v)) {
        this.deleteFacet(facetType, v);
        updated = true;
      }
    }

    return updated;
  }

  public getResults(): IStateData {
    const initialActivities = this.data.activities;
    let activities: IActivity[] = [];
    const actors = Object.entries(this.data.actors).reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: v
      }),
      {}
    );
    for (const language of Array.from(this.activeFacets.languages.values())) {
      // append behavior, so adding a language widens scope to an additional language
      activities = activities.concat(
        initialActivities.filter(activity => {
          return SearchFilters.languages(language, activity, this.data);
        })
      );
    }
    const languages = this.data.languages.filter(language => {
      return (Object.values(actors) as IActor[])
        .filter(actor => actor && actor.languages && actor.languages.length)
        .some(actor => actor.languages.includes(language));
    });
    const { activityTypes, actorTypes } = this.data;
    return {
      activities,
      activityTypes,
      actorTypes,
      actors,
      languages
    };
  }

  public getAvailableFacets() {
    const { activities } = this.getResults();
    return {
      activityTypes: activities.reduce(
        (acc, activity) => {
          const { componentName } = activity;
          if (acc.includes(componentName) === false) {
            return acc.concat(componentName);
          }
          return acc;
        },
        [] as ActivityType[]
      )
    };
  }
}
