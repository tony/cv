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
import githubPatches from './data/scraped/gh_patches.json';
import githubProjects from './data/scraped/gh_projects.json';
import myActivities from './data/myActivities.json';
import myProjects from './data/myProjects.json';
import validateSubjects from './lib/precheck-data';
import { expandRelations } from './lib/expand-data';
import store from './store';
import { LOAD_INITIAL_DATA } from './store/mutation-types';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));

Vue.component('octicon', Octicon);

const activities = [
  ...githubPatches,
  ...myActivities,
];

const initialSubjects = [
  ...githubProjects,
  ...myProjects,
];

validateSubjects(initialSubjects);

const defaultSelectedFilters = [
  'Hide Spelling Contributions',
  'Hide Documentation Contributions',
  'Hide Code Style Contributions',
  'Hide Unmerged Contributions',
];

// Resolve ID to object relationships so they're available in data
const initialActivities = expandRelations(activities, initialSubjects);

// Load initial data
store.commit(
  LOAD_INITIAL_DATA,
  {
    activities: initialActivities,
    subjects: initialSubjects,
    selectedActivityTypes: initialActivities,
    selectedSubjects: null,
    selectedFilters: defaultSelectedFilters,
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
