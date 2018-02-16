<template>
  <Row
  :component_type="'Work'"
  :created_date="item.created_date"
  :end_date="item.end_date"
  :date_format="'YYYY'"
  :show_from="false"
  :languages="item.actor.languages"
  >
    <div slot="right">
      <ImageTitleLinkColumn
       :title="item.title"
       :description="item.description"
       :logo="item.actor.logo"
       :url="item.actor.url"
       >
        <div slot="links">
         <a v-show="item.actor.url" :href="item.actor.url"
         target="_blank" class="align-octicon">
          <octicon name="home"></octicon> Website
          </a>
        </div>
      </ImageTitleLinkColumn>
     </div>
  </Row>
</template>


<script>
import Row from '../partials/Row';
import ImageTitleLinkColumn from '../partials/ImageTitleLinkColumn';
import LanguageTag from '../partials/LanguageTag';

export default {
  name: 'Work',
  components: { Row, ImageTitleLinkColumn, LanguageTag },
  props: ['item'],
};
</script>

<style scoped>
>>> img.logo {
  max-width: 400px;
}
</style>
