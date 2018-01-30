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
import activities from './data/scraped/gh_patches.json';
import initialSubjects from './data/scraped/gh_projects.json';

// import activities from './data/activities.json';
// import subjects from './data/subjects.json';

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
        throw Error(`invalid type for ${item}`);
    }
  });
}
validateSubjects(initialSubjects);

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
];

function availableActivityTypes(v) {
  return [
    ...new Set(v.map(item => activityTypes.find(vt => vt.component_name === item.component))),
  ];
}

function availableSubjects(subjects, availableActivities) {
  /**
   * Return available Subject targets, minus ones that are filtered out.
   **/
  return [
    ...new Set(availableActivities.map(item => subjects.find(s => s.id === item.project.id))),
  ]
}


const filterTypos = v => v.title.match(/(typo|Typo|spelling|Spelling|note|Note)/);
const filterIgnoreTypos = v => !filterTypos(v);

const filterDocs = v => v.title.match(/(doc|Doc|license|LICENSE|README|readme|link|Link|\.md|instructions|Instructions|guidelines|pypi badge)/);
const filterIgnoreDocs = v => !filterDocs(v);

const filterCodeStyle = v => v.title.match(/(indent|Indent|whitespace|spacing|lint|Lint|sort|Sort|jshint|PEP|pep8|tabs|Tabs)/);
const filterIgnoreCodeStyle = v => !filterCodeStyle(v);

const filterUnmerged = v => v.accepted_date;


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
    availableActivityTypes: (state, getters) => availableActivityTypes(getters.filteredActivities),
    availableFilters: () => Object.keys(filters),
  },
  actions: {
    updateSelectedActivitiesAction({ commit }, value) {
      commit('updateSelectedActivities', value);
    },
    updateSelectedSubjectsAction({ commit }, value) {
      commit('updateSelectedSubjects', value);
    },
    updateSelectedFiltersAction({ commit }, value) {
      console.log(commit, value);
      commit('updateSelectedFilters', value);
    },
  },
  mutations: {
    updateSelectedActivities(state, value) {
      state.selectedActivityTypes = value;
    },
    updateSelectedSubjects(state, value) {
      state.selectedSubjects = value;
    },
    updateSelectedFilters(state, value) {
      let val = value;
      const difference = new Set(
        [...new Set(val)].filter(x => !new Set(state.selectedFilters).has(x)),
      );
      if (difference) {
        if (difference.has('Hide Spelling Contributions') && state.selectedFilters.includes('Only Show Spelling Contributions')) {
          val = val.filter(v => v !== 'Only Show Spelling Contributions');
        } else if (difference.has('Only Show Spelling Contributions') && state.selectedFilters.includes('Hide Spelling Contributions')) {
          val = val.filter(v => v !== 'Hide Spelling Contributions');
        } else if (
          difference.has('Only Show Documentation Contributions') &&
          state.selectedFilters.includes('Hide Documentation Contributions')
        ) {
          val = val.filter(v => v !== 'Hide Documentation Contributions');
        } else if (difference.has('Hide Documentation Contributions') &&
          state.selectedFilters.includes('Only Show Documentation Contributions')
        ) {
          val = val.filter(v => v !== 'Only Show Documentation Contributions');
        }
      }

      state.selectedFilters = val;
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
