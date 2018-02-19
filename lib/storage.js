export const activityTypes = [
  {
    name: 'Open Source Contributions',
    singular_name: 'Open Source Contribution',
    component_name: 'Patch',
  },
  {
    name: 'Applications',
    singular_name: 'Application',
    component_name: 'SoftwareApp',
  },
  {
    name: 'Libraries',
    singular_name: 'Library',
    component_name: 'SoftwareLib',
  },
  {
    name: 'Work',
    singular_name: 'Work',
    component_name: 'Work',
  },
  {
    name: 'Publications',
    singular_name: 'Publication',
    component_name: 'Publication',
  },
  {
    name: 'Volunteering',
    singular_name: 'Volunteering',
    component_name: 'Volunteer',
  },
  {
    name: 'Websites',
    singular_name: 'Website',
    component_name: 'Website',
  },
  {
    name: 'Articles',
    singular_name: 'Article',
    component_name: 'Article',
  },
];

export function availableActivityTypes(activities, activityTypeMap) {
  return activityTypeMap.filter(activityType => (
    Object.values(activities).find(activity => (
      activity.component_name === activityType.component_name
    ))
  ));
}

export function availableActorIds(actors, activities) {
  /**
   * Return available Actor targets, minus ones that are filtered out.
   */
  return Object.keys(actors).filter(actor => (
    activities.find(activity => activity.actor === parseInt(actor, 10))
  ));
}


export const availableLanguageIds = (languages, actors) => (
  Object.values(actors).reduce((usedLanguageIds, actor) => {
    if (actor.languages && actor.languages.length) {
      actor.languages.forEach((lang) => {
        if (!usedLanguageIds.some(usedLanguage => usedLanguage === lang)) {
          usedLanguageIds.push(lang);
        }
      });
    }
    return usedLanguageIds;
  }, [])
);


const filterTypos = activity => !activity.title.match(/(typo|Typo|spelling|Spelling|note|Note|correct|Correct|Fix type|Fix URL|print statement)/);
const filterDocs = activity => !activity.title.match(/(doc|Doc|license|LICENSE|README|readme|link|Link|\.md|instructions|Instructions|guidelines|pypi badge|AUTHORS|License|changelog|label|copyright|add cookiecutter|issue template|awesome-|front-end frameworks|Examples for issue)|to other tools|sphinx/);
const filterCodeStyle = activity => !activity.title.match(/(indent|Indent|whitespace|spacing|lint|Lint|sort|Sort|jshint|PEP|pep8|tabs|Tabs|Ignore|ignore|__about__|import|tweak|Tweak|hash|modernize|Add.*module|trivial|travis|Travis|dependency|MANIFEST.in|Pythonic|pythonic)/);
const filterUnmerged = activity => ('accepted_date' in activity ? activity.accepted_date : true);


export const filterMap = {
  'Hide Spelling Contributions': filterTypos,
  'Hide Documentation Contributions': filterDocs,
  'Hide Code Style Contributions': filterCodeStyle,
  'Hide Unmerged Contributions': filterUnmerged,
};


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
  if (selectedLanguages.length) {
    visibleActivities = visibleActivities.filter((activity) => {
      const activityLanguages = activity.actor.languages;
      if (!activityLanguages) {
        return false;
      }
      return activityLanguages.some(s => selectedLanguages.find(z => z.name === s.name));
    });
  }

  if (selectedActors && selectedActors.length) {
    return visibleActivities.filter(activity => (
      selectedActors.find(s => s.id === activity.actor.id)
    ));
  }
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

