/**
 * Functions for prechecking the structure of the data on startup.
 */


function validateProject(item) {
  console.assert('name' in item, item, 'name not in item');
  console.assert('url' in item, item, 'url not in item');
}

export const validateSubjects = (list) => {
  list.forEach((item) => {
    switch (item.type) {
      case 'project':
        validateProject(item);
        break;
      default:
        throw Error(`invalid type ${item.type} for ${item}`);
    }
  });
};

export default validateSubjects;
