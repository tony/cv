<template>
  <SoftwareProject :item="item" projectType="Library" />
</template>

<script>
import SoftwareProject from './SoftwareProject';

export default {
  name: 'SoftwareApp',
  components: { SoftwareProject },
  props: ['item'],
};
</script>

<style scoped>
img.logo {
  width: 200px;
}
</style>
