<template>
  <div class="row">
    <div class="col-md-10 col-md-offset-1 col-xs-12">
    <div class="box">
    <div class="row">
      <div class="col-md-4 col-xs-12 item"><div class="box">
      <h2>{{component_type}}</h2>
      <slot name="left">
        <Date
          :created_date="item.created_date"
          :end_date="item.end_date" />

        <div class="languages hide-sm">
          <LanguageTag
             v-for="language in item.actor.languages"
             :key="language.name"
             :index="language.name"
             :language="language"
             />
        </div>
      </slot>
      </div></div>
      <div class="col-md-8 col-xs-12 item"><div class="box">
        <slot name="right"></slot>
      </div></div>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
import Date from '../partials/Date';
import LanguageTag from '../partials/LanguageTag';

export default {
  name: 'Row',
  components: { LanguageTag, Date },
  props: ['component_type', 'item'],
};
</script>
