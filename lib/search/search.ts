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
export type LenseType = keyof IStateData;
export interface ISearchFilters {
  [LenseType: string]: FilterFn<any>;
  languages: FilterFn<ActorLanguage>;
}

interface ILenses {
  activityTypes: Set<string>;
  actorTypes: Set<string>;
  actors: Set<string>;
  languages: Set<ActorLanguage>;
}

// const SearchFilters: Map<LenseType, FilterFn<any>> = new Map({
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
  public data: Readonly<IStateData>;
  public lenses: ILenses = {
    activityTypes: new Set(),
    actorTypes: new Set(),
    actors: new Set(),
    languages: new Set()
  };

  //
  // Parent (creating) state. null for root-level
  //
  private parent: Search<ValueT> | null;

  constructor(data?: IStateData, parent: Search<ValueT> = null) {
    if (parent !== null) {
      this.parent = parent;
    }
    if (data) {
      this.setState(data);
    }
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

  public lenseExists(lenseType, value) {
    return this.lenses[lenseType].has(value);
  }

  public addLense(lenseType, value) {
    this.lenses[lenseType].add(value);
  }

  public deleteLense(lenseType, value) {
    this.lenses[lenseType].delete(value);
  }

  /* Returns true if updated */
  public setLenses(lenseType, values): boolean {
    let updated = false;
    const added = difference(values, this.lenses[lenseType]);
    const removed = difference(this.lenses[lenseType], values);

    for (const v of added) {
      if (!this.lenseExists(lenseType, v)) {
        this.addLense(lenseType, v);
        updated = true;
      }
    }

    for (const v of removed) {
      if (this.lenseExists(lenseType, v)) {
        this.deleteLense(lenseType, v);
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
    for (const language of Array.from(this.lenses.languages.values())) {
      // append behavior, so adding a language widens scope to an additional language
      activities = activities.concat(
        initialActivities.filter(activity => {
          return SearchFilters.languages(language, activity, this.data);
        })
      );
    }
    return {
      activities,
      activityTypes: this.data.activityTypes.filter(() => true),
      actorTypes: this.data.actorTypes.filter(() => true),
      actors,
      languages: this.data.languages.filter(language => {
        return (Object.values(actors) as IActor[])
          .filter(actor => actor && actor.languages && actor.languages.length)
          .some(actor => actor.languages.includes(language));
      })
    };
  }
}
