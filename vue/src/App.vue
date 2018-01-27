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
export default {
  name: 'App',
  data() {
    return {
      newItem: {
        component: '',
        options: '',
      },
      items: [{
        component: 'node',
        options: {
          type: 'node',
          tpl: '<div>node: {{ opts }} {{ log }}</div>',
        },
      },
      {
        component: 'node2',
        lol: 'custom data success',
        options: {
          type: 'node2',
          tpl: '<div>node2: {{ opts }} {{ log }}</div>',
        },
      }, {
        component: 'node3',
        options: {
          type: 'node3',
          tpl: '<div>node3: {{ opts }} {{ log }}</div>',
        },
      },
      ],
    };
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
