<template>
  <div class="software-project-links">
    <a v-show="item.project.url" :href="item.project.url"
     target="_blank" class="align-octicon">
      <octicon name="home" label="Created"></octicon>
      Website
    </a>
    <a v-show="item.project.repo_url" :href="item.project.repo_url"
     target="_blank" class="align-octicon">
      <octicon name="mark-github" label="Created"></octicon>
      GitHub
    </a>
    <a v-show="item.project.docs_url" :href="item.project.docs_url"
     target="_blank" class="align-octicon">
      <octicon name="book" label="Created"></octicon>
      Docs
    </a>
    <a v-show="item.project.api_url" :href="item.project.api_url"
     target="_blank" class="align-octicon">
      <octicon name="search" label="API"></octicon>
      API
    </a>
    <a v-show="item.project.coverage_url" :href="item.project.coverage_url"
     target="_blank" class="align-octicon">
      <octicon name="graph" label="Created"></octicon>
      Coverage
    </a>
    <a v-show="item.project.ci_url" :href="item.project.ci_url"
     target="_blank" class="align-octicon">
      <octicon name="dashboard" label="Created"></octicon>
      CI
    </a>
    <a v-show="item.project.browse_code_url"
      :href="item.project.browse_code_url" target="_blank" class="align-octicon">
      <octicon name="code" label="Created"></octicon>
      Browse Code
    </a>
    <a v-show="item.project.browse_code_tests_url"
      :href="item.project.browse_code_tests_url" target="_blank" class="align-octicon">
      (tests)
    </a>
    <a v-show="item.project.issues_url"
        :href="item.project.issues_url" target="_blank" class="align-octicon">
      <octicon name="comment-discussion" label="Created"></octicon>
      Issues
    </a>
    <a v-show="item.project.changelog_url"
        :href="item.project.changelog_url" target="_blank" class="align-octicon">
      <octicon name="list-unordered" label="Created"></octicon>
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
