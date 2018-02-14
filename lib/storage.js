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

export function availableActivityTypes(v) {
  return [
    ...new Set(v.map(item => activityTypes.find(vt => vt.component_name === item.component))),
  ];
}

export function availableActors(actors, availableActivities) {
  /**
   * Return available Actor targets, minus ones that are filtered out.
   */
  return [
    ...new Set(availableActivities.map(item => actors.find(s => s.id === item.actor.id))),
  ];
}


export function availableLanguages(availableActivities) {
  return availableActivities.reduce((acc, activity) => {
    if (activity.actor.languages && activity.actor.languages.length) {
      activity.actor.languages.forEach((lang) => {
        if (!acc.some(s => lang.name === s.name)) {
          acc.push(lang);
        }
      });
    }
    return acc;
  }, []);
}


const filterTypos = v => !v.title.match(/(typo|Typo|spelling|Spelling|note|Note|correct|Correct|Fix type|Fix URL|print statement)/);
const filterDocs = v => !v.title.match(/(doc|Doc|license|LICENSE|README|readme|link|Link|\.md|instructions|Instructions|guidelines|pypi badge|AUTHORS|License|changelog|label|copyright|add cookiecutter|issue template|awesome-|front-end frameworks|Examples for issue)|to other tools|sphinx/);
const filterCodeStyle = v => !v.title.match(/(indent|Indent|whitespace|spacing|lint|Lint|sort|Sort|jshint|PEP|pep8|tabs|Tabs|Ignore|ignore|__about__|import|tweak|Tweak|hash|modernize|Add.*module|trivial|travis|Travis|dependency|MANIFEST.in|Pythonic|pythonic)/);
const filterUnmerged = v => ('accepted_date' in v ? v.accepted_date : true);


export const filters = {
  'Hide Spelling Contributions': filterTypos,
  'Hide Documentation Contributions': filterDocs,
  'Hide Code Style Contributions': filterCodeStyle,
  'Hide Unmerged Contributions': filterUnmerged,
};

export function reduceActivities(state) {
  /**
   * Reduce activities based on most filters.
   *
   * These results are used by other reducers, and do not include
   * eliminating individual actors, only applying category-type filters
   * and regex-type filters. Not direct actor lookups.
   */
  const { selectedActivityTypes, selectedFilters } = state;
  let { activities: items } = state;

  // only show selected activity types
  if (selectedActivityTypes.length) {
    items = items.filter(
      i => selectedActivityTypes.map(sA => sA.component_name).includes(i.component),
    );
  }

  selectedFilters.forEach((filterName) => {
    items = items.filter(filters[filterName]);
  });

  return items;
}

export const sortActivities = (activities, moment) => {
  return activities.sort(
    (activity1, activity2) => (
      moment(activity2.created_date).diff(moment(activity1.created_date))
    ),
  )
}

export const reduceActivitiesFinal = (state, getters) => {
  /**
   * Final reducer, includes direct proejct lookups and programming languages.
   */
  let { filteredActivities } = getters;
  const { selectedLanguages, selectedActors } = state;
  if (selectedLanguages.length) {
    filteredActivities = filteredActivities.filter((item) => {
      if (!item.actor.languages) {
        return false;
      }
      return item.actor.languages.some(s => selectedLanguages.find(z => z.name === s.name));
    });
  }

  if (selectedActors && selectedActors.length) {
    return filteredActivities.filter(
      item => selectedActors.find(s => s.id === item.actor.id),
    );
  }
  return filteredActivities;
};
