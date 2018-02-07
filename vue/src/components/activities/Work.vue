<template>
  <Row>
    <div slot="left"> <h2>Work</h2>
      <div class="languages">
      <LanguageTag
      v-for="language in item.project.languages" :key="language.name" :index="language.name"
      v-bind:language="language"
      />
      </div>

      <br />
      <p v-show="item.created_date" class="align-octicon"><small>
        {{item.created_date | moment("YYYY")}} -
        <template v-if="item.end_date">{{item.end_date | moment("YYYY")}}</template>
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
