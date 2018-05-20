import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';

export default class HistoryHeader extends React.Component {
  render() {
    const userInfo = Meteor.user();
    const currentDate = moment().startOf('day');
    const accountCreatedDate = moment(userInfo.account.createdAt).startOf('day');
    if (!userInfo) {
      return <div></div>
    }
    return (
      <div className='symptom-history__header'>
        <div className='symptom-history__title'>{this.props.title}</div>
        <Row className=''>
          <Input s={this.props.dateRangeOption === 'custom' ? 4 : 12} type='select' label='Date Range' value={this.props.dateRangeOption} onChange={(e) => this.props.handleDateRangeChange(undefined, e.target.value)}>
            <option value='all_dates'>All Dates</option>
            <option
              value='seven_days'
              disabled={accountCreatedDate.isAfter(currentDate.subtract(6, 'days'))}>
              Last 7 Days
            </option>
            <option
              value='thirty_days'
              disabled={accountCreatedDate.isAfter(currentDate.subtract(29, 'days'))}>
              Last 30 Days
            </option>
            <option
              value='twelve_months'
              disabled={accountCreatedDate.isAfter(currentDate.subtract(11, 'months'))}>
              Last 12 Months
            </option>
            <option
              value='year_to_current'
              disabled={accountCreatedDate.isAfter(currentDate.startOf('year'))}>
              Year to Date
            </option>
            <option
              value='prev_appt_to_current'
              disabled={userInfo.profile.medical.appointments.length === 0} >
              Since Last Appointment
            </option>
            <option value='custom'>Custom Range</option>
          </Input>
          {this.props.dateRangeOption === 'custom' &&
            // <div>
            <Input s={4} type='select' label='Start Date' value={this.props.startDate || ''} onChange={(e) => this.props.handleDateRangeChange('graphStartDate', e.target.value)}>
              {/* {this.props.checkinDates.map(date => */}
              {this.props.allDates.map(date =>
                <option
                  key={date}
                  value={date}
                  disabled={moment(date, 'MMMM Do YYYY').isAfter(moment(this.props.endDate, "MMMM Do YYYY"), 'day')}>
                  {date}
                </option>
              )}
            </Input>
          }
          {this.props.dateRangeOption === 'custom' &&
            <Input s={4} type='select' label='End Date' value={this.props.endDate || ''} onChange={(e) => this.props.handleDateRangeChange('graphEndDate', e.target.value)}>
              {this.props.allDates.map(date =>
                <option
                  key={date}
                  value={date}
                  disabled={moment(date, 'MMMM Do YYYY').isBefore(moment(this.props.startDate, "MMMM Do YYYY"), 'day')}>
                  {date}
                </option>
              )}
            </Input>
          }
        </Row>
        {this.props.showDeletedSymptomTab &&
          <p
            className={`symptom-history__toggle-link ${this.props.includeDeletedSymptoms && 'active'}`}
            onClick={() => Session.set('includeDeletedSymptoms', !Session.get('includeDeletedSymptoms'))}>
            {this.props.includeDeletedSymptoms ?  'Hide Deleted Symptoms' : 'Show Deleted Symptoms'}
          </p>
        }
        {this.props.showDeletedTreatmentTab &&
          <p
            className={`symptom-history__toggle-link ${this.props.includeDeletedTreatments && 'active'}`}
            onClick={() => Session.set('includeDeletedTreatments', !Session.get('includeDeletedTreatments'))}>
            {this.props.includeDeletedTreatments ?  'Hide Deleted Treatments' : 'Show Deleted Treatments'}
          </p>
        }
      </div>
    );
  }
};
