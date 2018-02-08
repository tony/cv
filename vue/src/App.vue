<template>
  <div id="app">
    <header-view/>
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
import Header from '@/components/Header';
import { mapGetters } from 'vuex';
import {
  Website, Volunteer, Publication, Patch, Kudo, Work, Achievement,
  SoftwareApp, SoftwareLib, Presentation, Article,
} from './components/activities';

export default {
  name: 'App',
  components: {
    Patch,
    Website,
    Article,
    Volunteer,
    Publication,
    Kudo,
    Work,
    Achievement,
    SoftwareApp,
    SoftwareLib,
    Presentation,
    'header-view': Header,
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
<style src="cv-lib/assets/css/flexboxgrid.min.css"></style>
<style src="cv-lib/assets/css/git-pull.css"></style>
