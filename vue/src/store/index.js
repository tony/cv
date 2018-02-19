/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import Vuex from 'vuex';
import { availableActivityTypes, availableActorIds, availableLanguageIds, filterMap, selectActivityIds, selectVisibleActivities, sortActivities, activityTypes, countLanguagesFromActivities, denormalizeActivities } from 'cv-lib/storage';
import { LOAD_INITIAL_DATA } from './mutation-types';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    count: 0,
    activities: null,
    actors: null,
    activityIds: [],
    selectedActivityTypes: [],
    selectedActors: null,
    selectedFilters: null,
    selectedLanguages: [],
    languages: [],
    filters: Object.keys(filterMap),
  },
  getters: {
    availableLanguageIds: (state, getters) => (
      availableLanguageIds(state.languages, getters.availableActors)
    ),
    availableLanguages: (state, getters) => (
      getters.availableLanguageIds.map(i => state.languages[i])
    ),
    filteredActivityIds: state => selectActivityIds(
      state.activityIds, state.activities, state.selectedActivityTypes,
      state.selectedFilters,
    ),
    filteredActivities: (state, getters) => (
      getters.filteredActivityIds.map(i => state.activities[i])
    ),
    visibleActivities: (state, getters) => selectVisibleActivities(
      state.selectedLanguages, state.selectedActors,
      denormalizeActivities(getters.filteredActivities, state.actors, state.languages),
      state.languages, state.actors,
    ),
    visibleLanguageIds: (state, getters) => (
      availableLanguageIds(getters.visibleActivities, state.languages, getters.availableActors)
    ),
    visibleLanguages: (state, getters) => (
      getters.visibleLanguageIds.map(i => state.languages[i])
    ),
    countLanguagesFromVisibleActivities: (state, getters) => (
      countLanguagesFromActivities(getters.visibleActivities, state.languages, state.actors)
    ),
    sortedActivities: (state, getters) => (
      sortActivities(getters.visibleActivities, Vue.moment)
    ),
    availableActorIds: (state, getters) => (
      availableActorIds(state.actors, getters.filteredActivities)
    ),
    availableActors: (state, getters) => (
      getters.availableActorIds.map(i => state.actors[parseInt(i, 10)])
    ),
    availableActivityTypes: state => (
      availableActivityTypes(state.activities, activityTypes)
    ),
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
      state.languages = data.languages;
      state.activityTypes = data.activityTypes;
      state.selectedFilters = data.selectedFilters;
      state.activityIds = data.activityIds;
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
