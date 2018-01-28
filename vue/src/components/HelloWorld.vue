<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>Subject</h3>
    <span
      v-for="subject in availableSubjects"
      :key="subject.id"
      >
      {{subject}}:
      <span
        v-for="item in subjects"
        v-if="item.subject == subject"
        :key="item.id"
        >
        {{item.name}}
      </span>
    </span>

    <h3>Verb</h3>
    <span
      v-for="verb in availableVerbs"
      :key="verb.id"
      >
      {{verb}}
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
    'subjects', 'availableSubjects', 'availableVerbs',
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
