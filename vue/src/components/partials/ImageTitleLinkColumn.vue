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
  text-align: center;
  font-size: 1.17em;
  color: #4a4a4a;
  margin: 0 auto 1em auto;
  display: block;
}

img.logo {
  display: block;
  margin: 1em auto;
}

.bottompad10 {
  margin-bottom: 1em;
  display: block;
}

a {
  color: #4a4a4a;
  text-decoration: none;
  padding: 0 .25em;
}
</style>
