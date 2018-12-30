import { filterMap } from "./selectors";
import {
  CVActivity,
  CVActivityType,
  CVActor,
  CVActorRaw,
  CVLanguage
} from "./types";

export function selectActorsFromActivities(
  actors: CVActor[],
  activities: CVActivity[]
): CVActor[] {
  /**
   * Return available Actor targets, minus ones that are filtered out.
   */
  return Object.values(actors).filter(actor =>
    activities.find(activity => activity.actor === actor.id)
  );
}

export const denormalizeActivities = (
  activities: { [id: number]: CVActivity },
  actors: { [id: number]: CVActor },
  languages: { [id: string]: CVLanguage }
) =>
  Object.values(activities).map(activity =>
    Object.assign({}, activity, {
      actor: Object.assign({}, actors[activity.actor], {
        languages:
          actors[activity.actor].languages !== undefined
            ? actors[activity.actor].languages.map(
                language => languages[language]
              )
            : []
      })
    })
  );

export const selectLanguagesFromActors = (
  languages: { [id: string]: CVLanguage },
  actors: CVActor[]
) =>
  Object.values(languages).filter(language =>
    actors.some(actor =>
      actor.languages.some(actorLang => actorLang === language.name || false)
    )
  );

export const selectActivityIdsFromActivityTypes = (
  activityIds: number[],
  activities: { [id: number]: CVActivity },
  selectedActivityTypes: CVActivityType[]
): number[] => {
  if (selectedActivityTypes.length) {
    // only show selected activity types
    return activityIds.filter(i =>
      selectedActivityTypes
        .map(sA => sA.component_name)
        .includes(activities[i].component_name)
    );
  }
  return activityIds;
};

export const selectActivityIdsFromFilters = (
  activityIds: number[],
  activities: { [id: number]: CVActivity },
  selectedFilters: any[]
) => {
  let selectedIds = activityIds;
  if (selectedFilters.length) {
    selectedFilters.forEach(filterName => {
      selectedIds = selectedIds.filter(i =>
        filterMap[filterName](activities[i])
      );
    });
    return selectedIds;
  }
  return activityIds;
};

export const selectActivities = (
  activities: { [id: number]: CVActivity },
  selectedActivityTypes: CVActivityType[],
  selectedFilters: any[]
) => {
  /**
   * Select activities based on most filters.
   *
   * These results are used by other selectors, and do not include
   * eliminating individual actors, only applying category-type filters
   * and regex-type filters. Not direct actor lookups.
   */
  let selectedIds = Object.keys(activities).map(activityId =>
    parseInt(activityId)
  );
  selectedIds = selectActivityIdsFromActivityTypes(
    selectedIds,
    activities,
    selectedActivityTypes
  );
  selectedIds = selectActivityIdsFromFilters(
    selectedIds,
    activities,
    selectedFilters
  );

  return selectedIds.map(id => activities[id]);
};

export const sortActivities = (activities: CVActivity[], moment: any) =>
  activities.sort((activity1: CVActivity, activity2: CVActivity) =>
    moment(activity2.created_date).diff(moment(activity1.created_date))
  );

export const selectVisibleActivities = (
  selectedLanguages: CVLanguage[],
  selectedActors: CVActor[],
  filteredActivities: CVActivity[]
) => {
  /**
   * Final selctor, includes direct proejct lookups and programming languages.
   */
  let visibleActivities = filteredActivities;
  visibleActivities = selectedLanguages.length
    ? visibleActivities.filter(activity => {
        const activityLanguages = activity.actor.languages as CVLanguage[];
        if (!activityLanguages) {
          return false;
        }
        return activityLanguages.some(s =>
          selectedLanguages.some(z => z.name === s.name)
        );
      })
    : visibleActivities;

  visibleActivities =
    selectedActors && selectedActors.length
      ? visibleActivities.filter(activity =>
          selectedActors.find(s => s.id === activity.actor.id)
        )
      : visibleActivities;
  return visibleActivities;
};

export const countLanguagesFromActivities = (activities: CVActivity[]) =>
  activities.reduce(
    (
      languages: { [id: string]: CVLanguage & { count: number } },
      activity: CVActivity
    ) => {
      const rLanguages = languages;
      const activityLanguages = activity.actor.languages as CVLanguage[];
      if (activityLanguages && activityLanguages.length) {
        activityLanguages.forEach(lang => {
          if (lang.name in rLanguages) {
            rLanguages[lang.name].count += 1;
          } else {
            rLanguages[lang.name] = {
              count: 1,
              color: lang.color,
              name: lang.name,
              textColor: lang.textColor
            };
          }
        });
      }
      return rLanguages;
    },
    {}
  );
