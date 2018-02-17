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
    ...new Set(v.map(item => activityTypes.find(vt => vt.component_name === item.component_name))),
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


const filterTypos = activity => !activity.title.match(/(typo|Typo|spelling|Spelling|note|Note|correct|Correct|Fix type|Fix URL|print statement)/);
const filterDocs = activity => !activity.title.match(/(doc|Doc|license|LICENSE|README|readme|link|Link|\.md|instructions|Instructions|guidelines|pypi badge|AUTHORS|License|changelog|label|copyright|add cookiecutter|issue template|awesome-|front-end frameworks|Examples for issue)|to other tools|sphinx/);
const filterCodeStyle = activity => !activity.title.match(/(indent|Indent|whitespace|spacing|lint|Lint|sort|Sort|jshint|PEP|pep8|tabs|Tabs|Ignore|ignore|__about__|import|tweak|Tweak|hash|modernize|Add.*module|triactivityial|traactivityis|Traactivityis|dependency|MANIFEST.in|Pythonic|pythonic)/);
const filterUnmerged = activity => ('accepted_date' in activity ? activity.accepted_date : true);


export const filters = {
  'Hide Spelling Contributions': filterTypos,
  'Hide Documentation Contributions': filterDocs,
  'Hide Code Style Contributions': filterCodeStyle,
  'Hide Unmerged Contributions': filterUnmerged,
};

export const selectActivities = (activities, selectedActivityTypes, selectedFilters) => {
  /**
   * Select activities based on most filters.
   *
   * These results are used by other selectors, and do not include
   * eliminating individual actors, only applying category-type filters
   * and regex-type filters. Not direct actor lookups.
   */
  if (selectedActivityTypes.length) {  // only show selected activity types
    activities = activities.filter(
      i => selectedActivityTypes.map(sA => sA.component_name).includes(i.component_name),
    );
  }

  selectedFilters.forEach((filterName) => {
    activities = activities.filter(filters[filterName]);
  });

  return activities;
}

export const sortActivities = (activities, moment) => {
  return activities.sort(
    (activity1, activity2) => (
      moment(activity2.created_date).diff(moment(activity1.created_date))
    ),
  )
}

export const selectActivitiesFinal = (selectedLanguages, selectedActors, filteredActivities) => {
  /**
   * Final selctor, includes direct proejct lookups and programming languages.
   */
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
