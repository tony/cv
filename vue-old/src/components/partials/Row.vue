<template>
  <div class="row">
    <div class="col-md-10 col-md-offset-1 col-xs-12">
    <div class="box">
    <div class="row">
      <div class="col-md-4 col-xs-12 item"><div class="box">
      <h2>{{component_type}}</h2>
      <slot name="left">
        <slot name="date">
        <Date
          :created_date="created_date"
          :end_date="end_date"
          :date_format="date_format"
          :is_current="is_current"
          :show_from="show_from"
          />
        </slot>

        <slot name="languages">
          <div class="languages hide-sm">
            <LanguageTag
               v-for="language in languages"
               :key="language.name"
               :index="language.name"
               :language="language"
               />
          </div>
        </slot>
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
  props: {
    component_type: {
      type: String,
      required: true,
    },
    created_date: {
      type: String,
      required: true,
    },
    end_date: String,
    languages: {
      type: Array,
      default: () => ([]),
    },
    date_format: {
      default: null,
    },
    is_current: {
      type: Boolean,
      default: false,
    },
    show_from: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
