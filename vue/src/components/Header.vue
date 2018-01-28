<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <p><em>Friendly reminder: I don't do technical screens. I only seek
      remote, senior programming roles.
      I'm also available for <a href="https://www.git-pull.com/consulting/">consulting</a> and
    <a href="https://www.git-pull.com/mentoring/">mentoring</a>.</em></p>

    <div class="row">
      <div class="col-xs-10 col-xs-offset-1">
        <multiselect
          v-model="subjectChoices"
          :search="true"
          :multiple="true"
          placeholder="Filter by project / company"
          label="name"
          :limit="3" @tag="onTagging"
          :options="subjects">
          <template slot="option" slot-scope="props">
          <span>{{ props.option.name }}</span>
          <span class="tag">
          {{props.option.type}}
          </span>
          </template>
        </multiselect>

        <multiselect
          v-model="verbChoices"
          :search="true"
          :multiple="true"
          placeholder="Filter by event"
          :options="availableVerbs"
         >
        </multiselect>
      </div>
    </div>
  <p />
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
      source: [],
      value: [],
    };
  },
  computed: mapGetters([
    'subjects',
    'availableSubjects',
    'availableSubjectTypes',
    'availableVerbs',
  ]),
  methods: {
    onTagging(newTag) {
      this.source.push({ name: newTag, language: newTag });
      this.value.push({ name: newTag, language: newTag });
    },
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

.tag {
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 3px;
  color: #4a4a4a;
  //display: inline-flex;
  font-size: .75rem;
  justify-content: center;
  line-height: 1.5;
  padding-top: 0.5em;
  margin-top: -0.5em;
  padding-bottom: 0.5em;
  margin-bottom: -0.5em;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
