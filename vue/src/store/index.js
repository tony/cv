import Vue from 'vue';
import Vuex from 'vuex';
import { LOAD_INITIAL_DATA } from './mutation-types';


Vue.use(Vuex);


const activityTypes = [
  {
    name: 'Open Source Contributions',
    component_name: 'Patch',
  },
  {
    name: 'Applications',
    component_name: 'SoftwareApp',
  },
  {
    name: 'Libraries',
    component_name: 'SoftwareLib',
  },
  {
    name: 'Work',
    component_name: 'Work',
  },
  {
    name: 'Publications',
    component_name: 'Publication',
  },
  {
    name: 'Volunteering',
    component_name: 'Volunteer',
  },
  {
    name: 'Websites',
    component_name: 'Website',
  },
];

function availableActivityTypes(v) {
  return [
    ...new Set(v.map(item => activityTypes.find(vt => vt.component_name === item.component))),
  ];
}

function availableSubjects(subjects, availableActivities) {
  /**
   * Return available Subject targets, minus ones that are filtered out.
   */
  return [
    ...new Set(availableActivities.map(item => subjects.find(s => s.id === item.project.id))),
  ];
}


function availableLanguages(availableActivities) {
  return availableActivities.reduce((acc, activity) => {
    if (activity.project.languages && activity.project.languages.length) {
      activity.project.languages.forEach((lang) => {
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


const filters = {
  'Hide Spelling Contributions': filterTypos,
  'Hide Documentation Contributions': filterDocs,
  'Hide Code Style Contributions': filterCodeStyle,
  'Hide Unmerged Contributions': filterUnmerged,
};

function reduceActivities(state) {
  /**
   * Reduce activities based on most filters.
   *
   * These results are used by other reducers, and do not include
   * eliminating individual projects, only applying category-type filters
   * and regex-type filters. Not direct project lookups.
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

const reduceActivitiesFinal = (state, getters) => {
  /**
   * Final reducer, includes direct proejct lookups and programming languages.
   */
  let { filteredActivities } = getters;
  const { selectedLanguages, selectedSubjects } = state;
  if (selectedLanguages.length) {
    filteredActivities = filteredActivities.filter((item) => {
      if (!item.project.languages) {
        return false;
      }
      return item.project.languages.some(s => selectedLanguages.find(z => z.name === s.name));
    });
  }

  if (selectedSubjects && selectedSubjects.length) {
    return filteredActivities.filter(
      item => selectedSubjects.find(s => s.id === item.project.id),
    );
  }
  return filteredActivities;
};

const store = new Vuex.Store({
  state: {
    count: 0,
    activities: null,
    subjects: null,
    selectedActivityTypes: [],
    selectedSubjects: null,
    selectedFilters: null,
    selectedLanguages: [],
  },
  getters: {
    availableLanguages: (state, getters) => availableLanguages(
      getters.filteredActivities,
    ),
    filteredActivities: state => reduceActivities(state),
    filteredActivitiesMinusProjects: (state, getters) => reduceActivitiesFinal(state, getters),
    sortedActivities: (state, getters) => (
      getters.filteredActivitiesMinusProjects.sort(
        (activity1, activity2) => (
          Vue.moment(activity2.created_date).diff(Vue.moment(activity1.created_date))
        ),
      )
    ),
    subjects: state => state.subjects, // subject items
    availableSubjectTypes: state => [
      ...new Set(state.subjects.map(item => item)),
    ],
    availableSubjects: (state, getters) => availableSubjects(
      state.subjects, getters.filteredActivities,
    ),
    availableActivityTypes: state => availableActivityTypes(state.activities),
    availableFilters: () => Object.keys(filters),
  },
  actions: {
    updateSelectedActivityTypeAction({ commit }, value) {
      commit('updateSelectedActivityType', value);
    },
    updateSelectedSubjectsAction({ commit }, value) {
      commit('updateSelectedSubjects', value);
    },
    updateSelectedFiltersAction({ commit }, value) {
      commit('updateSelectedFilters', value);
    },
    updateSelectedLanguagesAction({ commit }, value) {
      commit('updateSelectedLanguages', value);
    },
  },
  mutations: {
    [LOAD_INITIAL_DATA]: (state, data) => {
      state.activities = data.activities;
      state.subjects = data.subjects;
      state.selectedFilters = data.selectedFilters;
    },
    updateSelectedActivityType(state, value) {
      state.selectedActivityTypes = value;
    },
    updateSelectedSubjects(state, value) {
      state.selectedSubjects = value;
    },
    updateSelectedFilters(state, value) {
      state.selectedFilters = value;
    },
    updateSelectedLanguages(state, value) {
      state.selectedLanguages = value;
    },
  },
});

export default store;
