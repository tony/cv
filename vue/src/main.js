// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import App from './App';
import store from './store';
import { LOAD_INITIAL_DATA } from './store/mutation-types';
import { ACTIVITIES, SUBJECTS, DEFAULT_SELECTED_FILTERS } from './constants';
import './lib/octicons';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));

// Load initial data
store.commit(
  LOAD_INITIAL_DATA,
  {
    activities: ACTIVITIES,
    subjects: SUBJECTS,
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
