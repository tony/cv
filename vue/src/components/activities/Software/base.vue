<template>
  <Row>
    <div slot="left">
      <h2>{{projectType}}</h2>
      <div class="languages">
      <LanguageTag
      v-for="language in item.project.languages" :key="language.name" :index="language.name"
      v-bind:language="language"
      />
      </div>

      <br />
      <p v-show="item.created_date" class="align-octicon"><small>
        <octicon name="repo" label="Created"></octicon>
        Created {{item.created_date | moment("from", "now") }}
        ({{item.created_date}})
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
          <SoftwareProjectLinks :item="item" />
        </div>
      </ImageTitleLinkColumn>
    </div>
  </Row>
</template>


<script>
import Row from '../../partials/Row';
import ImageTitleLinkColumn from '../../partials/ImageTitleLinkColumn';
import SoftwareProjectLinks from './partials/Links';
import LanguageTag from '../../partials/LanguageTag';

export default {
  name: 'SoftwareProject',
  components: { Row, ImageTitleLinkColumn, SoftwareProjectLinks, LanguageTag },
  props: ['item', 'projectType'],
};
</script>

<style scoped>
>>> img.logo {
  width: 200px;
}
</style>
