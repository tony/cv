// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/vuejs/vue/issues/3270#issuecomment-232269588
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.component('node3', (resolve) => { // (resolve, reject)
  setTimeout(() => {
    resolve({
      template: '<div>I am async node3!</div>',
      created: () => {
        // can we access props transferred into async component via component
        console.log(this.opts);
      },
    });
  }, 1000);
});

Vue.component('node', {
  template: '<div>must be static tpl!</div>', // 这里this.opts是无法访问的，必须通过所谓async component才能够实现
  props: ['opts'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
  data() {
    return {};
  },
  created: () => {
    console.log(this.opts);
  },
});

Vue.component('node2', {
  template: '<div>node2 {{item.lol}}</div>',
  props: ['opts', 'item'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
  data() {
    return {};
  },
  created: () => {
    console.log('dfdsfsdfa');
  },
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
