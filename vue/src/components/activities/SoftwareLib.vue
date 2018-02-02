<template>
  <Row>
    <div slot="left">
      <h2>Library</h2>
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
  display: block;
}

img.logo {
  width: 200px;
  display: block;
  margin: 1em auto;
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
