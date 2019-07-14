/*
 * Naming conventions inspired by data-forge-ts
 */
import {
  ActivityType,
  ActorLanguage,
  ActorType,
  IActivity,
  IActor
} from "../types";
import { Lense } from "./lense";

interface IStateData {
  activities: IActivity[];
  activityTypes: ActivityType[];
  actorTypes: ActorType[];
  actors: IActor[];
  languages: ActorLanguage[];
}

export type PredicateFn<ValueT> = (value: ValueT) => boolean;

export class Search<ValueT> {
  private data: Readonly<IStateData>;

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

  public filter(predicate: PredicateFn<IActivity>): Search<ValueT> {
    if (typeof predicate !== "function") {
      throw new Error(
        "Expected 'predicate' param to 'Search.where' method to be a function."
      );
    }

    const activities = this.data.activities.filter(predicate);
    const actors = this.data.actors.filter(() => true);
    return new Search(
      {
        activities,
        activityTypes: this.data.activityTypes.filter(() => true),
        actorTypes: this.data.actorTypes.filter(() => true),
        actors,
        languages: this.data.languages.filter(language =>
          actors.some(actor => actor.languages.includes(language))
        )
      },
      this
    );
  }
}
