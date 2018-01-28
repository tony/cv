<template>
  <div id="app">
    <router-view/>
    <component
      v-for="item in verbs"
      :is="item.component"
      :item="item"
      :key="item.index"
      :opts="item.options">
    </component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Patch from './components/verbs/Patch';
import Kudo from './components/verbs/Kudo';
import Status from './components/verbs/Status';
import Achievement from './components/verbs/Achievement';
import Event from './components/verbs/Event';
import Presentation from './components/verbs/Presentation';

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
    'verbs',
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
}
</style>
