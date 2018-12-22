<template>
  <Row
  :component_type="'Open Source Contribution'"
  :created_date="item.created_date"
  :languages="item.actor.languages"
  >
    <div slot="right">
      <h3 class="align-octicon-bottom">
        <a :href="item.qa_url" target="_blank" class="activity-title">
          <octicon name="mark-github" label="View on GitHub"></octicon> {{item.title}}
        </a>
      </h3>

      <p>
        <em>was contributed by Tony to the
        <template v-if="item.actor.url">
          <a :href="item.actor.url" target="_blank" class="muted-link">{{item.actor.name}}</a>
        </template>
        <template v-else>
          {{item.actor.name}}
        </template>

        project
        </em>
      </p>

      <p><small>
        <a :href="item.actor.repo_url" target="_blank" class="muted-link align-octicon">
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
