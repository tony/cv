import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment';


class Row extends React.Component {
  render () {
    return (
      <div className="row">
        <div className="col-md-10 col-md-offset-1 col-xs-12">
        <div className="box">
        <div className="row">
          <div className="col-md-4 col-xs-12 item"><div className="box">
            {this.props.left.component}<br />
            {this.props.left.created_date}<br />
            <span> (<Moment fromNow>{this.props.left.created_date}</Moment>)</span>
          </div></div>
          <div className="col-md-8 col-xs-12 item"><div className="box">
            {this.props.right.title}<br />
            {this.props.left.actor.name}
          </div></div>
        </div>
        </div>
        </div>
      </div>
    )
  }
}

const activityProp = {
  id: PropTypes.number.isRequired,
  component: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actor: PropTypes.object.isRequired,
  created_date: PropTypes.string.isRequired,
  accepted_date: PropTypes.string,
  end_date: PropTypes.string
};


class Activity extends React.Component {
  render () {
    const { accepted_date, onClick } = this.props;
    return (
      <Row left={this.props} right={this.props} onClick={onClick}  style={ {
        textDecoration: accepted_date ? 'line-through' : 'none'
      } }/>
    )
  }

  static propTypes = {
    ...activityProp,
    ...{
      onClick: PropTypes.func.isRequired,
    }
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
      PropTypes.shape(activityProp).isRequired
    ).isRequired,
    onActivityClick: PropTypes.func.isRequired
  }
}

export default ActivityList
