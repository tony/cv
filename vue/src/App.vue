<template>
  <div id="app">
    <router-view/>
    <component
      v-for="item in activities"
      :is="item.component"
      :item="item"
      :key="item.index"
      :opts="item.options">
    </component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { Patch, Kudo, Status, Achievement, Event, Presentation } from './components/activities';

export default {
  name: 'App',
  components: {
    Patch,
    Kudo,
    Status,
    Achievement,
    Event,
    Presentation,
  },
  computed: mapGetters([
    'activities',
  ]),
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.item {
  background-color: #fff;
  box-shadow: 0 2px 3px hsla(0,0%,4%,.1), 0 0 0 1px hsla(0,0%,4%,.1);
  color: #4a4a4a;
  max-width: 100%;
  position: relative;
  margin-top: 1rem;
}
.item:first-of-type {
  margin-top: 1rem;
}
</style>
<style src="../../../_static/flexboxgrid.min.css"></style>
<style src="../../../_static/git-pull.css"></style>
