// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import Vuex from 'vuex';
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/diff';
import 'vue-octicon/icons/mark-github';
import 'vue-octicon/icons/git-merge';
import 'vue-octicon/icons/check';
import 'vue-octicon/icons/repo';
import 'vue-octicon/icons/git-pull-request';

import App from './App';
import router from './router';
import githubPatches from './data/scraped/gh_patches.json';
import githubProjects from './data/scraped/gh_projects.json';
import myActivities from './data/myActivities.json';
import myProjects from './data/myProjects.json';

const activities = [
  ...githubPatches,
  ...myActivities,
];

const initialSubjects = [
  ...githubProjects,
  ...myProjects,
];

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(require('vue-moment'));

Vue.component('octicon', Octicon);

// subject
// project, 'projects'
// company, 'companies'
// publication, 'publications'
// club, 'clubs'

// verb / actions
// kudo, 'kudos'; // hn/reddit/blog/tweet/review
// patch, 'patches' //  gh, bugzilla
// status, 'status // role
// achievement, 'achievements  // exit, cert
// event, 'achievements' // released, started
// presentation = 'presentations'

// adjective
// language, 'languages'
// role, 'roles' // employee, volunteere, president

function validateProject(item) {
  console.assert('name' in item, item, 'name not in item');
  console.assert('url' in item, item, 'url not in item');
  console.assert('repo_url' in item, item, 'repo_url not in item');
}

function validateSubjects(list) {
  list.forEach((item) => {
    switch (item.type) {
      case 'project':
        validateProject(item);
        break;
      default:
        throw Error(`invalid type ${item.type} for ${item}`);
    }
  });
}
validateSubjects(initialSubjects);

function lookupSubjectById(subjects, type, id) {
  return subjects.find(sub => sub.type === type && sub.id === id);
}

function expandRelations(items) {
  /**
   * Expands primary key/ID relations with other objects.
   *
   * @param {Array, <Object>} items
   * @return {Void}
   */
  items.map((item) => {
    switch (item.component) {
      case 'Patch':
        if (item.project !== undefined) {
          return Object.assign(
            item, { project: initialSubjects[item.project] },
          );
        }
        return item;
      case 'MyProject':
        if (item.project !== undefined) {
          return Object.assign(
            item,
            {
              project: lookupSubjectById(initialSubjects, 'project', item.project),
            },
          );
        }
        return item;
      default:
        return item;
    }
  });
  return items;
}

const activityTypes = [
  {
    name: 'Open Source Contributions',
    component_name: 'Patch',
  },
  {
    name: 'My Projects',
    component_name: 'MyProject',
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


const filterTypos = v => v.title.match(/(typo|Typo|spelling|Spelling|note|Note)/);
const filterIgnoreTypos = v => !filterTypos(v);

const filterDocs = v => v.title.match(/(doc|Doc|license|LICENSE|README|readme|link|Link|\.md|instructions|Instructions|guidelines|pypi badge)/);
const filterIgnoreDocs = v => !filterDocs(v);

const filterCodeStyle = v => v.title.match(/(indent|Indent|whitespace|spacing|lint|Lint|sort|Sort|jshint|PEP|pep8|tabs|Tabs)/);
const filterIgnoreCodeStyle = v => !filterCodeStyle(v);

const filterUnmerged = v => ('accepted_date' in v ? v.accepted_date : true);


const filters = {
  'Hide Spelling Contributions': filterIgnoreTypos,
  'Hide Documentation Contributions': filterIgnoreDocs,
  'Hide Code Style Contributions': filterIgnoreCodeStyle,
  'Hide Unmerged Contributions': filterUnmerged,
};

const defaultSelectedFilters = [
  'Hide Spelling Contributions',
  'Hide Documentation Contributions',
  'Hide Code Style Contributions',
  'Hide Unmerged Contributions',
];

function filterActivityTypes(vItems, selActivityTypes, selFilters, selSubjects) {
  // only show selected activity types
  let items = vItems.filter(
    vItem => selActivityTypes.map(sA => sA.component_name).includes(vItem.component),
  );
  if (selSubjects && selSubjects.length) {
    items = items.filter(item => selSubjects.find(s => s.id === item.project.id));
  }

  selFilters.forEach((filterName) => {
    items = items.filter(filters[filterName]);
  });
  return items;
}

// Resolve ID to object relationships so they're available in data
const initialActivities = expandRelations(activities);

const store = new Vuex.Store({
  state: {
    count: 0,
    activities: initialActivities,
    subjects: initialSubjects,
    selectedActivityTypes: availableActivityTypes(initialActivities),
    selectedSubjects: null,
    selectedFilters: defaultSelectedFilters,
  },
  getters: {
    filteredActivities: state => filterActivityTypes(
      state.activities,
      state.selectedActivityTypes,
      state.selectedFilters,
      state.selectedSubjects,
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
  },
  mutations: {
    updateSelectedActivityType(state, value) {
      state.selectedActivityTypes = value;
    },
    updateSelectedSubjects(state, value) {
      state.selectedSubjects = value;
    },
    updateSelectedFilters(state, value) {
      state.selectedFilters = value;
    },
  },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
