import Vue from "vue";
import Vuex, { Commit, StoreOptions } from "vuex";

import HelloComponent from "./components/Hello.vue";
import HelloDecoratorComponent from "./components/HelloDecorator.vue";

import type { IActivity } from "@tony/cv-lib/data/types";

import ChristmasTreeSVG from "@tony/cv-data/img/icons/christmas-tree.svg";

import "@tony/cv-nav/components";

import style from "!raw-loader!sass-loader!./style.scss";

interface IRootState {
  activities: IActivity[];
}

declare const __TITLE__: string;

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
        /* webpackChunkName: "cvData" */ "@tony/cv-lib/data/raw"
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

new Vue({
  created() {
    s.dispatch("loadActivities");
    document.title = __TITLE__;
    let st = document.createElement("style");
    st.type = "text/css";
    st.innerHTML = style;
    document.head.appendChild(st);
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
      <cv-nav />
      Name: <input v-model="name" type="text">
      <h1>Hello Component</h1>
      <hello-component :name="name" :initialEnthusiasm="5" />
      <h1>Hello Decorator Component</h1>
      <ChristmasTreeSVG :width="16" :height="16" />
      <vue-title :title="$data.__TITLE__"></vue-title>
      <hello-decorator-component :name="name" :initialEnthusiasm="5" />
      <div v-for="(activity, idx) in activities">
        {{activity.title}}
      </div>
    </div>
    `,
});

export default s;
