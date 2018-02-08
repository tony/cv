import React from 'react'
import PropTypes from 'prop-types'

const Activity = ({ onClick, accepted_date, title, created_date, id }) => (
  <li
    onClick={onClick}
    style={ {
      textDecoration: accepted_date ? 'line-through' : 'none'
    }}
  >
    {title} {created_date} id: {id}
  </li>
)

Activity.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  accepted_date: PropTypes.string,
  created_date: PropTypes.string.isRequired,
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
      description: PropTypes.string,
      actor: PropTypes.object.isRequired,
      created_date: PropTypes.string.isRequired,
      accepted_date: PropTypes.string,
      end_date: PropTypes.string
    }).isRequired
  ).isRequired,
  onActivityClick: PropTypes.func.isRequired
}

export default ActivityList
