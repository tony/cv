// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import items from './cv.json';
import subjects from './subjects.json';

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
    switch (item.subject) {
      case 'project':
        validateProject(item);
        break;
      default:
        throw Error(`invalid subject for ${item}`);
    }
  });
}
validateSubjects(subjects);

function normalizeVerbs(verbs) {
  verbs.map((item) => {
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
  return verbs;
}

const normalizedVerbs = normalizeVerbs(items);

const store = new Vuex.Store({
  state: {
    count: 0,
    items: normalizedVerbs,
    // items,
    subjects,
  },
  getters: {
    items: state => state.items,
  },
  mutations: {
    increment(state) {
      state.count += 1;
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
