<template>
  <div class="right-col-content">
    <template v-if="logo">
    <a :href="url" target="_blank" class="activity-title">
      <img :src="logo" class="logo" />
    </a>
    </template>
    <strong><a :href="url" target="_blank" class="activity-title">
      {{title}}
    </a></strong>

    {{description}}
    <small class="bottompad10">
      <slot name="links"></slot>
    </small>
  </div>
</template>

<script>
export default {
  name: 'ImageTitleLinkColumn',
  props: ['url', 'logo', 'description', 'title'],
};
</script>

<style scoped>
.activity-title {
  margin: 0 auto 1em auto;
}
</style>
