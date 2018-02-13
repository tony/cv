import { connect } from 'react-redux'
import { toggleActivity } from '../actions'
import ActivityList from '../components/ActivityList'
import { activityTypes, filters } from 'cv-lib/storage'

const getVisibleActivities = (activities, filter, state) => {
  let filteredActivities = activities;
  const selectedLanguages = state.selectedLanguages.length ? state.selectedLanguages.split(',') : [];
  let selectedActivityTypes = state.selectedActivityTypes.length ? state.selectedActivityTypes.split(',') : [];
  const selectedFilters = state.selectedFilters;

  selectedActivityTypes = selectedActivityTypes.map(at => (
    activityTypes.find(vt => vt.name === at).component_name
  ));

  // only show selected activity types
  if (selectedActivityTypes.length) {
    filteredActivities = filteredActivities.filter((i) => {
      return selectedActivityTypes.includes(i.component);
    });
  }

  if (selectedLanguages.length) {
    filteredActivities = filteredActivities.filter((item) => {
      if (!item.actor.languages) {
        return false;
      }
      return item.actor.languages.some(s => selectedLanguages.find(z => z === s.name));
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
      return filteredActivities
  }
}

const getSelectValues = (actors) => {
  /** Return available actors in format acceptable to react-select **/
  return actors.map((actor => ({ value: actor.name, label: actor.name })));
}

export const mapStateToProps = state => {
  return {
    activities: getVisibleActivities(state.activities, state.visibilityFilter, state),
    actors: state.actors,
    actors_select: getSelectValues(state.actors),
    selectedActors: state.selectedActors,
    languages: state.languages,
    languages_select: getSelectValues(state.languages),
    selectedLanguages: state.selectedLanguages,
    activityTypes: state.activityTypes,
    activityTypes_select: getSelectValues(state.activityTypes),
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
