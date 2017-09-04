import React from 'react';
import { Meteor } from 'meteor/meteor';

import Collapsible from 'react-collapsible';
import moment from 'moment';
import { DayPickerRangeController, DayPickerSingleDateController } from 'react-dates';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

export class TreatmentItem extends React.Component {
  constructor(props) {
    super(props);
    const { name, amount, dose, dose_type, frequency, daysOfWeek, startDateValue, endDateValue, dateSelectMode, individualDateValues, dosingFormat, dosingDetails, otherInstructions, info } = props.treatment;

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
      dateSelectMode,
      individualDateValues,
      dosingFormat,
      dosingDetails,
      otherInstructions,
      info
    };

    this.handleWeekdayChange = this.handleWeekdayChange.bind(this);
    this.handleIndividualDateSelection = this.handleIndividualDateSelection.bind(this);
  }

  componentDidMount() {
    this.props.getAllErrors();
  }

  handleChange(e) {
    const otherUpdates = {};
    if (e.target.name === 'dose_type' && e.target.value === 'pills') {
      this.setState({
        dose_type: 'pills',
        dose: 0,
      });
    } else if (e.target.name === 'frequency') {
      if (parseFloat(e.target.value) > 9) {
        e.target.value = 9;
      } else if (parseFloat(e.target.value) < 1) {
        e.target.value = 1
      }
      const dosingDetails = Object.assign({}, this.props.treatment.dosingDetails, {specificDoses: []});
      for (let i = 0; i < parseInt(e.target.value); i++) {
        dosingDetails.specificDoses.push(this.state.dosingDetails.specificDoses[i] ?
          {
            time: this.state.dosingDetails.specificDoses[i].time,
            quantity: parseFloat(this.state.dosingDetails.specificDoses[i].quantity) || 0,
          } : {
            time: moment().hour(0).minute(0).valueOf(),
            quantity: 1
          }
        );
      }

      otherUpdates.dosingDetails = dosingDetails;
      this.setState({
        frequency: e.target.value,
        dosingDetails
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }

    Meteor.call('userTreatments.update', this.props.treatment._id, {
      [e.target.name]: e.target.value,
      ...otherUpdates
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.props.getAllErrors();
      }
    });
  }

  handleDosingDetailsChange({type, index, targetProperty, changedValue}) {
    Meteor.call('userTreatments.details.update', this.props.treatment._id, {
      type, index, targetProperty, changedValue
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.props.getAllErrors();
      }
    });
    const dosingDetails = Object.assign({}, this.state.dosingDetails);
    if (index !== undefined) {
      dosingDetails[type][index][targetProperty] = changedValue;
    } else {
      dosingDetails[type][targetProperty] = changedValue;
    }

    this.setState({dosingDetails})
  }

  handleInstructionsChange(e) {
    const otherInstructions = Object.assign({}, this.state.otherInstructions);
    otherInstructions[e.target.name] = e.target.value

    Meteor.call('userTreatments.update', this.props.treatment._id, {otherInstructions}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.props.getAllErrors();
      }
    });
    this.setState({otherInstructions});
  }

  handleInfoChange(e) {
    const info = Object.assign({}, this.state.info);
    info[e.target.name] = e.target.value

    Meteor.call('userTreatments.update', this.props.treatment._id, {info}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.props.getAllErrors();
      }
    });
    this.setState({info});
  }

  handleRemove() {
    Meteor.call('userTreatments.remove', this.props.treatment._id)
  }

  handleIndividualDateSelection(date) {
    const individualDateValues = this.state.individualDateValues.slice();
    const dateTargetIndex = individualDateValues.indexOf(date.valueOf());
    if (dateTargetIndex < 0) {
      individualDateValues.push(date.valueOf());
    } else {
      individualDateValues.splice(dateTargetIndex, 1)
    }
    Meteor.call('userTreatments.update', this.props.treatment._id, {individualDateValues}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.props.getAllErrors();
      }
    });
    this.setState({individualDateValues});
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

              {/* <div className='treatment-details-section'> */}
              <div className='grey-text'>Details</div>
              	{/* <CollapsibleItem header='Dates' icon='date_range'> */}
              <div className="Collapsible__container z-depth-2">
              	<Collapsible trigger=
                  {
                    <div className='valign-wrapper'>
                      <i className='material-icons'>date_range</i>
                      <div>Dates
                        <span className="red-text text-darken-2">{this.props.showErrors && (this.props.errors.daysOfWeek || this.props.errors.dateRange || this.props.errors.individualDates) ? 'Invalid dates' : ''}</span>
                      </div>
                    </div>
                  }
                >
                  <div className='row'>
                    <div className='col l2'>
                      <div className='days-of-week-list'>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) =>
                          <div key={day}>
                            <input type="checkbox" id={`${this.props.treatment._id}_${day}`} checked={this.state.daysOfWeek.includes(day)} disabled={this.state.dateSelectMode === 'individual select'} onChange={(e) => this.handleWeekdayChange(e, [day])}/>
                            <label htmlFor={`${this.props.treatment._id}_${day}`}>{day}</label>
                          </div>
                        )}
                        {this.state.dateSelectMode !== 'individual select' && <button className='btn-flat'
                          onClick={() => this.handleWeekdayChange(undefined, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])}>
                          Select All
                        </button>}
                        <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.daysOfWeek : ''}</div>
                      </div>
                    </div>
                    <div className='col l3'>
                      {['from now on', 'date range', 'individual select'].map(dateSelectMode =>
                        <div className='row' key={dateSelectMode}>
                          <div
                            className={`date_select_mode_btn white btn-flat ${this.state.dateSelectMode === dateSelectMode && 'selected'}`}
                            onClick={() => {
                              Meteor.call('userTreatments.update', this.props.treatment._id, {
                                dateSelectMode,
                                // startDateValue: undefined,
                                // endDateValue: undefined,
                              }, (err, res) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  this.props.getAllErrors();
                                }
                              });
                              this.setState({dateSelectMode})
                            }}>
                            {dateSelectMode === 'from now on' ? "From Now On" : dateSelectMode === 'date range' ? "Select Date Range" : "Select Individual Dates"}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className='col l7'>
                      {this.state.dateSelectMode === 'date range' ?
                        <div className='date-picker-wrapper'>
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
                            focusedInput={this.state.focusedInput}
                            onFocusChange={focusedInput => this.setState({ focusedInput: this.state.focusedInput === 'startDate' ? 'endDate' : 'startDate' })}
                            isOutsideRange={(day) => (this.state.daysOfWeek.includes(day.format('dddd')) && day.isSameOrAfter(moment().startOf('day')) ) ? false : true}
                            numberOfMonths={2}
                          />
                          <div className="input-response red-text text-darken-2 align-right">{this.props.showErrors ? this.props.errors.dateRange : ''}</div>
                        </div>
                      : this.state.dateSelectMode === 'individual select' ?
                        <div className='date-picker-wrapper individual-date-picker'>
                          <DayPickerSingleDateController
                            date={null}
                            onDateChange={date => this.handleIndividualDateSelection(date)}
                            isDayHighlighted={date => this.state.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(date.format('MM DD YYYY'))}
                            isOutsideRange={(day) => (day.isSameOrAfter(moment().startOf('day')) ) ? false : true}
                          />
                          <div className="input-response red-text text-darken-2 align-right">{this.props.showErrors ? this.props.errors.individualDates : ''}</div>
                        </div>
                      : undefined
                    }
                    </div>
                  </div>
              	</Collapsible>
                <Collapsible trigger={<div className='valign-wrapper'><i className='material-icons'>bubble_chart</i><span>Dosing</span></div>}>
                <div className="col l4">
                  <span>Select one of the following formats:</span>
                  <p>
                    <input type="radio" name="dosingFormat" id="format:default" value='default' checked={this.state.dosingFormat === 'default'} onChange={this.handleChange.bind(this)} />
                    <label htmlFor="format:default">Default</label>
                  </p>
                  <p>
                    <input type="radio" name="dosingFormat" id="format:generalTimes" value='generalTimes' checked={this.state.dosingFormat === 'generalTimes'} onChange={this.handleChange.bind(this)} />
                    <label htmlFor="format:generalTimes">General Times</label>
                  </p>
                  <p>
                    <input type="radio" name="dosingFormat" id="format:specificTimes" value='specificTimes' checked={this.state.dosingFormat === 'specificTimes'} onChange={this.handleChange.bind(this)} />
                    <label htmlFor="format:specificTimes">Specific Times</label>
                  </p>
                  <p>
                    <input type="radio" name="dosingFormat" id="format:byHours" value='byHours' checked={this.state.dosingFormat === 'byHours'} onChange={this.handleChange.bind(this)} />
                    <label htmlFor="format:byHours">{`Every ${this.state.dosingDetails.hourlyDose.hourInterval == 0 ? 'x' : this.state.dosingDetails.hourlyDose.hourInterval} ${this.state.dosingDetails.hourlyDose.hourInterval == 1 ? 'hour' : 'hours'}`}</label>
                  </p>
                  <p>
                    <input type="radio" name="dosingFormat" id="format:prn" value='prn' checked={this.state.dosingFormat === 'prn'} onChange={this.handleChange.bind(this)} />
                    <label htmlFor="format:prn">PRN (as neeeded)</label>
                  </p>
                  <p>
                    <input type="radio" name="dosingFormat" id="format:other" value='other' checked={this.state.dosingFormat === 'other'} onChange={this.handleChange.bind(this)} />
                    <label htmlFor="format:other">Other</label>
                  </p>
                </div>
                {this.state.dosingFormat === 'generalTimes' &&
                <div className='col l8'>
                  {this.state.dosingDetails.generalDoses.map((dose, index) =>
                    <div className='row' key={index}>
                      <div className="col s8">
                        {dose.time.charAt(0).toUpperCase() + dose.time.slice(1)}
                      </div>
                      <div className="col s2">
                        <span className='grey-text'>take: </span>
                      </div>
                      <div className="col s2">
                        <div className="input-field">
                          <input type="number" value={dose.quantity} min="0"  onChange={(e) => this.handleDosingDetailsChange({type: 'generalDoses', index, targetProperty: 'quantity', changedValue: e.target.value})}/>
                        </div>
                      </div>
                    </div>
                  )}
                </div>}
                {this.state.dosingFormat === 'specificTimes' &&
                  <div className='col l8'>
                    <div className='row'>
                      <div className="input-field col l4">
                        <input type="number" name="frequency" ref="frequency" value={this.state.frequency} min="1" onChange={this.handleChange.bind(this)}/>
                        <label className='active' htmlFor='frequency'>Times Per Day</label>
                      </div>
                    </div>
                    {this.state.dosingDetails.specificDoses.map((dose, index) =>
                      <div className='row' key={index}>
                        <div className="col s8">
                          <TimePicker
                            showSecond={false}
                            value={moment(dose.time)}
                            className="xxx browser-default"
                            onChange={(newDoseTime) => this.handleDosingDetailsChange({type: 'specificDoses', index, targetProperty: 'time', changedValue: newDoseTime.valueOf()})}
                            format={'h:mm a'}
                            use12Hours
                          />
                        </div>
                        <div className="col s2">
                          <span className='grey-text'>take: </span>
                        </div>
                        <div className="col s2">
                          <div className="input-field">
                            <input type="number" value={dose.quantity} min="0" onChange={(e) => this.handleDosingDetailsChange({type: 'specificDoses', index, targetProperty: 'quantity', changedValue: e.target.value})}/>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                }
                {this.state.dosingFormat === 'byHours' &&
                  <div className='col l8'>
                    <div className='row'>
                      <div className="col s2">
                        <span>Take</span>
                      </div>
                      <div className="col s2">
                        <div className="input-field">
                          <input type="number" value={this.state.dosingDetails.hourlyDose.quantity} min="0" onChange={(e) => this.handleDosingDetailsChange({type: 'hourlyDose', targetProperty: 'quantity', changedValue: e.target.value})}/>
                        </div>
                      </div>
                      <span className='col s2'>every</span>
                      <select className="col s2 browser-default" value={this.state.dosingDetails.hourlyDose.hourInterval} onChange={(e) => this.handleDosingDetailsChange({type: 'hourlyDose', targetProperty: 'hourInterval', changedValue: e.target.value})} >
                        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(hour =>
                          <option key={hour} value={hour}>{hour === 0 ? 'x': hour}</option>
                        )}
                      </select>
                      <span className='col l4'>{this.state.dosingDetails.hourlyDose.hourInterval == 1 ? 'hour' : 'hours'}</span>
                    </div>
                  </div>
                }
                {this.state.dosingFormat === 'prn' &&
                  <div className='col l8'>
                    <div className='row'>
                      <div className="col s2">
                        <span>Take up to</span>
                      </div>
                      <div className="col s2">
                        <div className="input-field">
                          <input type="number" value={this.state.dosingDetails.prnDose.quantity} min="0" onChange={(e) => this.handleDosingDetailsChange({type: 'prnDose', targetProperty: 'quantity', changedValue: e.target.value})}/>
                        </div>
                      </div>
                      <span className='col s2'>every</span>
                      <select className="col s2 browser-default" value={this.state.dosingDetails.prnDose.hourInterval} onChange={(e) => this.handleDosingDetailsChange({type: 'prnDose', targetProperty: 'hourInterval', changedValue: e.target.value})} >
                        {[24,12,6,4,3,2,1].map(hour =>
                          <option key={hour} value={hour}>{hour}</option>
                        )}
                      </select>
                      <span className='col l4'>{this.state.dosingDetails.prnDose.hourInterval == 1 ? 'hour' : 'hours'}</span>
                    </div>
                  </div>
                }
                {this.state.dosingFormat === 'other' &&
                  <div className='col l8'>
                    <div className='row'>
                      <div className="col s2">
                        <span>Specify: </span>
                      </div>
                      <div className="input-field col s10">
                        <textarea className="materialize-textarea" id="otherDosingInstructions" value={this.state.dosingDetails.other.dosingInstructions} onChange={(e) => this.handleDosingDetailsChange({type: 'other', targetProperty: 'dosingInstructions', changedValue: e.target.value})}></textarea>
                        <label htmlFor="otherDosingInstructions" className='active'>Instructions</label>
                      </div>
                    </div>
                  </div>
                }
              	</Collapsible>
                <Collapsible trigger={<div className='valign-wrapper'><i className='material-icons'>local_pharmacy</i><span>Other Instructions</span></div>}>
                  <div>
                    Meals:
                    {['None', 'Take with', 'Take before', 'Take after'].map(mealInstruction =>
                      <p key={mealInstruction}>
                        <input type="radio" name='meals' id={`mealInstructions_${mealInstruction}`} value={mealInstruction} checked={this.state.otherInstructions.meals === mealInstruction} onChange={(e) => this.handleInstructionsChange(e)}/>
                        <label htmlFor={`mealInstructions_${mealInstruction}`}>{mealInstruction}</label>
                      </p>
                    )}
                    Contraindications:
                    {['None', 'antibiotic', 'probiotic'].map(contraindicatedInstruction =>
                      <p key={contraindicatedInstruction}>
                        <input type="radio" name='contraindications' id={`contraindicatedInstructions_${contraindicatedInstruction}`} value={contraindicatedInstruction} checked={this.state.otherInstructions.contraindications === contraindicatedInstruction} onChange={(e) => this.handleInstructionsChange(e)}/>
                        <label htmlFor={`contraindicatedInstructions_${contraindicatedInstruction}`}>{contraindicatedInstruction !== 'None' ? "Don't take within 3 hours of" : ''} {contraindicatedInstruction}</label>
                      </p>
                    )}
                    Custom:
                    <div className='container'>
                      <div className="input-field">
                        <textarea className="materialize-textarea" id="userDefinedInstructions" name="userDefined" value={this.state.otherInstructions.userDefined} onChange={(e) => this.handleInstructionsChange(e)}></textarea>
                        <label className='active' htmlFor='userDefinedInstructions'>Specify</label>
                      </div>
                    </div>
                  </div>
              	</Collapsible>
                <Collapsible trigger={<div className='valign-wrapper'><i className='material-icons'>info</i><span>Treatment Info</span></div>}>
              		<div>
                    <div className='col l3'>
                      Type:
                      {['N/A', 'Medication', 'Supplement', 'Other'].map(treatmentType =>
                        <p key={treatmentType}>
                          <input type="radio" name='type' id={`type_${treatmentType}`} value={treatmentType} checked={this.state.info.type === treatmentType} onChange={(e) => this.handleInfoChange(e)}/>
                          <label htmlFor={`type_${treatmentType}`}>{treatmentType}</label>
                        </p>
                      )}
                      <div className="input-field inline">
                        <input id="otherType" name="typeOtherValue" value={this.state.info.typeOtherValue} disabled={this.state.info.type !== 'Other'} onChange={(e) => this.handleInfoChange(e)} />
                        <label className='active' htmlFor='otherType'>Specify</label>
                      </div>
                    </div>
                    <div className='col l3'>
                      Category:
                      <div className="input-field">
                        <input name="category" value={this.state.info.category} placeholder='e.g. SSRI' onChange={(e) => this.handleInfoChange(e)} />
                      </div>
                    </div>
                    <div className='col l3'>
                      Used to treat:
                      <div className="input-field">
                        <input name="usedToTreat" value={this.state.info.usedToTreat} placeholder='e.g. Depression' onChange={(e) => this.handleInfoChange(e)} />
                      </div>
                    </div>
                  </div>
              	</Collapsible>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
};
