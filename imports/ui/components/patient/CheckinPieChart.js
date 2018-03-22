import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment'

import { Pie } from 'react-chartjs-2';

export default class CheckinPieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      chartOptions: {
        animation: {
          animateRotate: props.animate
        },
        legend: {
          display: props.showLegend
        }
      }
    }
  }

  componentDidMount() {
    this.setState({
      chartData: {
        labels: ['yes', 'no'],
        datasets: [{
          data: [this.props.daysCheckedIn, this.props.daysNotCheckedIn],
          backgroundColor: ['#66bb6a', '#ef5350']
        }]
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.daysCheckedIn !== this.props.daysCheckedIn || prevProps.daysNotCheckedIn !== this.props.daysNotCheckedIn) {
      this.setState({
        chartData: {
          labels: ['yes', 'no'],
          datasets: [{
            data: [this.props.daysCheckedIn, this.props.daysNotCheckedIn],
            backgroundColor: ['#66bb6a', '#ef5350']
          }]
        }
      })
    }
  }

  render() {
    return (
      <div className="">
        <Pie
          data={this.state.chartData}
          options={this.state.chartOptions}
          height={this.props.height || 50}
          // width='100'
        />
      </div>
    );
  }
};
