import { validateSubjects } from './lib/precheck-data';
import { expandRelations } from './lib/expand-data';
import githubPatches from '../../data/scraped/gh_patches.json';
import githubProjects from '../../data/scraped/gh_projects.json';
import myActivities from '../../data/myActivities.json';
import myProjects from '../../data/myProjects.json';

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
