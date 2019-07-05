import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";

import HelloComponent from "./components/Hello.vue";
import HelloDecoratorComponent from "./components/HelloDecorator.vue";

interface IRootState {
  activities: any[];
}
Vue.use(Vuex);

const store: StoreOptions<IRootState> = {
  actions: {
    async loadActivities({ commit }, activities) {
      const { myActivities } = await import(
        /* webpackChunkName: "myData" */ "../../lib/data"
      );
      commit("loadActivities", myActivities);
    }
  },
  mutations: {
    loadActivities(state, activities) {
      state.activities = activities;
    }
  },
  state: {
    activities: []
  }
};

const s = new Vuex.Store<IRootState>(store);
const v = new Vue({
  created() {
    console.log("created");
    s.dispatch("loadActivities");
  },
  components: {
    HelloComponent,
    HelloDecoratorComponent
  },
  computed: { ...Vuex.mapState(["activities"]) },
  data: { name: "World" },
  el: "#root",
  store: s,
  template: `
    <div>
        Name: <input v-model="name" type="text">
        <h1>Hello Component</h1>
        <hello-component :name="name" :initialEnthusiasm="5" />
        <h1>Hello Decorator Component</h1>
        <hello-decorator-component :name="name" :initialEnthusiasm="5" />
          <div v-for="(activity, idx) in activities">
            {{activity.title}}
          </div>
        </div>
    `
});

export default s;
