import handPickedActivitiesRaw from "../data/my_activities.json";
import handPickedActorsRaw from "../data/my_actors.json";
import ghActivitiesRaw from "../data/scraped/gh_activities.json";
import ghActorsRaw from "../data/scraped/gh_actors.json";

// Join JSON files into a normal list

export const myActivities = [...handPickedActivitiesRaw, ...ghActivitiesRaw];
