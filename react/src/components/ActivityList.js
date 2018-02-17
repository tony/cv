import React from 'react';
import { activityProp, activityListProp } from '../props';
import { activityTypes } from 'cv-lib/storage';
import {
  LeftBox, RightBox, PatchRightBox, PublicationRightBox,
  ArticleRightBox, SoftwareRightBox
} from './boxes';

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

class Publication extends Activity {
  rightbox = <PublicationRightBox {...this.props}/>
}

class Article extends Activity {
  rightbox = <ArticleRightBox {...this.props}/>
}

class SoftwareLib extends Activity {
  rightbox = <SoftwareRightBox {...this.props} />
}
class SoftwareApp extends Activity {
  rightbox = <SoftwareRightBox {...this.props} />
}


const Components = {
  Patch: Patch,
  Article: Article,
  Work: Activity,
  SoftwareLib: SoftwareLib,
  SoftwareApp: SoftwareApp,
  Volunteer: Activity,
  Publication: Publication,
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
  static propTypes = activityListProp;
}

export default ActivityList
