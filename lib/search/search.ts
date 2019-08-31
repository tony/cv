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
import { ILense } from "./lense";

interface IStateData {
  activities: IActivity[];
  activityTypes: ActivityType[];
  actorTypes: ActorType[];
  actors: IActor[];
  languages: ActorLanguage[];
}

export class Search<ValueT> {
  public data: Readonly<IStateData>;
  public lenses: Array<ILense<any>> = [];

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

  public addLense(lense: ILense<any>) {
    if (typeof lense.filterFn !== "function") {
      throw new Error(
        "Expected 'filterFn' param to 'Search.addLense' method to be a function."
      );
    }

    this.lenses.push(lense);
  }

  public getResults(): IStateData {
    const initialActivities = this.data.activities;
    let activities: IActivity[] = [];
    const actors = this.data.actors.filter(() => true);
    for (const lense of this.lenses) {
      // append behavior, so adding a language widens scope to an additional language
      activities = activities.concat(initialActivities.filter(lense.filterFn));
    }
    return {
      activities,
      activityTypes: this.data.activityTypes.filter(() => true),
      actorTypes: this.data.actorTypes.filter(() => true),
      actors,
      languages: this.data.languages.filter(language => {
        return actors
          .filter(actor => actor && actor.languages && actor.languages.length)
          .some(actor => actor.languages.includes(language));
      })
    };
  }
}
