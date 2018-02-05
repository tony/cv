<template>
  <Row>
    <div slot="left">
      <h2>Open Source Contribution</h2>

      <p v-show="item.created_date" class="align-octicon"><small>
        <octicon name="repo" label="Submitted"></octicon>
        Submitted {{item.created_date | moment("from", "now") }}
        ({{item.created_date}})
      </small></p>

      <div class="languages hide-sm">
      <span class="tag" v-for="language in item.project.languages" :key="language.id">
      {{language}}
      </span>
      </div>
    </div>
    <div slot="right">
      <h3 class="align-octicon-bottom">
        <a :href="item.qa_url" target="_blank" class="activity-title">
          <octicon name="mark-github" label="View on GitHub"></octicon>
          {{item.title}}
        </a>
      </h3>

      <p>
        <em>was contributed by Tony to the
        <template v-if="item.project.url">
          <a :href="item.project.url" target="_blank" class="muted-link">{{item.project.name}}</a>
        </template>
        <template v-else>
          {{item.project.name}}
        </template>

        project
        </em>
      </p>

      <p><small>
        <a :href="item.project.repo_url" target="_blank" class="muted-link align-octicon">
          <octicon name="repo" label="GH"></octicon>
          Repository
        </a>

        <a :href="item.in_re_url" v-show="item.in_re_url" target="_blank">issue</a>

        <a :href="item.qa_url" target="_blank" class="muted-link align-octicon">
          <octicon name="git-pull-request" label="Pull Request"></octicon>
          Pull Request
        </a>

        <a :href="item.diff_url" target="_blank" class="muted-link align-octicon">
          <octicon name="diff" label="Diff"></octicon>
          .diff File
        </a>
      </small></p>

      <p><small>
        <template v-if="item.accepted_date">
        <span v-show="item.accepted_date" class="align-octicon">
          <octicon name="check" label="Merged"></octicon>
          Accepted {{item.accepted_date}}
        </span>
        </template>
        <template v-else>
          <em>Unmerged</em>
        </template>
      </small></p>
    </div>
  </Row>
</template>

<script>
import Row from '../partials/Row';

export default {
  name: 'Patch',
  components: { Row },
  props: ['opts', 'item'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tag {
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 3px;
  color: #4a4a4a;
  display: inline-flex;
  font-size: .75rem;
  justify-content: center;
  line-height: 1.5;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
}
.activity-title {
  color: #4a4a4a;
  text-decoration: none;
}

a {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
a.muted-link {
  color: #4a4a4a;
  &:hover {
    color: #0366d6;
    text-decoration: none;
  }
}

.align-octicon .octicon {
  vertical-align: text-top;
}
.align-octicon-bottom .octicon {
  vertical-align: text-baseline;
}
</style>
