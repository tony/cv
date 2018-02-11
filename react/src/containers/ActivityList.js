import { connect } from 'react-redux'
import { toggleActivity } from '../actions'
import ActivityList from '../components/ActivityList'
import ProjectFilter from '../components/ProjectFilter'

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
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onActivityClick: id => {
      dispatch(toggleActivity(id))
    }
  }
}

export const VisibleActivityList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityList)

export const VisibleProjectFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectFilter)

export default VisibleActivityList
