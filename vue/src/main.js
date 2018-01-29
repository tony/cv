// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import verbs from './data/verbs.json';
import subjects from './data/subjects.json';

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


const store = new Vuex.Store({
  state: {
    count: 0,
    verbs: normalizedVerbs,
    subjects,
    selectedVerbs: availableVerbs(normalizedVerbs),
    selectedSubjects: null,
  },
  getters: {
    verbs: state => state.verbs,
    subjects: state => state.subjects, // subject items
    availableSubjectTypes: state => [
      ...new Set(state.subjects.map(item => item)),
    ],
    availableSubjects: state => availableSubjects(state.subjects),
    availableVerbs: state => availableVerbs(state.verbs),
  },
  actions: {
    updateSelectedVerbsAction({ commit }, value) {
      commit('updateSelectedVerbs', value);
    },
    updateSelectedSubjectsAction({ commit }, value) {
      commit('updateSelectedSubjects', value);
    },
  },
  mutations: {
    updateSelectedVerbs(state, value) {
      console.log('Verb', value);
      state.selectedVerbs = value;
    },
    updateSelectedSubjects(state, value) {
      console.log(value);
      state.selectedSubjects = value;
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
