<template>
  <span
    class="tag"
    :style="{ backgroundColor: language.color }"
    >{{language.name}}</span>
</template>

<script>

export default {
  name: 'LanguageTag',
  props: ['language', 'item', 'idx'],
};
</script>

<style scoped>
.tag {
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, .7);
  margin-left: 0.2em;
}
</style>
