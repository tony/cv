import { filterMap } from './selectors';

export function availableActorIds(actors, activities) {
  /**
   * Return available Actor targets, minus ones that are filtered out.
   */
  return Object.keys(actors).filter(actor => (
    activities.find(activity => activity.actor === parseInt(actor, 10))
  ));
}


export const selectLanguagesFromActors = (languages, actors) => (
  Object.values(languages).filter(language => (
    actors.find(actor => actor.languages.find(actorLang => actorLang === language.name))
  ))
);


export const selectActivityIdsFromActivityTypes = (
  activityIds,
  activities,
  selectedActivityTypes,
) => {
  if (selectedActivityTypes.length) { // only show selected activity types
    return activityIds.filter(i => (
      selectedActivityTypes.map(sA => sA.component_name).includes(activities[i].component_name)
    ));
  }
  return activityIds;
};


export const selectActivityIdsFromFilters = (activityIds, activities, selectedFilters) => {
  let selectedIds = activityIds;
  if (selectedFilters.length) {
    selectedFilters.forEach((filterName) => {
      selectedIds = selectedIds.filter(i => (
        filterMap[filterName](activities[i])
      ));
    });
    return selectedIds;
  }
  return activityIds;
};


export const selectActivityIds = (
  activityIds,
  activities,
  selectedActivityTypes,
  selectedFilters,
) => {
  /**
   * Select activities based on most filters.
   *
   * These results are used by other selectors, and do not include
   * eliminating individual actors, only applying category-type filters
   * and regex-type filters. Not direct actor lookups.
   */
  let selectedIds = Object.values(activityIds);
  selectedIds = selectActivityIdsFromActivityTypes(selectedIds, activities, selectedActivityTypes);
  selectedIds = selectActivityIdsFromFilters(selectedIds, activities, selectedFilters);

  return selectedIds;
};

export const sortActivities = (activities, moment) => (
  activities.sort((activity1, activity2) => (
    moment(activity2.created_date).diff(moment(activity1.created_date))
  ))
);

export const denormalizeActivities = (activities, actors, languages) => (
  Object.values(activities).map(activity => (
    Object.assign(
      {},
      activity,
      {
        actor: Object.assign(
          {},
          actors[activity.actor],
          {
            languages: actors[activity.actor].languages ?
              actors[activity.actor].languages.map(language => languages[language]) :
              [],
          },
        ),
      },
    )
  ))
);

export const selectVisibleActivities = (selectedLanguages, selectedActors, filteredActivities) => {
  /**
   * Final selctor, includes direct proejct lookups and programming languages.
   */
  let visibleActivities = filteredActivities;
  visibleActivities = selectedLanguages.length ? visibleActivities.filter((activity) => {
    const activityLanguages = activity.actor.languages;
    if (!activityLanguages) {
      return false;
    }
    return activityLanguages.some(s => selectedLanguages.find(z => z.name === s.name));
  }) : visibleActivities;

  visibleActivities = (selectedActors && selectedActors.length) ?
    visibleActivities.filter(activity => (
      selectedActors.find(s => s.id === activity.actor.id)
    )) : visibleActivities;
  return visibleActivities;
};


export const countLanguagesFromActivities = activities => (
  activities.reduce((languages, activity) => {
    const rLanguages = languages;
    const activityLanguages = activity.actor.languages;
    if (activityLanguages && activityLanguages.length) {
      activityLanguages.forEach((lang) => {
        if (lang.name in rLanguages) {
          rLanguages[lang.name].count += 1;
        } else {
          rLanguages[lang.name] = {
            count: 1,
            color: lang.color,
            name: lang.name,
          };
        }
      });
    }
    return rLanguages;
  }, {})
);
