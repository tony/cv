import { connect } from 'react-redux'
import { toggleActivity } from '../actions'
import ActivityList from '../components/ActivityList'
import ActorFilter from '../components/ActorFilter'

const getVisibleActivities = (activities, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return activities.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return activities.filter(t => !t.completed)
    case 'SHOW_ALL':
    default:
      return activities
  }
}

const getSelectValues = (actors) => {
  /** Return available actors in format acceptable to react-select **/
  return actors.map((actor => ({ value: actor.name, label: actor.name })));
}


const mapStateToProps = state => {
  return {
    activities: getVisibleActivities(state.activities, state.visibilityFilter),
    actors: state.actors,
    actors_select: getSelectValues(state.actors),
    selectedActors: state.selectedActors,
    languages: state.languages,
    languages_select: getSelectValues(state.languages),
    selectedLanguages: state.selectedLanguages,
  }
}

const mapDispatchToProps = dispatch => {
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
    }
  }
}

export const VisibleActivityList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityList)

export const VisibleActorFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActorFilter)

export default VisibleActivityList
