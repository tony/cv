<template>
  <Row>
    <div slot="left">
      <h2>Application</h2>
      <div class="languages">
      <span class="tag" v-for="language in item.project.languages" :key="language.id">
      {{language}}
      </span>
      </div>

      <br />
      <p v-show="item.created_date" class="align-octicon"><small>
        <octicon name="repo" label="Created"></octicon>
        Created {{item.created_date | moment("from", "now") }}
        ({{item.created_date}})
      </small></p>
    </div>
    <div slot="right" class="myproject">
      <a :href="item.project.url" target="_blank" class="activity-title">
        <img :v-show="item.project.logo" :src="item.project.logo" class="logo" />
      </a>
      <a :href="item.project.url" target="_blank" class="activity-title">
        {{item.title}}
      </a>

      <small class="bottompad10">
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

      </small>
    </div>
  </Row>
</template>


<script>
import Row from '../Row';

export default {
  name: 'SoftwareApp',
  components: { Row },
  props: ['item', 'opts'],
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
  text-align: center;
  display: block;
}

img.logo {
  width: 200px;
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
}

.align-octicon .octicon {
  vertical-align: text-top;
}
.align-octicon-bottom .octicon {
  vertical-align: text-baseline;
}
a {
  padding: 0 .25em;
}
</style>
