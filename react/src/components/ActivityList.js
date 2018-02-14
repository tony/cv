import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment';
import Octicon from 'react-octicon'
import { activityTypes } from 'cv-lib/storage';

class LeftBox extends React.Component {
  render() {
    return (
      <div className="box">
        <h2>{this.props.activityType}</h2>
        <p className="align-octicon">
          <small>
            <Octicon name="repo"/>
            Submitted
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


class PatchRightBox extends RightBox {
  render() {
    return (
      <div className="box">
        <h3 className="align-octicon-bottom"><a href={this.props.qa_url} target="_blank" className="activity-title">
          <Octicon name="mark-github" label="View on GitHub"></Octicon> {this.props.title}
        </a></h3>
        <p>
          <em>was contributed to the <a href={this.props.actor.url} className='muted-link'>{this.props.actor.name}</a> project</em>
        </p>

        <p><small>
          <a href={this.props.actor.repo_url} target="_blank" className="muted-link align-octicon">
            <Octicon name="repo" label="GH"></Octicon>
            Repository </a>

          { this.props.in_re_url && this.props.in_re_url.length > 0 &&
              <span>
                <a href={this.props.in_re_url} target="_blank">issue</a>
              </span>
          }

          <span>
            <a href={this.props.qa_url} target="_blank" className="muted-link align-octicon">
              <Octicon name="git-pull-request" label="Pull Request"></Octicon>
              Pull Request
            </a>
          </span>

          <span> <a href={this.props.diff_url} target="_blank" className="muted-link align-octicon">
            <Octicon name="diff" label="Diff"></Octicon>
            .diff File
          </a></span>
        </small></p>

        <p><small>
          { this.props.accepted_date ? (
              <span className="align-octicon">
              <Octicon name="check" label="Merged"></Octicon>
              Accepted {this.props.accepted_date}
              </span>
            ) : (
              <em>Unmerged</em>
            )
          }
        </small></p>
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
  leftbox = <LeftBox {...this.props}/>
  rightbox = <RightBox {...this.props}/>
  render () {
    return (
      <Row
        leftbox={this.leftbox}
        rightbox={this.rightbox}
      />
    )
  }

  static propTypes = activityProp
}


class Patch extends Activity {
  rightbox = <PatchRightBox {...this.props}/>
}


const Components = {
  Patch: Patch,
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
    const { activities } = this.props;
    const items = activities.map(function(item) {
      const component = Components[item['component']];
      return React.createElement(component, {
        ...{
          key: item['id'],
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
  }
}

export default ActivityList
