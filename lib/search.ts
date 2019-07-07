import { IActivity, IActor } from "./types";

export class Search {
  private data: Readonly<{
    actors: IActor[];
    activities: IActivity[];
  }>;
  public setState({
    actors,
    activities
  }: {
    actors: IActor[];
    activities: IActivity[];
  }) {
    this.data = {
      activities,
      actors
    };
  }
}
