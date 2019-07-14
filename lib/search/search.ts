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

  constructor(data?: IStateData) {
    if (data) {
      this.setState(data);
    }
  }

  public setState({
    activityTypes,
    activities,
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

    return new Search({
      ...this.data,
      activities
    });
  }
}
