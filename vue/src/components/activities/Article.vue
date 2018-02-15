<template>
  <Row>
    <div slot="left"> <h2>Article</h2>
      <p v-show="item.created_date" class="align-octicon"><small>
        <octicon name="clock" label="Submitted"></octicon>
        {{item.created_date}}
        <template v-if="item.end_date">-  {{item.end_date | moment("YYYY")}}</template>
      </small></p>
    </div>
    <div slot="right">
      <ImageTitleLinkColumn
       :url="item.url"
       :title="item.title"
       :logo="false"
       >
        <div slot="links">
         <template v-if="item.featured">Discussed on </template>
         <a
          v-for="(link, title) in item.featured" :href="link"
          :key="title" target="_blank" class="align-octicon">
           {{title}}
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
  name: 'Article',
  components: { Row, ImageTitleLinkColumn },
  props: ['item'],
};
</script>

<style scoped>
>>> img.logo {
  max-width: 400px;
}
</style>
