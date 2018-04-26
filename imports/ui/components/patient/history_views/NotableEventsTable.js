import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';


export default class NotableEventsTable extends React.Component {
  render() {
    return (
      <div className='symptom-history__graph-view'>
        <Row>
          <div className='symptom-history__title col s5'>Events Table</div>
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
        <div>
          {this.props.checkins.map(checkin =>
            <div className="section" key={checkin.date}>
              <h4>{checkin.date}</h4>
              {checkin.notableEvents &&
                <table>
                  <thead>
                    <tr>
                      <th>Events:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{checkin.notableEvents}</td>
                    </tr>
                  </tbody>
                </table>
              }
            </div>
          )}

        </div>
      </div>
    );
  }
};
