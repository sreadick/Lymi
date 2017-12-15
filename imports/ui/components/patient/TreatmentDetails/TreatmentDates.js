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
      <div className='col l2'>
        <div className='days-of-week-list'>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) =>
            <div key={day}>
              <input
                type="checkbox"
                id={`${props.treatment._id}_${day}`}
                checked={props.treatment.daysOfWeek.includes(day)}
                disabled={props.treatment.dateSelectMode === 'individual select'}
                onChange={(e) => props.handleWeekdayChange(e, [day])} />
              <label htmlFor={`${props.treatment._id}_${day}`}>{day}</label>
            </div>
          )}
          {props.treatment.dateSelectMode !== 'individual select' &&
            <button className='btn-flat'
              onClick={() => props.handleWeekdayChange(undefined, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])}>
              Select All
            </button>
          }
          <div className="input-response red-text text-darken-2">
            {props.showErrors ? props.treatment.errors.daysOfWeek : ''}
          </div>
        </div>
      </div>
      <div className='col l3'>
        {['from now on', 'date range', 'individual select'].map(dateSelectMode =>
          <div className='row' key={dateSelectMode}>
            <div
              className={`date_select_mode_btn white btn-flat ${props.treatment.dateSelectMode === dateSelectMode && 'selected'}`}
              onClick={() => props.handleDateModeChange(dateSelectMode)}>
              {dateSelectMode === 'from now on' ? "Continuous" : dateSelectMode === 'date range' ? "Select Date Range" : "Select Individual Dates"}
            </div>
          </div>
        )}
      </div>
      <div className='col l7'>
        { props.treatment.dateSelectMode === 'date range' ?
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
        : props.treatment.dateSelectMode === 'individual select' ?
          <div className='date-picker-wrapper individual-date-picker'>
            <DayPickerSingleDateController
              date={null}
              onDateChange={date => props.handleIndividualDateSelection(date)}
              isDayHighlighted={date => props.treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(date.format('MM DD YYYY'))}
              // isOutsideRange={(day) => (day.isSameOrAfter(moment().startOf('day')) ) ? false : true}
            />
            <div className="input-response red-text text-darken-2 align-right">{props.showErrors ? props.treatment.errors.individualDates : ''}</div>
          </div>
        : undefined }
      </div>
    </div>
  );
}
