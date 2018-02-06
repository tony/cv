<template>
  <div class="header">
    <h1>{{ msg }}</h1>

    <p><em>Friendly reminder:
      I don't do technical screens<a href="https://www.git-pull.com/blog/2018/01/technical-screening.html" target="_blank" class="hidden footnote">[1]</a>.
      Seeking remote, senior programming roles.
      I'm also available for <a href="https://www.git-pull.com/consulting/" target="_blank">consulting</a> and
    <a href="https://www.git-pull.com/mentoring/" target="_blank">mentoring</a>.</em></p>

    <div class="row"><div class="col-xs-10 col-xs-offset-1">
      <multiselect
        :search="true"
        :multiple="true"
        placeholder="Lookup by Place/Project/Company - e.g. tmuxp, Social Amp, The Tao of tmux"
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
        placeholder="Filter by Activity Type(s) - e.g. Work, Open Source, Website, Volunteering"
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
        placeholder="Filter by Programming Language(s) - e.g. Python, JavaScript, C++"
        id="languageFilter"
        :options="availableLanguages"
        :value="selectedLanguages"
        track-by="name"
        label="name"
        @input="updateSelectedLanguagesAction"
       >
      </multiselect>

      <div class="row choices">
        <div v-for="fil in availableFilters" :key="fil.id" class="roundedOne col-sm">
          <div class="box">
            <input type="checkbox" :id="fil" :value="fil" v-model="selectedFilters" >
            <label :for="fil">{{fil}}</label>
          </div>
        </div>
      </div>
    </div></div>

  <language-pie
    :chart-data="languages"
    :height="250"
    ></language-pie>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapGetters, mapActions, mapState } from 'vuex';
import LanguagePie from './charts/LanguagePie';

export default {
  name: 'Header',
  components: { Multiselect, LanguagePie },
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
      'filteredActivitiesMinusProjects',
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
    ...{
      languages() {
        // https://github.com/airbnb/javascript/issues/719
        let l = this.filteredActivitiesMinusProjects.reduce((languages, activity) => {
          const rLanguages = languages;
          if (activity.project.languages.length) {
            activity.project.languages.forEach((lang) => {
              if (lang.name in rLanguages) {
                rLanguages[lang.name].count += 1;
              } else {
                rLanguages[lang.name] = {
                  count: 1,
                  color: lang.color,
                  name: lang.name,
                };
              }
            });
          }
          return rLanguages;
        }, {});

        // flatten
        l = Object.keys(l).map(key => l[key]);
        return {
          labels: l.map(lang => lang.name),
          datasets: [{
            backgroundColor: l.map(lang => lang.color),
            data: l.map(lang => lang.count),
          }],
        };
      },
    },
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
@media (min-width: 500px) {
  .choices {
    margin-top: .5em;
  }
  .roundedOne {
    margin: .5em 0 0 0;
  }

}
@media (max-width: 499px) {
  .choices {
    margin-top: .5rem;
  }
  h3, h2, p {
    margin: 0;
  }
  h2 {
    padding-top: 2em;
    padding-bottom: .25em;
  }
  .hide-sm {
    display: none;
  }
}

.footnote {
  text-decoration: none;
  font-size: .7em;
  vertical-align: top;
  border-bottom: 1px dotted #004b6b;
}
.hidden {
  display: none;
}
</style>
