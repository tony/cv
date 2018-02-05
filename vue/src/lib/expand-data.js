/**
 * Roles for propagating relationships in data
 */

function lookupSubjectById(subjects, type, id) {
  return subjects.find(sub => sub.type === type && sub.id === id);
}

function expandProject(item, subjects) {
  if (item.project !== undefined) {
    return Object.assign(
      item, { project: lookupSubjectById(subjects, 'project', item.project) },
    );
  }
  return item;
}


export const expandRelations = (activities, subjects) => {
  /**
   * Expands primary key/ID relations with other objects.
   *
   * @param {Array, <Object>} activities
   * @return {Void}
   */
  activities.map((item) => {
    switch (item.component) {
      case 'Patch':
        return expandProject(item, subjects);
      case 'Publication':
        return expandProject(item, subjects);
      case 'SoftwareApp':
        return expandProject(item, subjects);
      case 'SoftwareLib':
        return expandProject(item, subjects);
      case 'Work':
        return expandProject(item, subjects);
      case 'Volunteer':
        return expandProject(item, subjects);
      case 'Website':
        return expandProject(item, subjects);
      default:
        return item;
    }
  });
  return activities;
};

export default expandRelations;
