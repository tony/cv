<template>
  <Row>
    <div slot="left"> <h2>Volunteer</h2>
      <p v-show="item.created_date" class="align-octicon"><small>
        {{item.created_date | moment("YYYY")}} -
        <template v-if="item.end_date">{{item.end_date | moment("YYYY")}}</template>
      </small></p>
    </div>
    <div slot="right">
      <ImageTitleLinkColumn
       :title="item.title"
       :description="item.description"
       :logo="item.actor.logo"
       :url="item.actor.url"
       >
        <div slot="links">
         <a v-show="item.actor.leanpub_url" :href="item.actor.leanpub_url"
         target="_blank" class="align-octicon">
           Leanpub
          </a>
         <a v-show="item.actor.amazon_url" :href="item.actor.amazon_url"
         target="_blank" class="align-octicon">
           Amazon
          </a>
         <a v-show="item.actor.goodreads_url" :href="item.actor.goodreads_url"
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
  name: 'Volunteer',
  components: { Row, ImageTitleLinkColumn },
  props: ['item'],
};
</script>

<style scoped>
>>> img.logo {
  max-width: 400px;
}
</style>
