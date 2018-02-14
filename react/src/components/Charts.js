/* eslint no-underscore-dangle: 0 import/no-extraneous-dependencies: 0 */
import React from 'react'
import { connect } from 'react-redux';
import { Line, Pie } from 'react-chartjs-2';
import { mapStateToProps, mapDispatchToProps } from '../containers/ActivityList.js';
import { pieOptions, timeLineOptions } from 'cv-lib/charts';

class LanguagePie extends React.Component {
  handleOnClick = (i, proxy) => {
    if (i && i.length) {
      const language = i[0]._model.label;
      this.props.onSelectedLanguageAdd(language);
    }
  }

  render() {
    return (
      <Pie
        data={this.props.activitiesPie}
        options={pieOptions}
        legend={pieOptions.legend}
        height={300}
        onElementsClick={this.handleOnClick}
      />
    )
  }
}


class ActivityLine extends React.Component {

  render() {
    return (
      <Line
      data={this.props.activitiesLine}
      options={timeLineOptions}
      legend={timeLineOptions.legend}
      height={300}
      />
    )
  }
}


class Charts extends React.Component {

  render() {
    return (
      <div className="charts row padBottom">
        <div className="col-sm-2 col-sm-offset-2">
          <LanguagePie
            activitiesPie={this.props.activitiesPie}
            onSelectedLanguageAdd={this.props.onSelectedLanguageAdd}
            selectedLanguages={this.props.selectedLanguages}
          />
        </div>
        <div className="col-sm-6">
          <ActivityLine activitiesLine={this.props.activitiesLine} />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Charts);
