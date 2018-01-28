<template>
  <div class="item">
    Patch:
    <h1>{{item.title}}</h1>
    <a :href="item.in_re_url" target="_blank">issue</a>
    <a :href="item.qa_url" target="_blank">qa</a>
    <a :href="item.repo_url" target="_blank">repo</a>
    <a :href="item.diff_url" target="_blank">patch</a>
    <ul>
      <li v-for="language in item.languages" :key="language.id">
      {{language}}
      </li>
    </ul>
    {{item.project.name}}
    {{item.project}}
    {{item.project.url}}
    {{item.project.repo_url}}
  </div>
</template>

<script>
export default {
  name: 'Patch',
  props: ['opts', 'item'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
};
</script>

<style>
</style>
