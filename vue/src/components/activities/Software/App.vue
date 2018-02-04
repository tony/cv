<template>
  <SoftwareProject :item="item" projectType="Application" />
</template>

<script>
import SoftwareProject from './base';

export default {
  name: 'SoftwareApp',
  components: { SoftwareProject },
  props: ['item'],
};
</script>
