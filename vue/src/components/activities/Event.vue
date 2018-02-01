<template>
  <Row>
    <div slot="left">
      <h2>My Project</h2>
      <div class="languages">
      <span class="tag" v-for="language in item.project.languages" :key="language.id">
      {{language}}
      </span>
      </div>

      <br />
      <p v-show="item.proposed_date" class="align-octicon"><small>
        <octicon name="repo" label="Submitted"></octicon>
        Submitted {{item.proposed_date | moment("from", "now") }}
        ({{item.proposed_date}})
      </small></p>
    </div>
    <div slot="right">
      <h3 class="align-octicon-bottom">
        <a :href="item.qa_url" target="_blank" class="activity-title">
          <octicon name="mark-github" label="View on GitHub"></octicon>
          {{item.title}}
        </a>
      </h3>
    </div>
  </Row>
</template>


<script>
import Row from '../Row';

export default {
  name: 'Event',
  components: { Row },
  props: ['item', 'opts'],
};
</script>

<style>
</style>
