// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import verbs from './data/scraped/gh_patches.json';
import subjects from './data/scraped/gh_projects.json';

// import verbs from './data/verbs.json';
// import subjects from './data/subjects.json';

Vue.config.productionTip = false;

Vue.use(Vuex);

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
validateSubjects(subjects);

function normalizeVerbs(v) {
  v.map((item) => {
    switch (item.component) {
      case 'Patch':
        if (item.project !== undefined) {
          return Object.assign(
            item, { project: subjects[item.project] },
          );
        }
        return item;
      default:
        return item;
    }
  });
  return v;
}

const normalizedVerbs = normalizeVerbs(verbs);

function availableVerbs(v) {
  return [
    ...new Set(v.map(item => item.component)),
  ];
}

function availableSubjects(s) {
  return [
    s.map(item => item.project),
  ];
}


const filterTypos = v => v.title.match(/(typo|Typo|spelling|Spelling|note|Note)/);
const filterIgnoreTypos = v => !filterTypos(v);

const filterDocs = v => v.title.match(/(doc|Doc|license|LICENSE|README|readme)/);
const filterIgnoreDocs = v => !filterDocs(v);


const filters = {
  'Ignore Typos': filterIgnoreTypos,
  'Ignore Documentation': filterIgnoreDocs,
  'Only Typos': filterTypos,
  'Only Documentation': filterDocs,
};

const defaultSelectedFilters = [
  'Ignore Typos',
  'Ignore Documentation',
];

function filterVerbs(vItems, selVerbs, selFilters, selSubjects) {
  // only show selected verbs
  let items = vItems.filter(vItem => selVerbs.includes(vItem.component));
  if (selSubjects && selSubjects.length) {
    items = items.filter(item => selSubjects.find(s => s.id === item.project.id));
  }


  selFilters.forEach((filterName) => {
    items = items.filter(filters[filterName]);
  });
  return items;
}


const store = new Vuex.Store({
  state: {
    count: 0,
    verbs: normalizedVerbs,
    subjects,
    selectedVerbs: availableVerbs(normalizedVerbs),
    selectedSubjects: null,
    selectedFilters: defaultSelectedFilters,
  },
  getters: {
    verbs: state => filterVerbs(
      state.verbs,
      state.selectedVerbs,
      state.selectedFilters,
      state.selectedSubjects,
    ),
    subjects: state => state.subjects, // subject items
    availableSubjectTypes: state => [
      ...new Set(state.subjects.map(item => item)),
    ],
    availableSubjects: state => availableSubjects(state.subjects),
    availableVerbs: state => availableVerbs(state.verbs),
    availableFilters: () => Object.keys(filters),
  },
  actions: {
    updateSelectedVerbsAction({ commit }, value) {
      commit('updateSelectedVerbs', value);
    },
    updateSelectedSubjectsAction({ commit }, value) {
      commit('updateSelectedSubjects', value);
    },
    updateSelectedFiltersAction({ commit }, value) {
      commit('updateSelectedFilters', value);
    },
  },
  mutations: {
    updateSelectedVerbs(state, value) {
      state.selectedVerbs = value;
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
        if (difference.has('Ignore Typos') && state.selectedFilters.includes('Only Typos')) {
          val = val.filter(v => v !== 'Only Typos');
        } else if (difference.has('Only Typos') && state.selectedFilters.includes('Ignore Typos')) {
          val = val.filter(v => v !== 'Ignore Typos');
        } else if (
          difference.has('Only Documentation') &&
          state.selectedFilters.includes('Ignore Documentation')
        ) {
          val = val.filter(v => v !== 'Ignore Documentation');
        } else if (difference.has('Ignore Documentation') &&
          state.selectedFilters.includes('Only Documentation')
        ) {
          val = val.filter(v => v !== 'Only Documentation');
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
