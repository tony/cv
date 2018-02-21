import { connect } from 'react-redux'
import moment from 'moment'
import { sortActivities, selectLanguagesFromActors, denormalizeActivities, countLanguagesFromActivities } from 'cv-lib/storage'
import { activityTypes } from 'cv-lib/constants'
import { filterMap } from 'cv-lib/selectors';
import { toggleActivity } from '../actions'
import ActivityList from '../components/ActivityList'
import { getActivityLanguagePieData, getActivityTimeChartData } from 'cv-lib/charts'
import { createSelector } from 'reselect'


const getActivities = (state) => state.activities;
const getSelectedLanguages = (state) => state.selectedLanguages;
const getSelectedActivityTypes = (state) => state.selectedActivityTypes;
const getSelectedFilters = (state) => state.selectedFilters;
const getActors = (state) => state.actors;
const getLanguages = (state) => state.languages;
const getSelectedActors = (state) => state.selectedActors;

const getAvailableActivities = createSelector(
  [getActivities, getSelectedLanguages, getSelectedActivityTypes, getSelectedFilters, getActors, getLanguages],
  (activities, selectedLanguages, selectedActivityTypes, selectedFilters, actors, languages) => {
    let visibleActivities = denormalizeActivities(Object.values(activities), actors, languages);
    const selectedLanguageList = selectedLanguages.length ? selectedLanguages.split(',') : [];
    let selectedActivityTypeList = selectedActivityTypes.length ? selectedActivityTypes.split(',') : [];
    // we need to filter against the component_name of the activity, so get that data
    selectedActivityTypeList = selectedActivityTypeList.map(at => (
      activityTypes.find(vt => vt.name === at).component_name
    ));

    // only show selected activity types
    if (selectedActivityTypeList.length) {
      visibleActivities = visibleActivities.filter((i) => {
        return selectedActivityTypeList.includes(i.component_name);
      });
    }

    if (selectedLanguageList.length) {
      visibleActivities = visibleActivities.filter((item) => {
        if (!item.actor.languages) {
          return false;
        }
        return item.actor.languages.some(s => selectedLanguageList.find(z => z === s.name));
      });
    }

    selectedFilters.forEach((filterName) => {
      visibleActivities = visibleActivities.filter(filterMap[filterName]);
    });


    return sortActivities(visibleActivities, moment);
  }
)

const getVisibleActivities = createSelector(
  [getAvailableActivities, getSelectedActors, getActors, getLanguages],
  (activities, selectedActors, actors, languages) => {
    const selectedActorList = selectedActors.length ? selectedActors.split(',') : [];
    let visibleActivities = activities;

    // for direct lookups
    if (selectedActorList && selectedActorList.length) {
      return visibleActivities.filter(
        item => selectedActorList.find(s => s === item.actor.name),
      );
    }
    return sortActivities(visibleActivities, moment);
  }
)

const getReactSelectValues = (actors) => {
  /** (react-select only) Return available actors in format acceptable to react-select **/
  return Object.values(actors).map((actor => ({ value: actor.name, label: actor.name })));
}

const getAvailableLanguages = createSelector(
  [ getLanguages, getActors ],
  (languages, actors) => selectLanguagesFromActors(languages, Object.values(actors))
);

const getAvailableLanguagesReactSelectValues = createSelector(
  [ getAvailableLanguages ],
  (languages) => getReactSelectValues(languages)
);

const getAvailableActors = createSelector(
  [ getActors, getAvailableActivities ],
  (actors, activities) => {
    return Object.values(actors).filter(actor => (
      activities.find(activity => activity.actor.id === actor.id)
    ));
  }
);

const getAvailableActorsReactSelectValues = createSelector(
  [ getAvailableActors ],
  (actors) => getReactSelectValues(actors)
);

const getCountLanguagesFromActivities = createSelector(
  [ getVisibleActivities ],
  (activities) => countLanguagesFromActivities(activities)
);

export const mapStateToProps = state => {
  return {
    activities: getVisibleActivities(state),
    activitiesPie: getActivityLanguagePieData(getCountLanguagesFromActivities(state)),
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
