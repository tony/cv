import React from 'react';
import { activityListProp } from '../props';
import { activityTypes } from 'cv-lib/constants';
import { Components } from './Activity';

class ActivityList extends React.Component {
  render() {
    const { activities } = this.props;
    const items = activities.map(function(item) {
      const component = Components[item.component_name];
      return React.createElement(component, {
        ...{
          key: item['id'],
          activityType: activityTypes.find(a => item.component_name === a.component_name).singular_name,
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
