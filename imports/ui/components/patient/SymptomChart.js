import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment'

import { Line } from 'react-chartjs-2';

export default class SymptomChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      chartOptions: {}
    }
  }

  componentDidMount() {

    this.setState({
      chartData: {
        labels: this.getData().dateLabels,
        datasets: this.getData().symptomDatasets,
      },
      chartOptions: {
        maintainAspectRatio: false,
				responsive: true,
        legend: {
          display: false,
          labels: {
            fontSize: 10,
            fontStyle: 'bold',
            fontColor: '#444',
            usePointStyle: true,
          },
          position: 'top'
        },
        layout: {
          padding: this.props.padding || 0
        },
				scales: {
					xAxes: [{
						display: true,
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: window.innerWidth > 700 ? true : false,
              fontColor: this.props.symptomNames.length === 1 ? this.props.symptomColors[0] : 'grey',
							// labelString: this.props.symptomNames.length === 1 ? this.props.symptomNames[0] : '',
						},
            ticks: {
              min: 1,
              max: 10,
              stepSize: 1
            }
					}]
				},
        tooltips: {
          mode: 'point',
          titleFontSize: 20,
          callbacks: {
            title: ((tooltips, data) => this.props.checkins[tooltips[0].index] ? this.props.checkins[tooltips[0].index].date : '')
          }
        }
			}
    });
  }

  componentDidUpdate(prevProps) {
    // if (prevProps.chartData !== this.props.chart)
    if (prevProps.symptomNames !== this.props.symptomNames) {
      this.setState({
        chartData: {
          labels: this.getData().dateLabels,
          datasets: this.getData().symptomDatasets,
        }
      })
    }
  }

  getData() {
    const startDate = moment(this.props.checkins[0].date, 'MMMM Do YYYY');
    const lastDate = moment(this.props.checkins[this.props.checkins.length - 1].date, 'MMMM Do YYYY');
    const totalDatesNumber = lastDate.diff(startDate , 'days') + 1;
    const dateLabels = [...Array(totalDatesNumber).keys()].map((dateOffset) =>
      moment(startDate).add(dateOffset, "d").format('M/D/YY')
    );
    // const colorsArray = this.props.symptomColors || ['#E17575', '#E275E2', '#7575E2', '#75E2E2', '#75E275', '#E2E275', '#E2AC75', '#B26161', '#5B5B8C', '#707070', '#26622E'];
    // const colorsArray = this.props.symptomColors;
    const symptomDatasets = this.props.symptomNames.map((symptom, index) => {
      return {
        label: symptom,
        backgroundColor: this.props.symptomColors[index] || 'pink',
        // lineTension: .2,
        borderColor: this.props.symptomColors[index] || 'pink',
        borderDash: this.props.currentSymptomNames && !this.props.currentSymptomNames.includes(symptom) ? [5, 10] : undefined,
        fill: false,
        // cubicInterpolationMode: 'monotone',
        lineTension: .0,
        data: this.props.checkins.map((checkin) => {
          const targetSymptomCheckin = checkin.symptoms.find((checkinSymptom) => {
            return checkinSymptom.name === symptom;
          });
          if (targetSymptomCheckin && targetSymptomCheckin.severity !== 0) {
            return {
              x: moment(checkin.date, 'MMMM Do YYYY').format('M/D/YY'),
              y: targetSymptomCheckin.severity
            }
          }
        })
      }
    });

    const dummyDataset = {
      data: {
        x: '',
        y: null
      }
    };

    const dummyLabel = '';

    // if (this.props.checkins.length === 1) {
    //   symptomDatasets.forEach((dataset) => {
    //     dataset.data.push(dummyDataset);
    //     dataset.data.unshift(dummyDataset);
    //   })
    //   dateLabels.push(dummyLabel);
    //   dateLabels.unshift(dummyLabel);
    // }

    for (let i = 0; i < 20 - this.props.checkins.length; ++i) {
      symptomDatasets.forEach((dataset) => {
        dataset.data.push(dummyDataset);
      })
      dateLabels.push(dummyLabel);
    }

    return {
      symptomDatasets, dateLabels
    }
  }

  render() {
    return (
      <div className="chart">
        <Line
          data={this.state.chartData}
          options={this.state.chartOptions}
          height={this.props.height || 100}
          // width='100'
        />
      </div>
    );
  }
};
