<template>
  <div class="right-col-content">
  <a :href="item.project.url" target="_blank" class="activity-title" v-if="item.project.logo">
    <img :v-show="item.project.logo" :src="item.project.logo" class="logo" />
  </a>
  <a :href="item.project.url" target="_blank" class="activity-title">
    {{item.title}}
  </a>

  {{item.description}}
  <small class="bottompad10">
    <slot name="links"></slot>
  </small>
  </div>
</template>

<script>
export default {
  name: 'ImageTitleLinkColumn',
  props: ['item'],
};
</script>

<style scoped>
.myproject {
  text-align: center;
}

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
