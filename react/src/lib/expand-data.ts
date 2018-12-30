import colors from "github-colors";
import invert from "invert-color";
import {
  CVActivity,
  CVActivityRaw,
  CVActivityType,
  CVActor,
  CVActorRaw
} from "./types";

function lookupActorById(actors: CVActor[], id: Number) {
  /* Lookup and resolve actor by ID */
  return actors.find(sub => sub.id === id);
}

function expandActor(item: CVActivityRaw, actors: CVActor[]) {
  return Object.assign({}, item, {
    actor: lookupActorById(actors, item.actor)
  });
}

function expandLanguage(actor: CVActorRaw): CVActor {
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
      languages: actor.languages.map(lang => {
        // see https://github.com/IonicaBizau/github-colors/issues/26
        const color = colors.get(lang, true).color
          ? colors.get(lang, true).color
          : "#ccc";
        return {
          name: lang,
          color,
          textColor: invert(color, true)
        };
      })
    });
  }
  return actor as CVActor;
}

export const expandRelations = (
  activities: CVActivity[],
  rawActors: CVActorRaw[]
) => {
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
