<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    Projects: <span
      v-for="subject in subjects"
      v-if="subject.subject == 'project'"
      :key="subject.id"
      >
    {{subject.name}}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Tony Narlock\'s CV',
    };
  },
  computed: mapGetters([
    'subjects',
  ]),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
