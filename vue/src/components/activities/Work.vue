<template>
  <Row>
    <div slot="left">
      <h2>Work</h2>
      <div class="languages">
      <span class="tag" v-for="language in item.project.languages" :key="language.id">
      {{language}}
      </span>
      </div>

      <br />
      <p v-show="item.created_date" class="align-octicon"><small>
        {{item.created_date | moment("YYYY")}} -  {{item.end_date | moment("YYYY")}}
      </small></p>
    </div>
    <div slot="right" class="myproject">
      <a :href="item.project.url" target="_blank" class="activity-title" v-if="item.project.logo">
        <img :v-show="item.project.logo" :src="item.project.logo" class="logo" />
      </a>
      <a :href="item.project.url" target="_blank" class="activity-title">
        {{item.title}}
      </a>

      {{item.description}}
      <small class="bottompad10">
        <br />
        <a v-show="item.project.url" :href="item.project.url"
         target="_blank" class="align-octicon">
          <octicon name="home" label="Created"></octicon>
          Website
        </a>
      </small>
    </div>
  </Row>
</template>


<script>
import Row from '../Row';

export default {
  name: 'Work',
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
  max-width: 400px;
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
