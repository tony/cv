/**
 * Functions for prechecking the structure of the data on startup.
 */


function validateActor(item) {
  console.assert('name' in item, item, 'name not in item');
  console.assert('url' in item, item, 'url not in item');
}

export const validateActors = (list) => {
  list.forEach(item => validateActor(item));
};

export default validateActors;
