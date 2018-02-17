/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import Vuex from 'vuex';
import { availableActivityTypes, availableActors, availableLanguages, filters, selectActivities, selectActivitiesFinal, sortActivities } from 'cv-lib/storage';
import { LOAD_INITIAL_DATA } from './mutation-types';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    count: 0,
    activities: null,
    actors: null,
    selectedActivityTypes: [],
    selectedActors: null,
    selectedFilters: null,
    selectedLanguages: [],
  },
  getters: {
    availableLanguages: (state, getters) => availableLanguages(getters.filteredActivities),
    filteredActivities: state => selectActivities(
      state.activities, state.selectedActivityTypes,
      state.selectedFilters,
    ),
    filteredActivitiesFinal: (state, getters) => selectActivitiesFinal(
      state.selectedLanguages, state.selectedActors,
      getters.filteredActivities,
    ),
    sortedActivities: (state, getters) => (
      sortActivities(getters.filteredActivitiesFinal, Vue.moment)
    ),
    actors: state => state.actors, // actor items
    availableActorTypes: state => [
      ...new Set(state.actors.map(item => item)),
    ],
    availableActors: (state, getters) => availableActors(state.actors, getters.filteredActivities),
    availableActivityTypes: state => availableActivityTypes(state.activities),
    availableFilters: () => Object.keys(filters),
  },
  actions: {
    updateSelectedActivityTypeAction({ commit }, value) {
      commit('updateSelectedActivityType', value);
    },
    updateSelectedActorsAction({ commit }, value) {
      commit('updateSelectedActors', value);
    },
    updateSelectedFiltersAction({ commit }, value) {
      commit('updateSelectedFilters', value);
    },
    updateSelectedLanguagesAction({ commit }, value) {
      commit('updateSelectedLanguages', value);
    },
  },
  mutations: {
    [LOAD_INITIAL_DATA]: (state, data) => {
      state.activities = data.activities;
      state.actors = data.actors;
      state.selectedFilters = data.selectedFilters;
    },
    updateSelectedActivityType(state, value) {
      state.selectedActivityTypes = value;
    },
    updateSelectedActors(state, value) {
      state.selectedActors = value;
    },
    updateSelectedFilters(state, value) {
      state.selectedFilters = value;
    },
    updateSelectedLanguages(state, value) {
      state.selectedLanguages = value;
    },
  },
});

export default store;
