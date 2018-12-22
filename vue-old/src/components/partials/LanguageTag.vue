<template>
  <span
    class="tag language-tag"
    :style="{ backgroundColor: language.color, color: language.textColor }"
    >{{language.name}}</span>
</template>

<script>

export default {
  name: 'LanguageTag',
  props: ['language', 'item', 'idx'],
};
</script>
