import { connect } from 'react-redux'
import moment from 'moment'
import { activityTypes, filters, sortActivities, availableLanguages, availableActors } from 'cv-lib/storage'
import { toggleActivity } from '../actions'
import ActivityList from '../components/ActivityList'
import { getActivityLanguagePieData, getActivityTimeChartData } from 'cv-lib/charts'
import { createSelector } from 'reselect'


const getActivities = (state) => state.activities;
const getSelectedLanguages = (state) => state.selectedLanguages;
const getSelectedActivityTypes = (state) => state.selectedActivityTypes;
const getSelectedFilters = (state) => state.selectedFilters;
const getFilters = (state) => state.filter;
const getActors = (state) => state.actors;

const getVisibleActivities = createSelector(
  [getActivities, getSelectedLanguages, getSelectedActivityTypes, getSelectedFilters, getFilters],
  (activities, selectedLanguages, selectedActivityTypes, selectedFilters, filter) => {
    let filteredActivities = activities;
    const selectedLanguageList = selectedLanguages.length ? selectedLanguages.split(',') : [];
    let selectedActivityTypeList = selectedActivityTypes.length ? selectedActivityTypes.split(',') : [];

    selectedActivityTypeList = selectedActivityTypeList.map(at => (
      activityTypes.find(vt => vt.name === at).component_name
    ));

    // only show selected activity types
    if (selectedActivityTypeList.length) {
      filteredActivities = filteredActivities.filter((i) => {
        return selectedActivityTypeList.includes(i.component);
      });
    }

    if (selectedLanguageList.length) {
      filteredActivities = filteredActivities.filter((item) => {
        if (!item.actor.languages) {
          return false;
        }
        return item.actor.languages.some(s => selectedLanguageList.find(z => z === s.name));
      });
    }

    selectedFilters.forEach((filterName) => {
      filteredActivities = filteredActivities.filter(filters[filterName]);
    });


    switch (filter) {
      case 'SHOW_ACTIVE':
        return filteredActivities.filter(t => !t.completed)
      case 'SHOW_ALL':
      default:
        return sortActivities(filteredActivities, moment);
    }
  }
)

const getReactSelectValues = (actors) => {
  /** (react-select only) Return available actors in format acceptable to react-select **/
  return actors.map((actor => ({ value: actor.name, label: actor.name })));
}

const getAvailableLanguages = createSelector(
  [ getVisibleActivities ],
  (activities) => availableLanguages(activities)
);
const getAvailableLanguagesReactSelectValues = createSelector(
  [ getAvailableLanguages ],
  (languages) => getReactSelectValues(languages)
);

const getAvailableActors = createSelector(
  [ getActors, getVisibleActivities ],
  (actors, activities) => availableActors(actors, activities)
);
const getAvailableActorsReactSelectValues = createSelector(
  [ getAvailableActors ],
  (actors) => getReactSelectValues(actors)
);

export const mapStateToProps = state => {
  return {
    activities: getVisibleActivities(state),
    activitiesPie: getActivityLanguagePieData(getVisibleActivities(state)),
    activitiesLine: getActivityTimeChartData((getVisibleActivities(state)), moment),
    actors: state.actors,
    actors_select: getReactSelectValues(state.actors),
    availableActors: getAvailableActors(state),
    availableActors_select: getAvailableActorsReactSelectValues(state),
    selectedActors: state.selectedActors,
    languages: state.languages,
    availableLanguages: getAvailableLanguages(state),
    availableLanguages_select: getAvailableLanguagesReactSelectValues(state),
    languages_select: getReactSelectValues(state.languages),
    selectedLanguages: state.selectedLanguages,
    activityTypes: state.activityTypes,
    activityTypes_select: getReactSelectValues(state.activityTypes),
    selectedActivityTypes: state.selectedActivityTypes,
    filters: state.filters,
    selectedFilters: state.selectedFilters,
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    onActivityClick: id => {
      dispatch(toggleActivity(id))
    },
    onSelectedActorChange: value => {
      dispatch({
        type: 'CHANGE_SELECTED_ACTORS',
        value: value
      });
    },
    onSelectedLanguageChange: value => {
      dispatch({
        type: 'CHANGE_SELECTED_LANGUAGES',
        value: value
      });
    },
    onSelectedLanguageAdd: value => {
      dispatch({
        type: 'ADD_SELECTED_LANGUAGE',
        value: value
      });
    },
    onSelectedActivityTypesChange: value => {
      dispatch({
        type: 'CHANGE_SELECTED_ACTIVITY_TYPES',
        value: value
      });
    },
    onSelectedFiltersChange: value => {
      dispatch({
        type: 'CHANGE_SELECTED_FILTERS',
        value: value
      });
    }
  }
}

export const VisibleActivityList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityList)

export default VisibleActivityList
