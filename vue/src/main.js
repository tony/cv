/* eslint-disable import/no-extraneous-dependencies */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import { normalize, schema } from 'normalizr';
import { activityTypes } from 'cv-lib/storage';
import { ACTIVITIES, DEFAULT_SELECTED_FILTERS } from 'cv-lib/constants';
import App from './App';
import store from './store';
import { LOAD_INITIAL_DATA } from './store/mutation-types';
import './lib/octicons';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));

const activityType = new schema.Entity('activityTypes', {}, {
  idAttribute: 'component_name',
});

const language = new schema.Entity('languages', {}, { idAttribute: 'name' });
const actor = new schema.Entity('actors', { languages: [language] }, {
  idAttribute: 'id',
});
const normalizedActivityTypes = normalize(activityTypes, [activityType]);
const activity = new schema.Entity('activities', { actor, component_name: activityType }, {
  processStrategy: entity => (
    Object.assign({}, entity, {
      visible: false,
      component_name: normalizedActivityTypes.entities.activityTypes[entity.component_name],
    })
  ),
});

const normalizedData = normalize(ACTIVITIES, [activity]);

// Load initial data
store.commit(
  LOAD_INITIAL_DATA,
  {
    // activities: ACTIVITIES,
    // actors: ACTORS,
    ...normalizedData.entities,
    activityIds: normalizedData.result,
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
