<template>
  <Row>
    <div slot="left"> <h2>Publication</h2>
      <p v-show="item.created_date" class="align-octicon"><small>
        Published {{item.created_date | moment("YYYY")}} -  {{item.end_date | moment("YYYY")}}
      </small></p>
    </div>
    <div slot="right">
      <ImageTitleLinkColumn :item="item">
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
  name: 'Publication',
  components: { Row, ImageTitleLinkColumn },
  props: ['item'],
};
</script>

<style scoped>
>>> img.logo {
  max-width: 400px;
}
</style>
