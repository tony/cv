<template>
  <p v-show="created_date" class="align-octicon"><small>
    <octicon name="clock"></octicon>
    <template v-if="show_from">
      {{created_date | moment("from", "now") }}
    </template>
    <template v-if="date_format">
      ({{created_date | moment(date_format)}})
      <template v-if="end_date">-  {{end_date | moment(date_format)}}</template>
    </template>
    <template v-else>
      ({{created_date}})
    </template>
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
      default: true,
    },
  },
};
</script>
