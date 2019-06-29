import Vue from "vue";
import HelloComponent from "./components/Hello.vue";
import HelloDecoratorComponent from "./components/HelloDecorator.vue";

const v = new Vue({
  components: {
    HelloComponent,
    HelloDecoratorComponent
  },
  data: { name: "World" },
  el: "#root",
  template: `
    <div>
        Name: <input v-model="name" type="text">
        <h1>Hello Component</h1>
        <hello-component :name="name" :initialEnthusiasm="5" />
        <h1>Hello Decorator Component</h1>
        <hello-decorator-component :name="name" :initialEnthusiasm="5" />
        </div>
    `
});
