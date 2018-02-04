<template>
  <Row>
    <div slot="left">
      <h2>{{projectType}}</h2>
      <div class="languages">
      <span class="tag" v-for="language in item.project.languages" :key="language.id">
      {{language}}
      </span>
      </div>

      <br />
      <p v-show="item.created_date" class="align-octicon"><small>
        <octicon name="repo" label="Created"></octicon>
        Created {{item.created_date | moment("from", "now") }}
        ({{item.created_date}})
      </small></p>
    </div>
    <div slot="right">
      <ImageTitleLinkColumn :item="item">
        <div slot="links">
          <SoftwareProjectLinks :item="item" />
        </div>
      </ImageTitleLinkColumn>
    </div>
  </Row>
</template>


<script>
import Row from '../Row';
import ImageTitleLinkColumn from '../ImageTitleLinkColumn';
import SoftwareProjectLinks from '../SoftwareProjectLinks';

export default {
  name: 'SoftwareProject',
  components: { Row, ImageTitleLinkColumn, SoftwareProjectLinks },
  props: ['item', 'projectType'],
};
</script>

<style scoped>
img.logo {
  width: 200px;
}
</style>
