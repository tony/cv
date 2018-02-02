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
  let languages = [];
  languages = availableActivities.map(item => item.project.languages);
  languages = [].concat(...languages);
  languages = languages.filter(h => h);
  languages = new Set(languages);
  return [...languages];
}


const filterTypos = v => v.title.match(/(typo|Typo|spelling|Spelling|note|Note|correct|Correct|Fix type|Fix URL)/);
const filterIgnoreTypos = v => !filterTypos(v);

const filterDocs = v => v.title.match(/(doc|Doc|license|LICENSE|README|readme|link|Link|\.md|instructions|Instructions|guidelines|pypi badge|AUTHORS|License|changelog|label|copyright|add cookiecutter|issue template)/);
const filterIgnoreDocs = v => !filterDocs(v);

const filterCodeStyle = v => v.title.match(/(indent|Indent|whitespace|spacing|lint|Lint|sort|Sort|jshint|PEP|pep8|tabs|Tabs|Ignore|ignore|__about__|import|tweak|Tweak|hash|modernize|Add.*module|trivial|travis|Travis|dependency|MANIFEST.in)/);
const filterIgnoreCodeStyle = v => !filterCodeStyle(v);

const filterUnmerged = v => ('accepted_date' in v ? v.accepted_date : true);


const filters = {
  'Hide Spelling Contributions': filterIgnoreTypos,
  'Hide Documentation Contributions': filterIgnoreDocs,
  'Hide Code Style Contributions': filterIgnoreCodeStyle,
  'Hide Unmerged Contributions': filterUnmerged,
};

function reduceActivities(vItems, selActivityTypes, selFilters) {
  // only show selected activity types
  let items = vItems.filter(
    vItem => selActivityTypes.map(sA => sA.component_name).includes(vItem.component),
  );

  selFilters.forEach((filterName) => {
    items = items.filter(filters[filterName]);
  });
  return items;
}

const store = new Vuex.Store({
  state: {
    count: 0,
    activities: null,
    subjects: null,
    selectedActivityTypes: null,
    selectedSubjects: null,
    selectedFilters: null,
    selectedLanguages: null,
  },
  getters: {
    availableLanguages: state => availableLanguages(
      state.activities,
    ),
    filteredActivities: state => reduceActivities(
      state.activities,
      state.selectedActivityTypes,
      state.selectedFilters,
      state.selectedSubjects,
    ),
    filteredActivitiesMinusProjects: (state, getters) => {
      if (state.selectedSubjects && state.selectedSubjects.length) {
        return getters.filteredActivities.filter(
          item => state.selectedSubjects.find(s => s.id === item.project.id),
        );
      }
      return getters.filteredActivities;
    },
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
      state.selectedActivityTypes = availableActivityTypes(data.activities);
      state.selectedSubjects = null;
      state.selectedFilters = data.selectedFilters;
      state.selectedLanguages = null;
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
