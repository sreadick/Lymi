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
        <Row>
          <div className='symptom-history__title col s8'>Symptoms Ordered By System:</div>
          <Input s={2} type='select' label='Start Date' value={this.props.startDate || ''} onChange={(e) => this.props.handleDateRangeChange('graphStartDate', e.target.value)}>
            {this.props.checkinDates.map(date =>
              <option
                key={date}
                value={date}
                disabled={moment(date, 'MMMM Do YYYY').isAfter(moment(this.props.endDate, "MMMM Do YYYY"), 'day')}>
                {date}
              </option>
            )}
          </Input>
          <Input s={2} type='select' label='End Date' value={this.props.endDate || ''} onChange={(e) => this.props.handleDateRangeChange('graphEndDate', e.target.value)}>
            {this.props.checkinDates.map(date =>
              <option
                key={date}
                value={date}
                disabled={moment(date, 'MMMM Do YYYY').isBefore(moment(this.props.startDate, "MMMM Do YYYY"), 'day')}>
                {date}
              </option>
            )}
          </Input>
        </Row>
        {this.props.systems.map((system, index) =>
          <div key={index} className='card'>
            <h3 className='symptom-history__title--system'>{system}</h3>

            {this.props.symptoms.filter(symptom => symptom.system === system).map(symptom => (
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
              // maxSymptomsPerSegment={this.props.maxSymptomsPerSegment}
              symptomNames={this.props.symptoms.filter(symptom => symptom.system === system).map(symptom => symptom.name)}
              symptomColors={this.props.symptoms.filter(symptom => symptom.system === system).map(symptom => symptom.color)}
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
