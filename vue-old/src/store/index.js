/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import Vuex from 'vuex';
import {
  selectActorsFromActivities,
  selectLanguagesFromActors,
  selectActivities,
  selectVisibleActivities,
  sortActivities,
  countLanguagesFromActivities,
  denormalizeActivities,
} from 'cv-lib/storage';
import { activityTypes } from 'cv-lib/constants';
import { filterMap, availableActivityTypes } from 'cv-lib/selectors';
import { LOAD_INITIAL_DATA } from './mutation-types';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    count: 0,
    activities: null,
    actors: null,
    selectedActivityTypes: [],
    selectedActors: [],
    selectedFilters: [],
    selectedLanguages: [],
    languages: [],
    filters: Object.keys(filterMap),
  },
  getters: {

    availableLanguages: (state, getters) => (
      selectLanguagesFromActors(
        state.languages,
        getters.availableActors,
      )
    ),
    availableActivities: state => selectActivities(
      state.activities, state.selectedActivityTypes,
      state.selectedFilters,
    ),
    visibleActivities: (state, getters) => selectVisibleActivities(
      state.selectedLanguages, state.selectedActors,
      denormalizeActivities(getters.availableActivities, state.actors, state.languages),
    ),
    countLanguagesFromVisibleActivities: (state, getters) => (
      countLanguagesFromActivities(getters.visibleActivities, state.languages, state.actors)
    ),
    sortedActivities: (state, getters) => (
      sortActivities(getters.visibleActivities, Vue.moment)
    ),
    availableActors: (state, getters) => (
      selectActorsFromActivities(state.actors, getters.availableActivities)
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
