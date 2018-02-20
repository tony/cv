/* eslint-disable import/no-extraneous-dependencies */
import { normalize, schema } from 'normalizr';
import { activityTypes } from './storage';
import { validateActors } from './precheck-data';
import { expandRelations } from './expand-data';
import githubActivities from '../data/scraped/gh_activities.json';
import githubActors from '../data/scraped/gh_actors.json';
import myActivities from '../data/my_activities.json';
import myActors from '../data/my_actors.json';

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


const activityType = new schema.Entity('activityTypes', {}, {
  idAttribute: 'component_name',
});

const language = new schema.Entity('languages', {}, { idAttribute: 'name' });
const actor = new schema.Entity('actors', { languages: [language] }, {
  idAttribute: 'id',
});
const normalizedActivityTypes = normalize(activityTypes, [activityType]);
const activity = new schema.Entity('activities', { actor, component_name: activityType }, {
  processStrategy: entity => (
    Object.assign({}, entity, {
      visible: false,
      component_name: normalizedActivityTypes.entities.activityTypes[entity.component_name],
    })
  ),
});

export const INITIAL_DATA = normalize(ACTIVITIES, [activity]);
