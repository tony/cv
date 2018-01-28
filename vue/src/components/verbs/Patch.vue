<template>
  <div class="row">
    <div class="col-xs-10 col-xs-offset-1">
    <div class="box">
    <div class="row">
      <div class="col-xs-4 item"><div class="box">
      <h1>Patch</h1>
      <p>
      <span class="tag" v-for="language in item.languages" :key="language.id">
      {{language}}
      </span>
      </p>
      </div></div>
      <div class="col-xs-8 item"><div class="box">
        <h2>{{item.title}}</h2>
        <em>for
        <a :href="item.project.url" target="_blank">{{item.project.name}}</a>
        </em>
        <small>(<a :href="item.project.repo_url" target="_blank">repo</a>)</small>
        <br />
        (<a :href="item.in_re_url" target="_blank">issue</a>,
        <a :href="item.qa_url" target="_blank">qa</a>,
        <a :href="item.diff_url" target="_blank">patch</a>)
      </div></div>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Patch',
  props: ['opts', 'item'],
  computed: {
    log: () => JSON.stringify(this.opts),
  },
};
</script>

<style>
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
</style>
