<template>
  <div>This happened {{item.lol}}</div>
</template>

<script>
export default {
  name: 'Work',
  props: ['opts', 'item'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
  data() {
    return {};
  },
  created: () => {
    // console.log('dfdsfsdfa');
  },
};
</script>

<style>
</style>
