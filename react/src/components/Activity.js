import React from 'react';
import { activityProp } from '../props';
import {
  LeftBox, RightBox, PatchRightBox, PublicationRightBox,
  ArticleRightBox, SoftwareRightBox
} from './Boxes';


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


export const Components = {
  Patch: Patch,
  Article: Article,
  Work: Activity,
  SoftwareLib: SoftwareLib,
  SoftwareApp: SoftwareApp,
  Volunteer: Activity,
  Publication: Publication,
  Website: Activity,
};
