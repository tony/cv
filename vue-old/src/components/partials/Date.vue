<template>
  <p v-show="created_date" class="align-octicon"><small>
    <octicon name="clock"></octicon>
    <template v-if="show_from">
      {{created_date | moment("from", "now") }}
    </template>
    <template v-if="date_format">
      <template v-if="show_from">
        (</template>{{created_date | moment(date_format)}}<template v-if="show_from">)</template>
      <template v-if="end_date">-  {{end_date | moment(date_format)}}</template>
    </template>
    <template v-else>
      ({{created_date}})
    </template>

    <template v-if="is_current"> - </template>
  </small></p>
</template>

<script>
export default {
  name: 'Date',
  props: {
    created_date: String,
    end_date: String,
    date_format: {
      default: null,
    },
    show_from: {
      type: Boolean,
      default: true,
    },
    is_current: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
