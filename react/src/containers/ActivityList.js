import { connect } from 'react-redux'
import { toggleActivity } from '../actions'
import ActivityList from '../components/ActivityList'

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

const mapStateToProps = state => {
  return {
    activities: getVisibleActivities(state.activities, state.visibilityFilter)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onActivityClick: id => {
      dispatch(toggleActivity(id))
    }
  }
}

const VisibleActivityList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityList)

export default VisibleActivityList
