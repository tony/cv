import { validateSubjects } from './lib/precheck-data';
import { expandRelations } from './lib/expand-data';
import githubPatches from '../../data/scraped/gh_activities.json';
import githubProjects from '../../data/scraped/gh_actors.json';
import myActivities from '../../data/my_activities.json';
import myProjects from '../../data/my_actors.json';

export const DEFAULT_SELECTED_FILTERS = [
  'Hide Spelling Contributions',
  'Hide Documentation Contributions',
  'Hide Code Style Contributions',
  'Hide Unmerged Contributions',
];

export const SUBJECTS = [
  ...githubProjects,
  ...myProjects,
];

validateSubjects(SUBJECTS);

// Resolve ID to object relationships so they're available in data
export const ACTIVITIES = expandRelations([
  ...githubPatches,
  ...myActivities,
], SUBJECTS);
