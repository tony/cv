import { validateActors } from './precheck-data';
import { expandRelations } from './expand-data';
import githubActivities from '../data/scraped/gh_activities.json';
import githubActors from '../data/scraped/gh_actors.json';
import myActivities from '../data/my_activities.json';
import myActors from '..//data/my_actors.json';

export const DEFAULT_SELECTED_FILTERS = [
  'Hide Spelling Contributions',
  'Hide Documentation Contributions',
  'Hide Code Style Contributions',
  'Hide Unmerged Contributions',
];

export const ACTORS = [
  ...githubActors,
  ...myActors,
];

validateActors(ACTORS);

// Resolve ID to object relationships so they're available in data
export const ACTIVITIES = expandRelations([
  ...githubActivities,
  ...myActivities,
], ACTORS);
