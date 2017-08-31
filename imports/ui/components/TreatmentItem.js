import React from 'react';
import { Meteor } from 'meteor/meteor';

import moment from 'moment';

import { DayPickerRangeController, DayPickerSingleDateController } from 'react-dates';

export class TreatmentItem extends React.Component {
  constructor(props) {
    super(props);
    const { name, amount, dose, dose_type, frequency, daysOfWeek, startDateValue, endDateValue, includeDetails, dateSelectMode } = props.treatment;

    this.state = {
      name,
      amount,
      dose,
      dose_type,
      frequency,
      daysOfWeek,
      startDate: startDateValue ? moment(startDateValue) : null,
      endDate: endDateValue ? moment(endDateValue) : null,
      focusedInput: 'startDate',
      includeDetails,
      dateSelectMode,
      individualDates: []
      // dateRangeToggled,
    };

    this.handleWeekdayChange = this.handleWeekdayChange.bind(this);
  }

  componentDidMount() {
    if (this.props.errors.daysOfWeek || this.props.errors.dateRange) {
      this.setState({ includeDetails: true })
    }
  }

  handleChange(e) {
    if (e.target.name === 'dose_type' && e.target.value === 'pills') {
      this.setState({
        dose_type: 'pills',
        dose: 0,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }

    Meteor.call('userTreatments.update', this.props.treatment._id, {
      [e.target.name]: e.target.value,
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.props.getAllErrors();
      }
    });
  }

  handleRemove() {
    Meteor.call('userTreatments.remove', this.props.treatment._id)
  }

  handleWeekdayChange(e, days) {
    if (e) {
      e.preventDefault();
    }
    if (days.length === 1) {
      if (this.state.daysOfWeek.includes(days[0])) {
        Meteor.call('userTreatments.update', this.props.treatment._id, {
          daysOfWeek: this.state.daysOfWeek.filter((dayOfWeek) => dayOfWeek !== days[0])
        }, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            this.props.getAllErrors();
          }
        });
        this.setState({
          daysOfWeek: this.state.daysOfWeek.filter((dayOfWeek) => dayOfWeek !== days[0])
        });
      } else {
        Meteor.call('userTreatments.update', this.props.treatment._id, {
          daysOfWeek: [
            days[0],
            ...this.state.daysOfWeek
          ]
        }, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            this.props.getAllErrors();
          }
        });
        this.setState({
          daysOfWeek: [
            days[0],
            ...this.state.daysOfWeek
          ]
        });
      }
    } else {
      Meteor.call('userTreatments.update', this.props.treatment._id, {
        daysOfWeek: days
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.props.getAllErrors();
        }
      });
      this.setState({ daysOfWeek: days });
    }
  }


  uppercase(treatmentName) {
    const words = treatmentName.split(' ');
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  render() {
    return (
      <div className="">
        <div className="card hoverable treatment-item">

          <div className="card-content">
            {/* <div className="treatment-item__heading">
              <span className="treatment-item__remove-icon" onClick={this.handleRemove.bind(this)}><i className="remove right floated big red icon"></i></span>
              <div className={`ui ${this.state.name.trim().length > 0 ? 'black' : 'grey'} big header`}>
                {this.state.name.trim().length > 0 ? this.uppercase(this.state.name) : '[Untitled Symptom]'}
              </div>
            </div> */}
            <div className='row'>
              <span className={`card-title ${this.state.name.trim().length > 0 ? 'black-text' : 'grey-text'}`}>
                {this.state.name.trim().length > 0 ? this.uppercase(this.state.name) : '[Untitled Symptom]'}
                <a><i className="material-icons small grey-text right treatment-item__remove-icon" onClick={this.handleRemove.bind(this)}>delete_forever</i></a>
              </span>
            </div>


            <div className='row'>
              <div className="input-field">
                <input type="text" id="name" name="name" ref="name" value={this.state.name} onChange={this.handleChange.bind(this)} autoFocus/>
                <label className='active' htmlFor='name'>Medication/Supplement</label>
                <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.name : ''}</div>
              </div>
            </div>


            <div className="row">
              <div className="input-field col l4">
                <input type="number" id="amount" name="amount" ref="amount" min="1" value={this.state.amount} onChange={this.handleChange.bind(this)}/>
                <label className='active' htmlFor='amount'>Amount</label>
                <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.amount : ''}</div>
              </div>

              <div className="input-field col l3">
                <input className={`ui ${this.state.dose_type === 'pills' && 'disabled'} input`}
                  type="number" id="dose" name="dose" ref="dose" value={this.state.dose_type === 'pills' ? '' : this.state.dose} disabled={this.state.dose_type === 'pills'} min="0" step="25"
                  onChange={(e) => {
                    if (this.state.dose_type !== 'pills') {
                      this.handleChange(e);
                    }
                  }}
                />
                <label className='active' htmlFor='dose'>Dose</label>
                <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.dose : ''}</div>
              </div>

              <div className="input-field col l1">
                <select className="browser-default" ref="dose_type" name="dose_type" value={this.state.dose_type} onChange={this.handleChange.bind(this)}>
                  <option value="mg">mg</option>
                  <option value="iu">iu</option>
                  <option value="pills">pills</option>
                </select>
                {/* <label className='active' htmlFor='dose_type'>dose type</label> */}
              </div>


              <div className="input-field col l4">
                {/* <div className="ui right labeled input"> */}
                  <input type="number" name="frequency" ref="frequency" value={this.state.frequency} min="1" onChange={this.handleChange.bind(this)}/>
                {/* </div> */}
                {/* <label className='active' htmlFor='frequency'>{this.state.frequency == "1" ? "time" : "times" } per day</label> */}
                <label className='active' htmlFor='frequency'>Times Per Day</label>
                <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.frequency : ''}</div>
              </div>

              <button className='btn-flat' onClick={() => {
                this.setState({includeDetails: !this.state.includeDetails})
                Meteor.call('userTreatments.update', this.props.treatment._id, {
                  includeDetails: !this.state.includeDetails
                });
              }}>
                <span>Details<i className='material-icons'>{this.state.includeDetails ? 'expand_less' : 'expand_more'}</i></span>
              </button>
              {this.state.includeDetails &&
                <div className='treatment-details-section'>
                  <div className='days-of-week-list'>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) =>
                      <div key={day}>
                        <input type="checkbox" id={`${this.props.treatment._id}_${day}`} checked={this.state.daysOfWeek.includes(day)} onChange={(e) => this.handleWeekdayChange(e, [day])}/>
                        <label htmlFor={`${this.props.treatment._id}_${day}`}>{day}</label>
                      </div>
                    )}
                    <button className='btn-flat'
                      onClick={() => this.handleWeekdayChange(undefined, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])}>
                      Select All
                    </button>
                    <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.daysOfWeek : ''}</div>
                  </div>
                  <div className=''>
                    <div className='row'>
                      <div
                        className={`date_select_mode_btn white btn-flat ${this.state.dateSelectMode === 'fromNowOn' && 'selected'}`}
                        onClick={() => {
                          Meteor.call('userTreatments.update', this.props.treatment._id, {
                            dateSelectMode: 'fromNowOn',
                            startDateValue: undefined,
                            endDateValue: undefined,
                          });
                          this.setState({dateSelectMode: 'fromNowOn'})
                        }}>
                        From now on
                      </div>
                    </div>
                    <div className='row'>
                      <div
                        className={`date_select_mode_btn white btn-flat ${this.state.dateSelectMode === 'dateRange' && 'selected'}`}
                        onClick={() => {
                          Meteor.call('userTreatments.update', this.props.treatment._id, {
                            dateSelectMode: 'dateRange',
                            startDateValue: undefined,
                            endDateValue: undefined,
                          });
                          this.setState({dateSelectMode: 'dateRange'})
                        }}>
                        Select Date Range
                      </div>
                    </div>
                    <div className='row'>
                      <div
                        className={`date_select_mode_btn white btn-flat ${this.state.dateSelectMode === 'dateSelect' && 'selected'}`}
                        onClick={() => {
                          Meteor.call('userTreatments.update', this.props.treatment._id, {
                            dateSelectMode: 'dateSelect',
                            startDateValue: undefined,
                            endDateValue: undefined,
                          });
                          this.setState({dateSelectMode: 'dateSelect'})
                        }}>
                        Select Specific Dates
                      </div>
                    </div>

                    <div className='col l4'>
                      {this.state.dateSelectMode === 'dateRange' ?
                        <div className='date-picker-wrapper'>
                          <div className="input-response red-text text-darken-2 align-right">{this.props.showErrors ? this.props.errors.dateRange : ''}</div>
                          <DayPickerRangeController
                            startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                            endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                            onDatesChange={({ startDate, endDate }) => {
                              Meteor.call('userTreatments.update', this.props.treatment._id, {
                                startDateValue: startDate ? startDate.startOf('day').valueOf() : undefined,
                                endDateValue: endDate ? endDate.startOf('day').valueOf() : undefined
                              }, (err, res) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  this.props.getAllErrors();
                                }
                              });
                              this.setState({ startDate, endDate });
                            }}
                            // focusedInput={this.state.dateRangeToggled ? this.state.focusedInput : null} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                            // onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                            onFocusChange={focusedInput => this.setState({ focusedInput: this.state.focusedInput === 'startDate' ? 'endDate' : 'startDate' })} // PropTypes.func.isRequired,
                            isOutsideRange={(day) => (this.state.daysOfWeek.includes(day.format('dddd')) && day.isSameOrAfter(moment().startOf('day')) ) ? false : true}
                            // keepOpenOnDateSelect={true}
                            // enableOutsideDays={false}
                            numberOfMonths={2}
                          />
                        </div>
                      : this.state.dateSelectMode === 'dateSelect' ?
                        <div className='date-picker-wrapper'>
                          <div className="input-response red-text text-darken-2 align-right">{this.props.showErrors ? this.props.errors.dateRange : ''}</div>
                          {/* <DayPickerSingleDateController
                            date={this.state.singleDate} // momentPropTypes.momentObj or null
                            onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                            focused={this.state.focused} // PropTypes.bool
                            onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                          /> */}
                        </div>
                      : undefined
                    }
                    </div>
                  </div>
                </div>
              }
            </div>

          </div>
        </div>

      </div>
    );
  }
};
