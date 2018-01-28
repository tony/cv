// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import Vuex from 'vuex';
import { schema } from 'normalizr';
import App from './App';
import router from './router';
import items from './cv.json';
import subjects from './subjects.json';

Vue.config.productionTip = false;

Vue.use(Vuex);

// subject
export const project = new schema.Entity('projects');
export const company = new schema.Entity('companies');
export const publication = new schema.Entity('publications');
export const club = new schema.Entity('clubs');


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

// verb / actions
export const kudo = new schema.Entity('kudos'); // hn/reddit/blog/tweet/review
export const patch = new schema.Entity('patches'); // gh, bugzilla
export const status = new schema.Entity('status'); // role
export const achievement = new schema.Entity('achievements'); // exit, cert
export const event = new schema.Entity('achievements'); // released, started
export const presentation = new schema.Entity('presentations');

// adjective
export const language = new schema.Entity('languages');
export const role = new schema.Entity('roles'); // employee, volunteere, president

const store = new Vuex.Store({
  state: {
    count: 0,
    items,
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
