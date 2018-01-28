// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import items from './cv.json';

Vue.config.productionTip = false;

Vue.use(Vuex);

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
