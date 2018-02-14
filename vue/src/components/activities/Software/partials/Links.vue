<template>
  <div class="software-project-links">
    <a v-show="item.actor.url" :href="item.actor.url"
     target="_blank" class="align-octicon">
      <octicon name="home"></octicon>
      Website
    </a>
    <a v-show="item.actor.repo_url" :href="item.actor.repo_url"
     target="_blank" class="align-octicon">
      <octicon name="mark-github"></octicon>
      GitHub
    </a>
    <a v-show="item.actor.docs_url" :href="item.actor.docs_url"
     target="_blank" class="align-octicon">
      <octicon name="book"></octicon>
      Docs
    </a>
    <a v-show="item.actor.api_url" :href="item.actor.api_url"
     target="_blank" class="align-octicon">
      <octicon name="search" label="API"></octicon>
      API
    </a>
    <a v-show="item.actor.coverage_url" :href="item.actor.coverage_url"
     target="_blank" class="align-octicon">
      <octicon name="graph"></octicon>
      Coverage
    </a>
    <a v-show="item.actor.ci_url" :href="item.actor.ci_url"
     target="_blank" class="align-octicon">
      <octicon name="dashboard"></octicon>
      CI
    </a>
    <a v-show="item.actor.browse_code_url"
      :href="item.actor.browse_code_url" target="_blank" class="align-octicon">
      <octicon name="code"></octicon>
      Browse Code
    </a>
    <a v-show="item.actor.browse_code_tests_url"
      :href="item.actor.browse_code_tests_url" target="_blank" class="align-octicon">
      (tests)
    </a>
    <a v-show="item.actor.issues_url"
        :href="item.actor.issues_url" target="_blank" class="align-octicon">
      <octicon name="comment-discussion"></octicon>
      Issues
    </a>
    <a v-show="item.actor.changelog_url"
        :href="item.actor.changelog_url" target="_blank" class="align-octicon">
      <octicon name="list-unordered"></octicon>
      Changelog
    </a>
  </div>
</template>

<script>
export default {
  name: 'SoftwareProjectLinks',
  props: ['item'],
};
</script>

<style scoped>
a {
  color: #4a4a4a;
  text-decoration: none;
  padding: 0 .25em;
}
</style>
