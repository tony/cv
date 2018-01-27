<template>
  <div>must be static tpl!</div>
</template>

<script>
export default {
  name: 'Patch',
  props: ['opts'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
  data() {
    return {};
  },
  created: () => {
    console.log(this.opts);
  },
};
</script>

<style>
</style>
