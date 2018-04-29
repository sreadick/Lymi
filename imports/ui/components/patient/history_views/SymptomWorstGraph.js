import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

import SymptomChart from '../SymptomChart';

export default class SymptomWorstGraph extends React.Component {
  render() {
    return (
      <div className='card'>
        {this.props.symptoms.map((symptom, index) => (
          <div key={symptom._id}>
            <span
              className={`checkin-symptom-item ${!this.props.currentSymptomNames.find(userSymptomName => userSymptomName === symptom.name) ? 'deleted' : ''}`}
              style={{
                color: symptom.color,
              }}>
              {capitalizePhrase(symptom.name)}
            </span>
          </div>
        ))}
        <SymptomChart
          symptomNames={this.props.symptoms.map(symptom => symptom.name)}
          symptomColors={this.props.symptoms.map(symptom => symptom.color)}
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
