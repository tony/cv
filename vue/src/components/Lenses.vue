<template>
  <div class="row"><div class="col-xs-10 col-xs-offset-1">
    <multiselect
      :search="true"
      :multiple="true"
      placeholder="Lookup by Place/Project/Company - e.g. tmuxp, Social Amp, The Tao of tmux"
      label="name"
      track-by="name"
      id="actorFilter"
      :value="selectedActors"
      :options="availableActors"
      @input="updateSelectedActorsAction"
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
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'Lenses',
  components: { Multiselect },
  computed: {
    ...mapGetters([
      'actors',
      'availableActors',
      'availableActorTypes',
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
    ...mapState(['selectedActivityTypes', 'selectedActors', 'selectedLanguages']),
  },
  methods: {
    ...mapActions([
      'updateSelectedActivityTypeAction',
      'updateSelectedActorsAction',
      'updateSelectedFiltersAction',
      'updateSelectedLanguagesAction',
    ]),
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.roundedOne {
  margin: .5em 0 0 0;
}
@media (min-width: 500px) {
  .choices {
    margin-top: .5em;
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
</style>
