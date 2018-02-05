<template>
  <Row>
    <div slot="left"> <h2>Work</h2>
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
    <div slot="right">
      <ImageTitleLinkColumn :item="item">
        <div slot="links">
         <a v-show="item.project.url" :href="item.project.url"
         target="_blank" class="align-octicon">
          <octicon name="home" label="Created"></octicon>
          Website
          </a>
        </div>
      </ImageTitleLinkColumn>
     </div>
  </Row>
</template>


<script>
import Row from '../partials/Row';
import ImageTitleLinkColumn from '../partials/ImageTitleLinkColumn';

export default {
  name: 'Work',
  components: { Row, ImageTitleLinkColumn },
  props: ['item'],
};
</script>

<style scoped>
>>> img.logo {
  width: 400px;
}
</style>
