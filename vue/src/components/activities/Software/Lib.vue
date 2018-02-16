<template>
  <SoftwareProject :item="item" component_type="Library" />
</template>

<script>
import SoftwareProject from './base';

export default {
  name: 'SoftwareApp',
  components: { SoftwareProject },
  props: ['item'],
};
</script>
