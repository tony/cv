<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>Subject</h3>

      <multiselect
        v-model="subjectChoices"
        :search="true"
        :multiple="true"
        :options="availableSubjectTypes">
      </multiselect>

    <h3>Verb</h3>
    <multiselect
      v-model="verbChoices"
      :search="true"
      :multiple="true"
      :options="availableVerbs">
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  components: { Multiselect },
  data() {
    return {
      subjectChoices: null,
      verbChoices: null,
      msg: 'Tony Narlock\'s CV',
    };
  },
  computed: mapGetters([
    'subjects',
    'availableSubjects',
    'availableSubjectTypes',
    'availableVerbs',
  ]),
  methods: {
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000)),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
  },
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
