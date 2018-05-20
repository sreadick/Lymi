import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button, Card } from 'react-materialize';
import { DayPickerRangeController, DayPickerSingleDateController } from 'react-dates';
import moment from 'moment';

export default TreatmentDates = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return (
    <div className='row'>

      <Row>
        <Col s={4} offset='s1'>
          <Input
            className='white dropdown--label-margin'
            // label='Date Format'
            labelClassName='white-text'
            type='select'
            // name="dose_type"
            value={props.treatment.dateSelectMode}
            onChange={(e) => props.handleDateModeChange(e.target.value)}>
              <option value='daily'> Every Day</option>
              <option value='from now on'> Days of the Week</option>
              <option value="date range"> Date Range</option>
              <option value="individual select"> Individual Dates</option>
          </Input>
        </Col>
      </Row>

      { props.treatment.dateSelectMode === 'from now on' ?
        <Row className='rx-detail-form'>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) =>
            <Col s={2} key={day}>
              <input
                type="checkbox"
                className='filled-in'
                id={`${props.treatment._id}_${day}`}
                checked={props.treatment.daysOfWeek.includes(day)}
                // disabled={props.treatment.dateSelectMode === 'individual select'}
                onChange={(e) => props.handleWeekdayChange(e, [day])} />
              <label htmlFor={`${props.treatment._id}_${day}`}>{day}</label>
            </Col>
          )}
          {/* <button className='btn-flat'
            onClick={() => props.handleWeekdayChange(undefined, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])}>
            Select All
          </button> */}
          <div className="input-response red-text text-darken-2">
            {props.showErrors ? props.treatment.errors.daysOfWeek : ''}
          </div>
        </Row>
        :
        props.treatment.dateSelectMode === 'date range' ?
        <Row>
          <Col s={7} offset='s1'>
            <div className='date-picker-wrapper'>
              <DayPickerRangeController
                startDate={props.startDate} // momentPropTypes.momentObj or null,
                endDate={props.endDate} // momentPropTypes.momentObj or null,
                onDatesChange={({ startDate, endDate }) => props.handleDateRangeSelection(startDate, endDate)}
                onDatesChange={({ startDate, endDate }) => props.handleDateRangeSelection(startDate, endDate)}
                focusedInput={props.focusedInput}
                onFocusChange={focusedInput => props.handleDateRangeFocusChange(focusedInput)}
                // isOutsideRange={(day) => (state.daysOfWeek.includes(day.format('dddd')) && day.isSameOrAfter(moment().startOf('day')) ) ? false : true}
                isOutsideRange={(day) => props.treatment.daysOfWeek.includes(day.format('dddd')) ? false : true}
                numberOfMonths={2}
              />
              <div className="input-response red-text text-darken-2 align-right">{props.showErrors ? props.treatment.errors.dateRange : ''}</div>
            </div>
          </Col>
          <Col className='white' s={2} offset='s2'>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) =>
              <div key={day}>
                <input
                  type="checkbox"
                  className='filled-in'
                  id={`${props.treatment._id}_${day}`}
                  checked={props.treatment.daysOfWeek.includes(day)}
                  // disabled={props.treatment.dateSelectMode === 'individual select'}
                  onChange={(e) => props.handleWeekdayChange(e, [day])} />
                <label htmlFor={`${props.treatment._id}_${day}`}>{day}</label>
              </div>
            )}
            {/* <button className='btn-link'
              onClick={() => props.handleWeekdayChange(undefined, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])}>
              Select All
            </button> */}
            <div className="input-response red-text text-darken-2">
              {props.showErrors ? props.treatment.errors.daysOfWeek : ''}
            </div>
          </Col>
        </Row>
        : props.treatment.dateSelectMode === 'individual select' ?
        <Row>
          <Col offset='s3'>
            <div className='date-picker-wrapper individual-date-picker'>
              <DayPickerSingleDateController
                date={null}
                onDateChange={date => props.handleIndividualDateSelection(date)}
                isDayHighlighted={date => props.treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(date.format('MM DD YYYY'))}
                // isOutsideRange={(day) => (day.isSameOrAfter(moment().startOf('day')) ) ? false : true}
              />
              <div className="input-response red-text text-darken-2 align-right">{props.showErrors ? props.treatment.errors.individualDates : ''}</div>
            </div>
          </Col>
        </Row>
      :
        <div></div>
      }
    </div>
  );
}
