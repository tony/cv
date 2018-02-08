import React from 'react'
import PropTypes from 'prop-types'

const Activity = ({ onClick, completed, title }) => (
  <li
    onClick={onClick}
    style={ {
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {title}
  </li>
)

Activity.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired
}

const ActivityList = ({ activities, onActivityClick }) => (
  <ul>
    {activities.map(activity => (
      <Activity key={activity.id} {...activity} onClick={() => onActivityClick(activity.id)} />
    ))}
  </ul>
)

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      component: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      actor: PropTypes.object.isRequired,
      created_date: PropTypes.string.isRequired,
      accepted_date: PropTypes.string,
      end_date: PropTypes.string
    }).isRequired
  ).isRequired,
  onActivityClick: PropTypes.func.isRequired
}

export default ActivityList
