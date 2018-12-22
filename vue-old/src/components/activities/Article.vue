<template>
  <Row
  :component_type="'Article'"
  :created_date="item.created_date"
  >
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
        :key="title" target="_blank">
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
