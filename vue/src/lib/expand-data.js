/**
 * Roles for propagating relationships in data
 */
const colors = require('github-colors');


function lookupActorById(actors, type, id) {
  /* Lookup and resolve actor by ID */
  return actors.find(sub => sub.id === id);
}

function expandProject(item, actors) {
  if (item.project !== undefined) {
    return Object.assign(
      item, { project: lookupActorById(actors, 'project', item.project) },
    );
  }
  return item;
}

function expandLanguage(project) {
  /** Expand Array{string} of languages to a list of objects with name and color.
   *
   * @param {Array, String} project
   * @return {Array, Object}
   *
   * Before: ['Python']
   * After: [{
   *   'name': 'python',
   *   'color': '#3572A5'
   * }]
   */
  if (project.languages && project.languages.length) {
    Object.assign(project, {
      languages: project.languages.map(lang => ({
        name: lang,
        color: colors.get(lang).color,
      })),
    });
  }
  return project;
}


export const expandRelations = (activities, rawProjects) => {
  /**
   * Expands primary key/ID relations with other objects.
   *
   * @param {Array, <Object>} activities
   * @param {Array, <Object>} projects
   * @return {Void}
   */
  const projects = rawProjects.map(project => expandLanguage(project));
  return activities.map(item => expandProject(item, projects));
};
export default expandRelations;
