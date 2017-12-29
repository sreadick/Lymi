import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

import SymptomChart from '../SymptomChart';

export default class SymptomSelectGraph extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     graphedSymptoms: [],
  //   }
  // }

  render() {
    return (
      <div className='symptom-history__graph-view'>
        {this.props.systems.map((system, index) =>
          <div key={index} className='card'>
            <h3 className='symptom-history__title--system'>{system}</h3>

            {this.props.symptoms.filter(symptom => symptom.system === system).map((symptom, index) => (
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
              // title={system}
              // maxSymptomsPerSegment={this.props.maxSymptomsPerSegment}
              // startDate={this.state.graphStartDate}
              // endDate={this.state.graphEndDate}
              symptomNames={this.props.symptoms.filter(symptom => symptom.system === system).map(symptom => symptom.name)}
              symptomColors={this.props.symptoms.filter(symptom => symptom.system === system).map(symptom => symptom.color)}
              checkins={this.props.checkins}
              currentSymptomNames={this.props.currentSymptomNames}
              padding={{top: 30, right: 30, bottom: 10, left: 0}}
            />
          </div>
        )}

      </div>
    );
  }
};
