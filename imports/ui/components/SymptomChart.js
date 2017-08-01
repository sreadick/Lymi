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
      moment(startDate).add(dateOffset, "d").format('MMMM Do YYYY')
    );
    const colorsArray = ['blue', 'green', 'yellow', 'purple', 'red', 'brown'];

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
        borderColor: colorsArray[index],
        fill: false,
        data: props.checkins.map((checkin) => {
          const targetSymptomCheckin = checkin.symptoms.find((checkinSymptom) => {
            return checkinSymptom.name === symptom;
          });
          if (targetSymptomCheckin && targetSymptomCheckin.severity !== 0) {
            return {
              x: checkin.date,
              y: targetSymptomCheckin.severity
            }
          }
        })
      }
    });

    this.state = {

      chartData: {
        labels: dateLabels,
        datasets: symptomDatasets,
      },

      chartOptions: {
				responsive: true,
        title:{
            display: true,
            text: "Symptoms"
        },
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'value'
						},
            ticks: {
              min: 1,
              max: 5,
              stepSize: 1
            }
					}]
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
        />
      </div>
    );
  }
};
