// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/diff';
import 'vue-octicon/icons/mark-github';
import 'vue-octicon/icons/git-merge';
import 'vue-octicon/icons/check';
import 'vue-octicon/icons/repo';
import 'vue-octicon/icons/book';
import 'vue-octicon/icons/code';
import 'vue-octicon/icons/home';
import 'vue-octicon/icons/dashboard';
import 'vue-octicon/icons/list-unordered';
import 'vue-octicon/icons/graph';
import 'vue-octicon/icons/search';
import 'vue-octicon/icons/checklist';
import 'vue-octicon/icons/comment-discussion';
import 'vue-octicon/icons/git-pull-request';

import App from './App';
import router from './router';
import store from './store';
import { LOAD_INITIAL_DATA } from './store/mutation-types';
import { ACTIVITIES, SUBJECTS, DEFAULT_SELECTED_FILTERS } from './constants';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));

Vue.component('octicon', Octicon);

// Load initial data
store.commit(
  LOAD_INITIAL_DATA,
  {
    activities: ACTIVITIES,
    subjects: SUBJECTS,
    selectedActivityTypes: ACTIVITIES,
    selectedSubjects: null,
    selectedFilters: DEFAULT_SELECTED_FILTERS,
  },
);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
