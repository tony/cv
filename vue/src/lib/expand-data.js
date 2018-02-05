/**
 * Roles for propagating relationships in data
 */

function lookupSubjectById(subjects, type, id) {
  /* Lookup and resolve subject by ID */
  return subjects.find(sub => sub.id === id);
}

function expandProject(item, subjects) {
  if (item.project !== undefined) {
    return Object.assign(
      item, { project: lookupSubjectById(subjects, 'project', item.project) },
    );
  }
  return item;
}


export const expandRelations = (activities, subjects) => (
  /**
   * Expands primary key/ID relations with other objects.
   *
   * @param {Array, <Object>} activities
   * @return {Void}
   */
  activities.map(item => expandProject(item, subjects))
);

export default expandRelations;
