<template>
  <Row>
    <div slot="left">
      <h1>Open Source Contribution</h1>
      <div class="languages">
      <span class="tag" v-for="language in item.project.languages" :key="language.id">
      {{language}}
      </span>
      </div>

      <br />
      <p v-show="item.proposed_date">
        Submitted {{item.proposed_date | moment("from", "now") }}
        <small>({{item.proposed_date}})</small>
      </p>
      <br />
    </div>
    <div slot="right">
      <h2><a :href="item.qa_url" target="_blank" class="activityTitle">
        {{item.title}}
        <octicon name="mark-github" label="View on GitHub"></octicon>
      </a></h2>
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
import Row from '../Row';

export default {
  name: 'Patch',
  components: { Row },
  props: ['opts', 'item'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
};
</script>

<style scoped>
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
.activityTitle {
  color: #4a4a4a;
  text-decoration: none;
}
a[href^="http"] {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
a.muted-link {
  color: #4a4a4a;
}
a.muted-link:hover {
  color: #0366d6;
  text-decoration: none;
}
.align-octicon .octicon {
  vertical-align: text-top;
}
</style>
