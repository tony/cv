<template>
  <Row>
    <div slot="left">
      <h1>Open Source Contribution</h1>
      <p>
      <span class="tag" v-for="language in item.project.languages" :key="language.id">
      {{language}}
      </span>

      <br />
      <span v-show="item.proposed_date">
        Submitted {{item.proposed_date | moment("from", "now") }}
        <small>({{item.proposed_date}})</small>
      </span>
      <br />
      <template v-if="item.accepted_date">
      <span v-show="item.accepted_date"><small>
        <octicon name="git-merge" label="Merged"></octicon>
        Accepted {{item.accepted_date}}
      </small></span>
      </template>
      <template v-else>
        <small><em>Unmerged</em></small>
      </template>
      </p>
    </div>
    <div slot="right">
      <h2><a :href="item.qa_url" target="_blank" class="activityTitle">
        {{item.title}}
        <octicon name="mark-github" label="View on GitHub"></octicon>
      </a></h2>
      <em>for
      <a :href="item.project.url" target="_blank">{{item.project.name}}</a>
      </em>
      <small>(<a :href="item.project.repo_url" target="_blank">repo</a>)</small>
      <br />
      <a :href="item.in_re_url" v-show="item.in_re_url" target="_blank">issue</a>
      <octicon name="git-pull-request" label="Pull Request"></octicon>
      <a :href="item.qa_url" target="_blank">qa</a>
      <octicon name="diff" label="Diff"></octicon>
      <a :href="item.diff_url" target="_blank">
        diff
      </a>
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
</style>
