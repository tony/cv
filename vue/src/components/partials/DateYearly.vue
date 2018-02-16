<template>
  <p v-show="created_date" class="align-octicon"><small>
    <octicon name="clock"></octicon>
    {{created_date | moment("YYYY")}}
    <template v-if="end_date">-  {{end_date | moment("YYYY")}}</template>
  </small></p>
</template>

<script>
export default {
  name: 'DateYearly',
  props: ['created_date', 'end_date'],
};
</script>
