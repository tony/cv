<template>
  <div id="app">
    <router-view/>
    <component
      v-for="item in items"
      :is="item.component"
      :item="item"
      :key="item.index"
      :opts="item.options">
    </component>
  </div>
</template>

<script>
import items from './cv.json';
import Patch from './components/item_types/Patch';
import Website from './components/item_types/Website';
import Project from './components/item_types/Project';

export default {
  name: 'App',
  components: {
    Patch,
    Website,
    Project,
  },
  data() {
    return { items };
  },
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
</style>
