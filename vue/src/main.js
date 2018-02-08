/* eslint-disable import/no-extraneous-dependencies */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import { ACTIVITIES, ACTORS, DEFAULT_SELECTED_FILTERS } from 'cv-lib/constants';
import App from './App';
import store from './store';
import { LOAD_INITIAL_DATA } from './store/mutation-types';
import './lib/octicons';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));

// Load initial data
store.commit(
  LOAD_INITIAL_DATA,
  {
    activities: ACTIVITIES,
    actors: ACTORS,
    selectedFilters: DEFAULT_SELECTED_FILTERS,
  },
);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
});
