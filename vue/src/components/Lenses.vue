<template>
  <div class="row lenses"><div class="col-xs-10 col-xs-offset-1">
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
      track-by="component_name"
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
      <div v-for="fil in filters" :key="fil.id" class="roundedOne col-sm">
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
      'availableActivityTypes',
      'availableLanguages',
    ]),
    ...mapState([
      'filters',
      'selectedActivityTypes',
      'selectedActors',
      'selectedLanguages',
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
