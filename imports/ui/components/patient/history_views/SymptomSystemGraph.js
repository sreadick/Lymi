import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase, getColor} from '/imports/utils/utils';

import SymptomChart from '../SymptomChart';

export default class SymptomSelectGraph extends React.Component {
  render() {
    return (
      <div>
        {this.props.systems.map((system, index) =>
          <div key={index} className=''>
            <h3 className='symptom-history__title--system'>{system}</h3>

            {this.props.symptoms.filter(symptom => symptom.system === system).map((symptom, index) => (
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
              symptomNames={this.props.symptoms.filter(symptom => symptom.system === system).map(symptom => symptom.name)}
              symptomColors={this.props.symptoms.filter(symptom => symptom.system === system).map((symptom, index) => getColor(index))}
              checkins={this.props.checkins}
              currentSymptomNames={this.props.currentSymptomNames}
              startDate={this.props.startDate}
              endDate={this.props.endDate}
              padding={{top: 30, right: 30, bottom: 10, left: 0}}
            />
          </div>
        )}

      </div>
    );
  }
};
