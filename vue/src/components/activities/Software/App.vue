<template>
  <SoftwareProject :item="item" component_type="Application" />
</template>

<script>
import SoftwareProject from './base';

export default {
  name: 'SoftwareApp',
  components: { SoftwareProject },
  props: ['item'],
};
</script>
