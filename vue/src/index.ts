import Vue from "vue";
import Vuex, { Commit, StoreOptions } from "vuex";

import HelloComponent from "./components/Hello.vue";
import HelloDecoratorComponent from "./components/HelloDecorator.vue";
import ChristmasTreeSVG from "../../data/img/icons/christmas-tree.svg";

import { IActivity } from "../../lib/types";

interface IRootState {
  activities: IActivity[];
}

const store: StoreOptions<IRootState> = {
  actions: {
    async loadActivities(
      {
        commit,
      }: {
        commit: Commit;
      } // activities: IRootState["activities"]
    ) {
      const { activities: myActivities } = await import(
        /* webpackChunkName: "cvData" */ "../../lib/data/raw"
      );
      commit("loadActivities", myActivities);
    },
  },
  mutations: {
    loadActivities(state: IRootState, activities: IRootState["activities"]) {
      state.activities = activities;
    },
  },
  state: {
    activities: [],
  },
};

Vue.use(Vuex);
const s = new Vuex.Store<IRootState>(store);

// tslint:disable-next-line:no-unused-expression
new Vue({
  created() {
    s.dispatch("loadActivities");
  },
  components: {
    HelloComponent,
    HelloDecoratorComponent,
    ChristmasTreeSVG,
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
        <ChristmasTreeSVG :width="16" :height="16" />
        <hello-decorator-component :name="name" :initialEnthusiasm="5" />
          <div v-for="(activity, idx) in activities">
            {{activity.title}}
          </div>
        </div>
    `,
});

export default s;
