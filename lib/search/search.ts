import {
  ActivityType,
  ActorLanguage,
  ActorType,
  IActivity,
  IActor
} from "../types";

interface IStateData {
  activities: IActivity[];
  activityTypes: ActivityType[];
  actorTypes: ActorType[];
  actors: IActor[];
  languages: ActorLanguage[];
}

export class Search {
  private data: Readonly<IStateData>;
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
}
