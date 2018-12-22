/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import { INITIAL_DATA, DEFAULT_SELECTED_FILTERS } from 'cv-lib/constants';
import App from './App';
import store from './store';
import { LOAD_INITIAL_DATA } from './store/mutation-types';
import './lib/octicons';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));

store.commit( // Load initial data
  LOAD_INITIAL_DATA,
  {
    ...INITIAL_DATA.entities,
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
