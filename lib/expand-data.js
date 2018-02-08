/**
 * Roles for propagating relationships in data
 */
const colors = require('github-colors');


function lookupActorById(actors, type, id) {
  /* Lookup and resolve actor by ID */
  return actors.find(sub => sub.id === id);
}

function expandActor(item, actors) {
  if (item.actor !== undefined) {
    return Object.assign(
      item, { actor: lookupActorById(actors, 'actor', item.actor) },
    );
  }
  return item;
}

function expandLanguage(actor) {
  /** Expand Array{string} of languages to a list of objects with name and color.
   *
   * @param {Array, String} actor
   * @return {Array, Object}
   *
   * Before: ['Python']
   * After: [{
   *   'name': 'python',
   *   'color': '#3572A5'
   * }]
   */
  if (actor.languages && actor.languages.length) {
    Object.assign(actor, {
      languages: actor.languages.map(lang => ({
        name: lang,
        color: colors.get(lang).color,
      })),
    });
  }
  return actor;
}


export const expandRelations = (activities, rawActors) => {
  /**
   * Expands primary key/ID relations with other objects.
   *
   * @param {Array, <Object>} activities
   * @param {Array, <Object>} actors
   * @return {Void}
   */
  const actors = rawActors.map(actor => expandLanguage(actor));
  return activities.map(item => expandActor(item, actors));
};
export default expandRelations;
