<template>
  <p v-show="created_date" class="align-octicon"><small>
    <octicon name="clock" label="Submitted"></octicon>
    {{created_date | moment("from", "now") }}
    ({{created_date}})
  </small></p>
</template>

<script>
export default {
  name: 'Date',
  props: ['created_date', 'end_date'],
};
</script>
