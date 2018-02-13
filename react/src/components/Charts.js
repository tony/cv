import React from 'react'
import { connect } from 'react-redux';
import { Line, Pie } from 'react-chartjs-2';
import { mapStateToProps, mapDispatchToProps } from '../containers/ActivityList.js';


class LanguagePie extends React.Component {
  pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Programming Languages',
      position: 'top',
      fontColor: '#4a4a4a',
      fontSize: '14',
      fontFamily: "'Avenir', Helvetica, Arial, sans-serif",
    },
    legend: {
      display: false,
    },
  }

  handleOnClick = (i, proxy) => {
    if (i && i.length) {
      let languages = '';
      const language = i[0]._model.label;

      if (this.props.selectedLanguages.indexOf(language) > -1) {
        languages = this.props.selectedLanguages;
      } else if (this.props.selectedLanguages.length) {
        languages = this.props.selectedLanguages + ',' + language;
      } else {
        languages = language;
      }

      this.props.onSelectedLanguageChange(languages);
    }
  }

  render() {
    return (
      <Pie
        data={this.props.activitiesPie}
        options={this.pieOptions}
        legend={this.pieOptions.legend}
        height={300}
        onElementsClick={this.handleOnClick}
      />
    )
  }
}


class ActivityLine extends React.Component {
  lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Time',
      position: 'top',
      fontColor: '#4a4a4a',
      fontSize: '14',
      fontFamily: "'Avenir', Helvetica, Arial, sans-serif",
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
        gridLines: {
          display: true,
        },
      }],
    },
    legend: {
      display: false,
    },
  }

  render() {
    return (
      <Line data={this.props.activitiesLine} options={this.lineOptions} legend={this.lineOptions.legend} height={300} />
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
            onSelectedLanguageChange={this.props.onSelectedLanguageChange}
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
