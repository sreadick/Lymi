import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment'

import { Line } from 'react-chartjs-2';

export default class SymptomChart extends React.Component {
  constructor(props) {
    super(props);
    const startDate = moment(props.checkins[0].date, 'MMMM Do YYYY');
    const lastDate = moment(props.checkins[props.checkins.length - 1].date, 'MMMM Do YYYY');
    const totalDatesNumber = lastDate.diff(startDate , 'days') + 1;
    const dateLabels = [...Array(totalDatesNumber).keys()].map((dateOffset) =>
      moment(startDate).add(dateOffset, "d").format('M/D/YY')
    );
    const colorsArray = ['#E17575', '#E275E2', '#7575E2', '#75E2E2', '#75E275', '#E2E275', '#E2AC75', '#B26161', '#5B5B8C', '#707070', '#26622E'];

    const allSymptoms = [];
    props.checkins.forEach((checkin) => {
      checkin.symptoms.forEach((symptom) => {
        if (!allSymptoms.includes(symptom.name)) {
          allSymptoms.push(symptom.name);
        }
      })
    });

    const symptomDatasets = allSymptoms.map((symptom, index) => {
      return {
        label: symptom,
        backgroundColor: colorsArray[index],
        // lineTension: .2,
        borderColor: colorsArray[index],
        fill: false,
        cubicInterpolationMode: 'monotone',
        data: props.checkins.map((checkin) => {
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

    if (props.checkins.length === 1) {
      symptomDatasets.forEach((dataset) => {
        dataset.data.push(dummyDataset);
        dataset.data.unshift(dummyDataset);
      })
      dateLabels.push(dummyLabel);
      dateLabels.unshift(dummyLabel);
    }

    this.state = {

      chartData: {
        labels: dateLabels,
        datasets: symptomDatasets,
      },
      chartOptions: {
        maintainAspectRatio: false,
				responsive: true,
        legend: {
          labels: {
            fontSize: 10,
            fontStyle: 'bold',
            fontColor: '#444',
            usePointStyle: true,
          },
          position: 'top'
        },
				scales: {
					xAxes: [{
						display: true,
            // gridLines: {
            //   // zeroLineColor: '#333'
            //
            //   // drawOnChartArea: false,
            //   lineWidth: .4,
            //   color: '#aaa'
            // }
					}],
					yAxes: [{
						display: true,
            // gridLines: {
            //   lineWidth: .4,
            //   drawOnChartArea: false,
            //   color: '#aaa',
            // },
						scaleLabel: {
							display: window.innerWidth > 700 ? true : false,
							labelString: 'Severity'
						},
            ticks: {
              min: 1,
              max: 5,
              stepSize: 1
            }
					}]
				},
        tooltips: {
          mode: 'point',
          titleFontSize: 20,
          callbacks: {
            title: ((tooltips, data) => props.checkins[tooltips[0].index] ? props.checkins[tooltips[0].index].date : '')
          }
        }
			}
    };
  }

  render() {
    return (
      <div className="chart">
        <Line
          data={this.state.chartData}
          options={this.state.chartOptions}
          height={200}
          // width='100'
        />
      </div>
    );
  }
};
