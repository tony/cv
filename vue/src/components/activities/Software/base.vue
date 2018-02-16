<template>
  <Row :component_type="projectType" :item="item">
    <div slot="right">
      <ImageTitleLinkColumn
       :title="item.title"
       :description="item.description"
       :logo="item.actor.logo"
       :url="item.actor.url"
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
  components: {
    Row, ImageTitleLinkColumn, SoftwareProjectLinks, LanguageTag,
  },
  props: ['item', 'projectType'],
};
</script>

<style scoped>
>>> img.logo {
  width: 200px;
}
</style>
