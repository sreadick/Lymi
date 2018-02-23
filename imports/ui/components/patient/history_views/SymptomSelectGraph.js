import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';

import SymptomChart from '../SymptomChart';

export default class SymptomSelectGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graphedSymptoms: [],
    }
    // this.handleChange = this.handleChange.bind(this);
  }

  // handleChange(e) {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   });
  // }

  render() {
    return (
      <div className='symptom-history__graph-view'>
        <Row>
          <div className='symptom-history__title col s5'>Select up to 5 symptoms to graph:</div>
          <Input s={2} type='select' label='Date Range' value={this.props.dateRangeOption} onChange={(e) => this.props.handleDateRangeChange(undefined, e.target.value)}>
            <option value='all_dates'>All Dates</option>
            <option value='seven_days'>Last 7 Days</option>
            <option value='thirty_days'>Last 30 Days</option>
            <option value='twelve_months'>Last 12 Months</option>
            <option value='year_to_current'>Year to Date</option>
            {Meteor.user().profile.medical.appointments &&
              <option value='prev_appt_to_current'>Since Last Appointment</option>
            }
            <option value='custom'>Custom Range</option>
          </Input>
          {this.props.dateRangeOption === 'custom' &&
            <div>
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
            </div>
          }
        </Row>
        <div className='card'>
          {this.props.symptoms.map(symptom =>
            <Input
              key={symptom.name}
              type='checkbox'
              name='graphedSymptoms'
              value={symptom.name}
              label={symptom.name}
              defaultChecked={this.state.graphedSymptoms.includes(symptom.name)}
              disabled={this.state.graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name) === false && this.state.graphedSymptoms.length >= 5}
              onChange={() => {
                const graphedSymptoms = this.state.graphedSymptoms.slice();
                if (graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name)) {
                  const symptomIndex = graphedSymptoms.indexOf(symptom)
                  graphedSymptoms.splice(symptomIndex, 1);
                } else {
                  graphedSymptoms.push(symptom)
                }
                this.setState({graphedSymptoms})
              }}
            />
          )}
          <SymptomChart
            symptomNames={this.state.graphedSymptoms.map(symptom => symptom.name)}
            symptomColors={this.state.graphedSymptoms.map(symptom => symptom.color)}
            checkins={this.props.checkins}
            currentSymptomNames={this.props.currentSymptomNames}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            padding={{top: 30, right: 30, bottom: 10, left: 0}}
          />
        </div>
      </div>
    );
  }
};
