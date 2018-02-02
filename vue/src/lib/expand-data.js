/**
 * Roles for propagating relationships in data
 */

function lookupSubjectById(subjects, type, id) {
  return subjects.find(sub => sub.type === type && sub.id === id);
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
        if (item.project !== undefined) {
          return Object.assign(
            item, { project: lookupSubjectById(subjects, 'project', item.project) },
          );
        }
        return item;
      case 'SoftwareApp':
        if (item.project !== undefined) {
          return Object.assign(
            item,
            {
              project: lookupSubjectById(subjects, 'project', item.project),
            },
          );
        }
        return item;
      case 'SoftwareLib':
        if (item.project !== undefined) {
          return Object.assign(
            item,
            {
              project: lookupSubjectById(subjects, 'project', item.project),
            },
          );
        }
        return item;
      default:
        return item;
    }
  });
  return activities;
};

export default expandRelations;
