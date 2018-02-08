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

const Components = {
  Patch: Activity,
  Article: Activity,
  Work: Activity,
  SoftwareLib: Activity,
  SoftwareApp: Activity,
  Volunteer: Activity,
  Publication: Activity,
  Website: Activity,
};


class ActivityList extends React.Component {
  render() {
    const { activities, onActivityClick } = this.props;
    const items = activities.map(function(itemData) {
      const component = Components[itemData['component']];
      return React.createElement(component, {
        ...{
          key: itemData['id'],
          onClick: () => onActivityClick(itemData.id),
        },
        ...itemData,
      });
    });

    return (
      <div className="list">
      <div>And I am an ItemList</div>
      <div>{items}</div>
      </div>
    );
  }
  static propTypes = {
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
}

export default ActivityList
