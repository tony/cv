class Search {
  private data: Readonly<{
    normalizedActors: any;
    normalizedActivities: any;
  }>;
  constructor(normalizedActors, normalizedActivities) {
    this.data = {
      normalizedActivities,
      normalizedActors
    };
  }
}
