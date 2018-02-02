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

import store from './store';
import { LOAD_INITIAL_DATA } from './store/mutation-types';

const activities = [
  ...githubPatches,
  ...myActivities,
];

const initialSubjects = [
  ...githubProjects,
  ...myProjects,
];

Vue.config.productionTip = false;

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
      case 'SoftwareApp':
        if (item.project !== undefined) {
          return Object.assign(
            item,
            {
              project: lookupSubjectById(initialSubjects, 'project', item.project),
            },
          );
        }
        return item;
      case 'SoftwareLib':
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

const defaultSelectedFilters = [
  'Hide Spelling Contributions',
  'Hide Documentation Contributions',
  'Hide Code Style Contributions',
  'Hide Unmerged Contributions',
];

// Resolve ID to object relationships so they're available in data
const initialActivities = expandRelations(activities);

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
