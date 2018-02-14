<template>
  <div id="app">
    <div class='github-fork'>
      Powered by Vue.js (<a href="https://github.com/tony/cv" rel="noopener noreferrer" target="_blank">source</a>). <a href="/react.html">See React version (beta)</a>.
    </div>
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

<style src="cv-lib/assets/css/flexboxgrid.min.css"></style>
<style src="cv-lib/assets/css/git-pull.css"></style>
<style src="cv-lib/assets/css/cv.css"></style>
