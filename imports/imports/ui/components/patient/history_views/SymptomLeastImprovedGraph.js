import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase, getColor} from '/imports/utils/utils';

import SymptomChart from '../SymptomChart';

export default class SymptomLeastImprovedGraph extends React.Component {
  render() {
    const graphedDays = moment(this.props.endDate, 'MMMM Do YYYY').diff(moment(this.props.startDate, 'MMMM Do YYYY'), 'days') + 1;
    if (graphedDays < 14) {
      return <p>Two weeks of data are required for this graph.</p>
    }
    return (
      <div>
        {this.props.symptoms.map((symptom, index) => (
          <div key={symptom._id}>
            <span
              className={`checkin-symptom-item ${!this.props.currentSymptomNames.find(userSymptomName => userSymptomName === symptom.name) ? 'deleted' : ''}`}
              style={{
                color: getColor(index),
              }}>
              {capitalizePhrase(symptom.name)}
            </span>
          </div>
        ))}
        <SymptomChart
          symptomNames={this.props.symptoms.map(symptom => symptom.name)}
          symptomColors={this.props.symptoms.map((symptom, index) => getColor(index))}
          checkins={this.props.checkins}
          currentSymptomNames={this.props.currentSymptomNames}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          padding={{top: 30, right: 30, bottom: 10, left: 0}}
        />
      </div>
    );
  }
};
