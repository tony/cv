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
        <a v-show="item.project.url" :href="item.project.url" target="_blank">Website</a>
        <template v-if="item.project.url">|</template>
        <a v-show="item.project.repo_url" :href="item.project.repo_url" target="_blank">GitHub</a>
        <template v-if="item.project.docs_url">|</template>
        <a v-show="item.project.docs_url" :href="item.project.docs_url" target="_blank">Docs</a>
        <template v-if="item.project.docs_url">|</template>
        <a v-show="item.project.api_url" :href="item.project.api_url" target="_blank">API</a>
        <template v-if="item.project.coverage_url">|</template>
        <a v-show="item.project.coverage_url" :href="item.project.coverage_url" target="_blank">
          Coverage
        </a>
        <template v-if="item.project.ci_url">|</template>
        <a v-show="item.project.ci_url" :href="item.project.ci_url" target="_blank">CI</a>
        <template v-if="item.project.browse_code_url">|</template>
        <a v-show="item.project.browse_code_url"
          :href="item.project.browse_code_url" target="_blank">Browse Code</a>
        <template v-if="item.project.browse_code_tests_url">(</template>
          <a v-show="item.project.browse_code_tests_url"
            :href="item.project.browse_code_tests_url" target="_blank">Tests</a>
        <template v-if="item.project.browse_code_tests_url">)</template>
        <template v-if="item.project.issues_url">|</template>
        <a v-show="item.project.issues_url"
            :href="item.project.issues_url" target="_blank">
          Issues
        </a>
        <template v-if="item.project.changelog_url">|</template>
        <a v-show="item.project.changelog_url"
            :href="item.project.changelog_url" target="_blank">
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
</style>
