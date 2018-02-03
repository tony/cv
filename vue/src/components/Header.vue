<template>
  <div class="header">
    <h1>{{ msg }}</h1>

    <p><em>Friendly reminder:
      <a href="https://www.git-pull.com/blog/2018/01/technical-screening.html" target="_blank">I don't do technical screens</a>.
      I only seek remote, senior programming roles.
      I'm also available for <a href="https://www.git-pull.com/consulting/" target="_blank">consulting</a> and
    <a href="https://www.git-pull.com/mentoring/" target="_blank">mentoring</a>.</em></p>

    <div class="row">
      <div class="col-xs-10 col-xs-offset-1">
        <multiselect
          :search="true"
          :multiple="true"
          placeholder="Filter by Project(s), Company/Companies, Website(s), and Publication(s)"
          label="name"
          track-by="name"
          id="subjectFilter"
          :value="selectedSubjects"
          :options="availableSubjects"
          @input="updateSelectedSubjectsAction"
          >
          <template slot="option" slot-scope="props">
          <span>{{ props.option.name }}</span>
          <span class="tag">
          {{props.option.type}}
          </span>
          </template>
        </multiselect>

        <multiselect
          :search="true"
          :multiple="true"
          placeholder="Filter by Activity Type(s)"
          id="activityFilter"
          track-by="name"
          :options="availableActivityTypes"
          :value="selectedActivityTypes"
          @input="updateSelectedActivityTypeAction"
          label="name"
         >
        </multiselect>

        <multiselect
          :search="true"
          :multiple="true"
          placeholder="Filter by Programming Language(s)"
          id="languageFilter"
          :options="availableLanguages"
          :value="selectedLanguages"
          @input="updateSelectedLanguagesAction"
         >
        </multiselect>

        <div id='example-3'>
          <span v-for="fil in availableFilters" :key="fil.id" class="roundedOne">
            <input type="checkbox" :id="fil" :value="fil" v-model="selectedFilters" >
            <label :for="fil">{{fil}}</label>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'Header',
  components: { Multiselect },
  data() {
    return {
      msg: 'Tony Narlock\'s CV',
    };
  },
  computed: {
    ...mapGetters([
      'subjects',
      'availableSubjects',
      'availableSubjectTypes',
      'availableActivityTypes',
      'availableFilters',
      'availableLanguages',
    ]),
    ...{
      selectedFilters: {
        get() {
          return this.$store.state.selectedFilters;
        },
        set(value) {
          this.$store.commit('updateSelectedFilters', value);
        },
      },
    },
    ...mapState(['selectedActivityTypes', 'selectedSubjects', 'selectedLanguages']),
  },
  methods: {
    ...mapActions([
      'updateSelectedActivityTypeAction',
      'updateSelectedSubjectsAction',
      'updateSelectedFiltersAction',
      'updateSelectedLanguagesAction',
    ]),
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.header h1, .header h2 {
  font-weight: normal;
}
.header a {
  color: #42b983;
}

.header .tag {
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

.selectedFilters .multiselect__tag {
  background: gray;
  outline: none;
  color: white;
}
.selectedFilters .multiselect__tag-icon:hover {
  background: #666;
}
.selectedFilters .multiselect__tag-icon:after {
  color: #666;
}
.selectedFilters .multiselect__tag-icon:hover:after {
  color: white;
}
#example-3 {
  margin-top: .5rem;
}
.roundedOne {
  margin: 0 .5rem;
}
</style>
