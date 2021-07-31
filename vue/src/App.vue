<template>
  <div id="app">
    <div id="v2-notice">
      Psst. I'm working on something new!
      <a href="https://cv-react-v2.git-pull.com">Take a peek?</a>
    </div>
    <div class="github-fork">
      <span class="author">
        Made with <span role="img" aria-label="love">❤️</span> by
        <a
          href="https://www.git-pull.com"
          rel="noopener noreferrer"
          target="_blank"
          >Tony Narlock</a
        >.
      </span>
      <br />
      Written in Vue.js (<a
        href="https://github.com/tony/cv/tree/v1/vue"
        rel="noopener noreferrer"
        target="_blank"
        >source</a
      >).<br />
      See also: <a href="https://cv-react.git-pull.com">React version</a>.
    </div>
    <header-view />
    <component
      v-for="item in sortedActivities"
      :is="item.component_name"
      :item="item"
      :key="item.index"
      :opts="item.options"
    >
    </component>
  </div>
</template>

<script>
import Header from '@/components/Header';
import { mapGetters } from 'vuex';
import {
  Website,
  Volunteer,
  Publication,
  Patch,
  Work,
  SoftwareApp,
  SoftwareLib,
  Article,
} from './components/activities';

export default {
  name: 'App',
  components: {
    Patch,
    Website,
    Article,
    Volunteer,
    Publication,
    Work,
    SoftwareApp,
    SoftwareLib,
    'header-view': Header,
  },
  computed: mapGetters(['sortedActivities']),
};
</script>

<style src="cv-lib/assets/css/flexboxgrid.min.css"></style>
<style src="cv-lib/assets/css/git-pull.css"></style>
<style src="cv-lib/assets/css/cv.css"></style>
