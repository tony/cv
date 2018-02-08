import React from 'react'
import PropTypes from 'prop-types'


class Row extends React.Component {
  render () {
    return (
      <div class="row">
        <div class="col-md-10 col-md-offset-1 col-xs-12">
        <div class="box">
        <div class="row">
          <div class="col-md-4 col-xs-12 item"><div class="box">
          1
          </div></div>
          <div class="col-md-8 col-xs-12 item"><div class="box">
          2
          </div></div>
        </div>
        </div>
        </div>
      </div>
    )
  }
}


class Activity extends React.Component {
  render () {
    const { onClick, accepted_date, title, created_date, id } = this.props;
    return (
      <li
        onClick={onClick}
        style={ {
          textDecoration: accepted_date ? 'line-through' : 'none'
        }}
      >
        {title} {created_date} id: {id}
        <Row/>
      </li>
    )
  }

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    accepted_date: PropTypes.string,
    created_date: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  }
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
