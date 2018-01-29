<template>
  <Row>
    <div slot="left">
      <h1>Patch</h1>
      <p>
      <span class="tag" v-for="language in item.languages" :key="language.id">
      {{language}}
      </span>

      <br />
      Submitted: <span v-show="item.proposed_date">{{item.proposed_date}}</span>
      <template v-if="item.accepted_date">
      Accepted: <span v-show="item.accepted_date">{{item.accepted_date}}</span>
      </template>
      <template v-else>
      Not merged.
      </template>
      </p>
    </div>
    <div slot="right">
      <h2><a :href="item.qa_url" target="_blank" class="verbTitle">{{item.title}}</a></h2>
      <em>for
      <a :href="item.project.url" target="_blank">{{item.project.name}}</a>
      </em>
      <small>(<a :href="item.project.repo_url" target="_blank">repo</a>)</small>
      <br />
      <a :href="item.in_re_url" v-show="item.in_re_url" target="_blank">issue</a>
      <a :href="item.qa_url" target="_blank">qa</a>
      <a :href="item.diff_url" target="_blank">diff</a>
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
.verbTitle {
  color: #4a4a4a;
  text-decoration: none;
}
</style>
