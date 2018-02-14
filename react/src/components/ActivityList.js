import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment';
import { activityTypes } from 'cv-lib/storage';

class LeftBox extends React.Component {
  render() {
    return (
      <div className="box">
        <h2>{this.props.activityType}</h2>
        <p>
        <small>Submitted
          <span> <Moment fromNow>{this.props.created_date}</Moment> </span>
           ({this.props.created_date})
        </small>
        </p>
        {this.props.actor.languages ? (
          this.props.actor.languages.map((language, i) =>
            <span
              className="tag language-tag"
              key={i}
              style={ language.color ? {
                backgroundColor: language.color
              }: {}}
            >{language.name}</span>
          )
        ) : null }
      </div>
    )
  }
}

class RightBox extends React.Component {
  render() {
    return (
      <div className="box">
        <h3><a href={this.props.qa_url} target="_blank" className="activity-title">{this.props.title}</a></h3>
        <p>
          <em>was contributed to the <a href={this.props.actor.url} className='muted-link'>{this.props.actor.name}</a> project</em>
        </p>
      </div>
    )
  }
}



class Row extends React.Component {
  render () {
    return (
      <div className="row">
        <div className="col-md-10 col-md-offset-1 col-xs-12">
        <div className="box">
        <div className="row">
          <div className="col-md-4 col-xs-12 item">
            {this.props.leftbox}
          </div>
          <div className="col-md-8 col-xs-12 item">
            {this.props.rightbox}
          </div>
        </div>
        </div>
        </div>
      </div>
    )
  }
}

const languageProp = {
  color: PropTypes.string,
  name: PropTypes.string.isRequired,
};

const actorProp = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  repo_url: PropTypes.string,
  type: PropTypes.string.isRequired,
  url: PropTypes.string,
  languages: PropTypes.arrayOf(
    PropTypes.shape(languageProp).isRequired
  ),
};

const activityProp = {
  id: PropTypes.number.isRequired,
  component: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actor: PropTypes.shape(actorProp).isRequired,
  created_date: PropTypes.string.isRequired,
  accepted_date: PropTypes.string,
  end_date: PropTypes.string
};


class Activity extends React.Component {
  render () {
    const { accepted_date, onClick } = this.props;
    return (
      <Row
        leftbox={<LeftBox {...this.props}/>}
        rightbox={<RightBox {...this.props}/>}
        onClick={onClick} style={ {
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
    const items = activities.map(function(item) {
      const component = Components[item['component']];
      return React.createElement(component, {
        ...{
          key: item['id'],
          onClick: () => onActivityClick(item.id),
          activityType: activityTypes.find(a => item.component === a.component_name).singular_name,
        },
        ...item,
      });
    });

    return (
      <div className="list">
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
