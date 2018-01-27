<template>
  <div>node2 {{item.lol}}</div>
</template>

<script>
export default {
  name: 'Node2',
  props: ['opts', 'item'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
  data() {
    return {};
  },
  created: () => {
    console.log('dfdsfsdfa');
  },
};
</script>

<style>
</style>
