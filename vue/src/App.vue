<template>
  <div id="app">
    <router-view/>
    <component
      v-for="item in sortedActivities"
      :is="item.component"
      :item="item"
      :key="item.index"
      :opts="item.options">
    </component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import {
  Website, Volunteer, Publication, Patch, Kudo, Work, Achievement,
  SoftwareApp, SoftwareLib, Presentation,
} from './components/activities';

export default {
  name: 'App',
  components: {
    Patch,
    Website,
    Volunteer,
    Publication,
    Kudo,
    Work,
    Achievement,
    SoftwareApp,
    SoftwareLib,
    Presentation,
  },
  computed: mapGetters([
    'filteredActivities',
    'sortedActivities',
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
  color: #4a4a4a;
  max-width: 100%;
  position: relative;
  margin-top: 1rem;
}
.item:first-of-type {
  margin-top: 1rem;
}
</style>
<style src="./assets/css/flexboxgrid.min.css"></style>
<style src="./assets/css/git-pull.css"></style>
