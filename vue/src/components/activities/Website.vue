<template>
  <Row>
    <div slot="left"> <h2>Website</h2>
      <p v-show="item.created_date" class="align-octicon"><small>
        Published {{item.created_date | moment("YYYY")}}
        <template v-if="item.end_date">-  {{item.end_date | moment("YYYY")}}</template>
      </small></p>
    </div>
    <div slot="right">
      <ImageTitleLinkColumn
       :title="item.title"
       :description="item.description"
       :logo="item.project.logo"
       :url="item.project.url"
       >
        <div slot="links">
         <a v-show="item.project.leanpub_url" :href="item.project.leanpub_url"
         target="_blank" class="align-octicon">
           Leanpub
          </a>
         <a v-show="item.project.amazon_url" :href="item.project.amazon_url"
         target="_blank" class="align-octicon">
           Amazon
          </a>
         <a v-show="item.project.goodreads_url" :href="item.project.goodreads_url"
         target="_blank" class="align-octicon">
           Goodreads
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
  name: 'Website',
  components: { Row, ImageTitleLinkColumn },
  props: ['item'],
};
</script>

<style scoped>
>>> img.logo {
  max-width: 200px;
}
</style>
