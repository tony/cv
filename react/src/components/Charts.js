import React from 'react'
import { connect } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import { mapStateToProps, mapDispatchToProps } from '../containers/ActivityList.js';


class Charts extends React.Component {
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

  render() {
    return (
      <div className="charts row padBottom">
        <div className="col-sm-2 col-sm-offset-2">
          <Pie data={this.props.activitiesPie} options={this.pieOptions} legend={this.pieOptions.legend} height='300'/>
        </div>
        <div className="col-sm-6">
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Charts);
