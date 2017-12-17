import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom'
import { Session } from 'meteor/session';

import Collapsible from 'react-collapsible';
import { Row, Col, Input, Tabs, Tab } from 'react-materialize';
import moment from 'moment';
import { DayPickerRangeController, DayPickerSingleDateController } from 'react-dates';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import Autosuggest from 'react-autosuggest';
// import autoSuggestTheme from '../../../client/styles/_react-autosuggest';

import TreatmentDosing from './TreatmentDetails/TreatmentDosing';
import TreatmentDates from './TreatmentDetails/TreatmentDates';
import TreatmentInfo from './TreatmentDetails/TreatmentInfo';
import TreatmentInstructions from './TreatmentDetails/TreatmentInstructions';

export class TreatmentEditor extends React.Component {
  constructor(props) {
    super(props);

    // const { name, amount, dose, dose_type, frequency, daysOfWeek, startDate, endDate } = props.treatment;
    const { treatment } = props;

    this.state = {
      name: treatment ? treatment.name : '',
      amount: treatment ? treatment.amount : 0,
      dose: treatment ? treatment.dose : 0,
      dose_type: treatment ? treatment.dose_type : '',
      frequency: treatment ? treatment.frequency : 0,
      daysOfWeek: treatment ? treatment.daysOfWeek : [],
      startDate: (treatment && treatment.startDateValue) ? moment(treatment.startDateValue) : null,
      endDate: (treatment && treatment.endDateValue) ? moment(treatment.endDateValue) : null,
      focusedInput: 'startDate',
      dateSelectMode: treatment ? treatment.dateSelectMode : '',
      individualDateValues: treatment ? treatment.individualDateValues : [],
      dosingFormat: treatment ? treatment.dosingFormat : '',
      dosingDetails: treatment ? treatment.dosingDetails : {
        generalDoses: [],
        specificDoses: [],
        // hourlyDose: {},
        recurringDose: {},
        prnDose: {},
        other: {}
      },
      otherInstructions: treatment ? treatment.otherInstructions : {},
      info: treatment ? treatment.info : {},
      treatmentSuggestions: [],
      selectedTab: 'dates',
    };

    this.handleWeekdayChange = this.handleWeekdayChange.bind(this);
    this.handleIndividualDateSelection = this.handleIndividualDateSelection.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    const currentTreatmentId = this.props.treatment ? this.props.treatment._id : undefined;
    const previousTreatmentId = prevProps.treatment ? prevProps.treatment._id : undefined;

    if (currentTreatmentId && currentTreatmentId !== previousTreatmentId) {
      const { name, amount, dose, dose_type, frequency, daysOfWeek, startDateValue, endDateValue, dateSelectMode, individualDateValues, dosingFormat, dosingDetails, otherInstructions, info } = this.props.treatment;
      const startDate = this.props.treatment.startDateValue ? moment(this.props.treatment.startDateValue) : null;
      const endDate = this.props.treatment.endDateValue ? moment(this.props.treatment.endDateValue) : null;
      this.setState({
        name, amount, dose, dose_type, frequency, daysOfWeek, startDateValue, endDateValue, startDate, endDate, dateSelectMode, individualDateValues, dosingFormat, dosingDetails, otherInstructions, info
      })
    }
  }

  componentDidMount() {
    // this.getAllErrors();
  }

  getAllErrors() {
    const errors = {};
    const treatment = this.props.treatment;
    // if (this.props.userTreatments.find((treatment) => this.props.userTreatments[i].name.toLowerCase() === treatment.name.toLowerCase() && this.props.userTreatments[i]._id !== treatment._id)) {
    //   errors.name = "needs to be unique"
    // }
    if (treatment.name.length < 3) {
      errors.name = "needs to be at least three characters";
    }
    if (parseInt(treatment.amount) !== parseFloat(treatment.amount) || parseInt(treatment.amount) <= 0) {
      errors.amount = "should be a positive whole number"
    }
    // if (treatment.dose_type !== 'pills' && treatment.dose <= 0) {
    //   errors.dose = "should be a positive number";
    // }
    if (parseInt(treatment.frequency) !== parseFloat(treatment.frequency) || parseInt(treatment.frequency) <= 0) {
      errors.frequency = "should be a positive whole number"
    }
    if ((treatment.dateSelectMode !== 'individual select') && treatment.daysOfWeek.length === 0) {
      errors.daysOfWeek = 'Select at least one day of the week'
    }
    if (treatment.dateSelectMode === 'date range' && (!treatment.startDateValue || !treatment.endDateValue || treatment.startDateValue === treatment.endDateValue)) {
      errors.dateRange = 'Select a start and end date';
    }
    if (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.length === 0) {
      errors.individualDates = 'Select at least one day';
    }

    Meteor.call('userTreatments.update', treatment._id, {
      errors,
      // showDateDetails: (this.props.showErrors && (errors.daysOfWeek || errors.dateRange || errors.individualDates)) ? true : false
    });
  }

  handleChange(e) {
    if (e.target.name) {
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
          this.getAllErrors();
        }
      });
    }
  }

  // handleDosingFormatChange(radioGroup, value) {
  //   this.setState({
  //     [radioGroup]: value
  //   });
  //   Meteor.call('userTreatments.update', this.props.treatment._id, {
  //     [radioGroup]: value,
  //   }, (err, res) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       this.getAllErrors();
  //     }
  //   });
  // }
  handleDosingChange({attr, value}) {
    const otherUpdates = {};

    if (attr === 'frequency') {
      if (parseFloat(value) > 9) {
        value = 9;
      } else if (parseFloat(value) < 1) {
        value = 1
      }
      const dosingDetails = Object.assign({}, this.state.dosingDetails, {specificDoses: []});
      for (let i = 0; i < parseInt(value); i++) {
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
        frequency: value,
        dosingDetails
      });
    } else {
      this.setState({
        [attr]: value
      });
    }
    Meteor.call('userTreatments.update', this.props.treatment._id, {
      [attr]: value,
      ...otherUpdates
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.getAllErrors();
      }
    });
  }

  handleDosingDetailsChange({type, index, targetProperty, changedValue}) {
    let otherUpdates = {};

    if (targetProperty === 'hourInterval' || targetProperty === 'recurringInterval') {
      changedValue = parseFloat(changedValue) || 0
    } else if (targetProperty === 'timeUnit') {
      if (changedValue === 'day' && this.state.dosingDetails.recurringDose.recurringInterval > 7 || changedValue === 'week' && this.state.dosingDetails.recurringDose.recurringInterval > 4) {
        Meteor.call('userTreatments.details.update', this.props.treatment._id, {
          type,
          index,
          targetProperty: 'recurringInterval',
          changedValue: 1
        }, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            this.getAllErrors();
          }
        });
        otherUpdates = {
          dosingDetails: Object.assign({}, this.props.treatment.dosingDetails.recurringDose, {recurringInterval: 1})
        }
      }
    }
    // if (targetProperty === 'hourInterval') {
    //   changedValue = parseFloat(changedValue) || 0
    // }
    Meteor.call('userTreatments.details.update', this.props.treatment._id, {
      type, index, targetProperty, changedValue
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.getAllErrors();
      }
    });
    const dosingDetails = Object.assign({}, this.state.dosingDetails);
    if (index !== undefined) {
      dosingDetails[type][index][targetProperty] = changedValue;
    } else {
      dosingDetails[type][targetProperty] = changedValue;
    }

    this.setState({dosingDetails, ...otherUpdates})
  }

  handleInstructionsChange(targetInstruction, value) {
    const otherInstructions = Object.assign({}, this.state.otherInstructions);
    otherInstructions[targetInstruction] = value;

    Meteor.call('userTreatments.update', this.props.treatment._id, {otherInstructions}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.getAllErrors();
      }
    });
    this.setState({otherInstructions});
  }

  handleInfoChange(targetGroup, value) {
    const info = Object.assign({}, this.state.info);
    info[targetGroup] = value;

    Meteor.call('userTreatments.update', this.props.treatment._id, {info}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.getAllErrors();
      }
    });
    this.setState({info});
  }

  handleRemove() {
    Meteor.call('userTreatments.remove', this.props.treatment._id)
    Session.set('currentTreatmentId', undefined)
  }

  handleDateModeChange(dateSelectMode) {
    Meteor.call('userTreatments.update', this.props.treatment._id, {
      dateSelectMode,
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.getAllErrors();
      }
    });
    this.setState({dateSelectMode})
  }

  handleDateRangeSelection(startDate, endDate) {
    console.log(startDate, '...', endDate);
    Meteor.call('userTreatments.update', this.props.treatment._id, {
      startDateValue: startDate ? startDate.startOf('day').valueOf() : undefined,
      endDateValue: endDate ? endDate.startOf('day').valueOf() : undefined
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.getAllErrors();
      }
    });
    this.setState({ startDate, endDate });
  }

  handleDateRangeFocusChange(focusedInput) {
    this.setState({ focusedInput: this.state.focusedInput === 'startDate' ? 'endDate' : 'startDate' });
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
        this.getAllErrors();
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
            this.getAllErrors();
          }
        });
        this.setState({
          daysOfWeek: this.state.daysOfWeek.filter((dayOfWeek) => dayOfWeek !== days[0])
        });
      } else {
        const daysOfWeek = this.state.daysOfWeek.slice();
        const position = days[0] === "Monday" ? 0 : days[0] === "Tuesday" ? 1 : days[0] === "Wednesday" ? 2 : days[0] === "Thursday" ? 3 : days[0] === "Friday" ? 4 : days[0] === "Saturday" ? 5 : 6;
        daysOfWeek.splice(position, 0, days[0]);
        Meteor.call('userTreatments.update', this.props.treatment._id, {
          daysOfWeek
        }, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            this.getAllErrors();
          }
        });
        this.setState({daysOfWeek});
      }
    } else {
      Meteor.call('userTreatments.update', this.props.treatment._id, {
        daysOfWeek: days
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.getAllErrors();
        }
      });
      this.setState({ daysOfWeek: days });
    }
  }

  uppercase(treatmentName) {
    const words = treatmentName.split(' ');
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getSuggestionValue(treatmentSuggestion) {
    if (treatmentSuggestion.brandName) {
      if (treatmentSuggestion.genericName) {
        return `${treatmentSuggestion.brandName} (${treatmentSuggestion.genericName})`;
      } else if (treatmentSuggestion.otherName) {
        return `${treatmentSuggestion.brandName} (${treatmentSuggestion.otherName})`;
      } else {
        return treatmentSuggestion.brandName;
      }
    } else if (treatmentSuggestion.name) {
      return treatmentSuggestion.name
    }
  }

  renderSuggestion(treatmentSuggestion) {
    if (treatmentSuggestion.brandName) {
      if (treatmentSuggestion.genericName) {
        return (
          <div>
            {`${treatmentSuggestion.brandName} (${treatmentSuggestion.genericName})`}
          </div>
        );
      } else if (treatmentSuggestion.otherName) {
        return (
          <div>
            {`${treatmentSuggestion.brandName} (${treatmentSuggestion.otherName})`}
          </div>
        );
      } else {
        return (
          <div>
            {treatmentSuggestion.brandName}
          </div>
        );
      }
    } else if (treatmentSuggestion.name) {
      return (
        <div>
          {treatmentSuggestion.name}
        </div>
      );
    }
  }

  onSuggestionsFetchRequested({ value }) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    this.setState({
      treatmentSuggestions: inputLength === 0 ? [] : this.props.commonTreatments.filter(commonTreatment => {
        if (commonTreatment.brandName) {
          if (commonTreatment.genericName) {
            return commonTreatment.brandName.toLowerCase().slice(0, inputLength) === inputValue || commonTreatment.genericName.toLowerCase().slice(0, inputLength) === inputValue;
          } else if (commonTreatment.otherName) {
            return commonTreatment.brandName.toLowerCase().slice(0, inputLength) === inputValue || commonTreatment.otherName.toLowerCase().slice(0, inputLength) === inputValue;
          } else {
            return commonTreatment.brandName.toLowerCase().slice(0, inputLength) === inputValue;
          }
        } else if (commonTreatment.name) {
          return commonTreatment.name.toLowerCase().slice(0, inputLength) === inputValue
        }
      })
    });
  };

  onSuggestionsClearRequested() {
    this.setState({
      treatmentSuggestions: []
    });
  };

  onSuggestionSelected(e, {suggestion, suggestionValue}) {
    Meteor.call('userTreatments.update', this.props.treatment._id, {
      name: suggestionValue,
      commonTreatmentId: suggestion._id,
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.getAllErrors();
      }
    });
    this.setState({name: suggestionValue})
  }


  render() {
    if (!this.props.treatment) {
      return <div className='treatment-editor treatment-editor--no-treatment-message z-depth-2'>Select a treatment or create a new one</div>
    }
    return (
      <div className="treatment-editor z-depth-2">
        {/* <div className="">

          <div className=""> */}
            {/* <div className="treatment-item__heading">
              <span className="treatment-item__remove-icon" onClick={this.handleRemove.bind(this)}><i className="remove right floated big red icon"></i></span>
              <div className={`ui ${this.state.name.trim().length > 0 ? 'black' : 'grey'} big header`}>
                {this.state.name.trim().length > 0 ? this.uppercase(this.state.name) : '[Untitled Symptom]'}
              </div>
            </div> */}
            {/* <div className='row'>
              <span className={`card-title ${this.state.name.trim().length > 0 ? 'black-text' : 'grey-text'}`}>
                {this.state.name.trim().length > 0 ? this.uppercase(this.state.name) : '[Untitled Symptom]'}
                <a><i className="material-icons small grey-text right treatment-item__remove-icon" onClick={this.handleRemove.bind(this)}>delete_forever</i></a>
              </span>
            </div> */}


            <div className='row row--marginless valign-wrapper'>
              <div className="input-field col l4 offset-l4">
                <Autosuggest
                  suggestions={this.state.treatmentSuggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                  getSuggestionValue={this.getSuggestionValue.bind(this)}
                  renderSuggestion={this.renderSuggestion.bind(this)}
                  onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                  inputProps={{className: 'treatment-editor__title center-align', name:'name', value: this.state.name, placeholder: "Treatment Name", onChange: this.handleChange.bind(this)}}
                />
                {/* <input type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange.bind(this)} autoFocus/>
                <label className='active' htmlFor='name'>Medication/Supplement</label> */}
                {/* <div className="input-response red-text text-darken-2 center-align">{this.props.showErrors ? this.props.treatment.errors.name : ''}</div> */}
              </div>
              <Link className='col l2 offset-l2 red-text' to="#" onClick={this.handleRemove.bind(this)}>Delete Treatment</Link>
            </div>

            <div className={`treatment-editor__details-box card z-depth-4 ${this.state.selectedTab === 'dosing' ? 'red darken-2' : this.state.selectedTab === 'dates' ? 'light-blue darken-2' : this.state.selectedTab === 'instructions' ? 'green darken-2' : 'orange darken-2'}`}>
            {/* <div className={`treatment-editor__details-box card z-depth-4`}> */}

            {/* cyan darken-2
            red darken-2
            indigo lighten-2
            orange darken-2 */}
              <Row>
                <button
                  // className={`col s3 blue btn no-hover-effect hoverable ${this.state.selectedTab === 'dosing' && 'z-depth-4'}`}
                  className={`col s3 light-blue darken-2 white-text btn-flat btn-large`}
                  onClick={() => this.setState({selectedTab: 'dates'})}>
                  Schedule
                </button>
                <button
                  // className={`col s3 red btn no-hover-effect hoverable ${this.state.selectedTab === 'dates' && 'z-depth-4'}`}
                  className={`col s3 red darken-2 white-text btn-flat btn-large`}
                  onClick={() => this.setState({selectedTab: 'dosing'})}>
                  Dosing
                </button>
                <button
                  // className={`col s3 green btn no-hover-effect hoverable ${this.state.selectedTab === 'instructions' && 'z-depth-4'}`}
                  className={`col s3 green darken-2 white-text btn-flat btn-large`}
                  onClick={() => this.setState({selectedTab: 'instructions'})}>
                  Special Instructions
                </button>
                <button
                  // className={`col s3 orange btn no-hover-effect hoverable ${this.state.selectedTab === 'info' && 'z-depth-4'}`}
                  className={`col s3 orange darken-2 white-text btn-flat btn-large`}
                  onClick={() => this.setState({selectedTab: 'info'})}>
                  Treatment Info
                </button>
              </Row>
              {this.state.selectedTab === 'dosing' ?
                <TreatmentDosing
                  treatment={this.props.treatment}
                  handleDosingChange={this.handleDosingChange.bind(this)}
                  handleDosingDetailsChange={this.handleDosingDetailsChange.bind(this)} />
              : this.state.selectedTab === 'dates' ?
                <TreatmentDates
                  treatment={this.props.treatment}
                  handleDateModeChange={this.handleDateModeChange.bind(this)}
                  handleWeekdayChange={this.handleWeekdayChange.bind(this)}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  focusedInput={this.state.focusedInput}
                  handleDateRangeSelection={this.handleDateRangeSelection.bind(this)}
                  handleDateRangeFocusChange={this.handleDateRangeFocusChange.bind(this)}
                  handleIndividualDateSelection={this.handleIndividualDateSelection.bind(this)} />
              : this.state.selectedTab === 'instructions' ?
                // <TreatmentInstructions />
                <TreatmentInstructions
                  treatment={this.props.treatment}
                  handleInstructionsChange={this.handleInstructionsChange.bind(this)} />
              :
                <TreatmentInfo
                  treatment={this.props.treatment}
                  handleInfoChange={this.handleInfoChange.bind(this)} />
              }
            </div>

            {/* <div className="card section z-depth-4">
              <Row>
                <Col s={4} offset='s4'>
                  <Input s={12} type='select' name='dosingFormat' label="Dosing Format" value={this.state.dosingFormat} onChange={this.handleChange.bind(this)}>
                		<option value='default'>Basic</option>
                		<option value='generalTimes'>Daily Times</option>
                		<option value='specificTimes'>Specific Times</option>
                		<option value='byHours'>Every x Hours</option>
                		<option value='prn'>PRN (as neeeded)</option>
                		<option value='other'>Custom</option>
                	</Input>
                </Col>
              </Row>

              { this.state.dosingFormat === 'default' ?
                <Row>
                  <div className={`input-field ${this.state.dose_type === 'pills' ? 'col l2 offset-l3' : 'col l1 offset-l3'}`}>
                    <input type="number" id="amount" name="amount" min="1" value={this.state.amount} onChange={this.handleChange.bind(this)} disabled={this.state.dosingFormat !== 'default' && this.state.dosingFormat !== 'other'}/>
                    <label className='active' htmlFor='amount'>Amount</label>
                    <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.amount : ''}</div>
                  </div>

                  {this.state.dose_type !== 'pills' &&
                    <div className="input-field col l2">
                      <input className={`ui ${this.state.dose_type === 'pills' && 'disabled'} input`}
                        type="number" id="dose" name="dose" value={this.state.dose_type === 'pills' ? '' : this.state.dose} min="0" step="25"
                        onChange={(e) => {
                          if (this.state.dose_type !== 'pills') {
                            this.handleChange(e);
                          }
                        }}
                      />
                      <label className='active' htmlFor='dose'>Dose</label>
                      <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.dose : ''}</div>
                    </div>
                  }

                  <Input s={this.state.dose_type !== 'pills' ? 1 : 2} type='select' name="dose_type" value={this.state.dose_type} onChange={this.handleChange.bind(this)}>
                    <option value="mg">mg</option>
                    <option value="iu">iu</option>
                    <option value="pills">{this.state.amount == 1 ? 'pill' : 'pills'}</option>
                	</Input>

                  <div className="input-field col l2">
                      <input type="number" name="frequency" value={this.state.frequency} min="1" onChange={this.handleChange.bind(this)} />
                    <label className='active' htmlFor='frequency'>Times Per Day</label>
                    <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.frequency : ''}</div>
                  </div>
                </Row>
                :
                this.state.dosingFormat === 'generalTimes' ?
                <div>
                  <Row>
                    {this.state.dose_type !== 'pills' &&
                      <Col l={2} offset='l4'>
                        <div className="input-field">
                          <input className={`ui ${this.state.dose_type === 'pills' && 'disabled'} input`}
                            type="number" id="dose" name="dose" value={this.state.dose_type === 'pills' ? '' : this.state.dose} min="0" step="25"
                            onChange={(e) => {
                              if (this.state.dose_type !== 'pills') {
                                this.handleChange(e);
                              }
                            }}
                          />
                          <label className='active' htmlFor='dose'>Dose</label>
                          <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.dose : ''}</div>
                        </div>
                      </Col>
                    }
                    <Col l={3}>
                      <Input type='select' name="dose_type" label='Unit of Measurement' value={this.state.dose_type} onChange={this.handleChange.bind(this)}>
                        <option value="mg">mg</option>
                        <option value="iu">iu</option>
                        <option value="pills">{this.state.amount == 1 ? 'pill' : 'pills'}</option>
                  	   </Input>
                    </Col>
                  </Row>
                  <Row>
                    <div className='col l8 offset-l1'>
                      {this.state.dosingDetails.generalDoses.map((dose, index) =>
                        <div className='row' key={index}>
                          <div className="col s2">
                            {dose.time.charAt(0).toUpperCase() + dose.time.slice(1) + ':'}
                          </div>
                          <div className="col s2">
                            <div className="input-field">
                              <input type="number" id={`${this.state.name}_${dose.time}_dose`} value={dose.quantity} min="0"  onChange={(e) => this.handleDosingDetailsChange({type: 'generalDoses', index, targetProperty: 'quantity', changedValue: e.target.value})}/>
                              <label className='active' htmlFor={`${this.state.name}_${dose.time}_dose`}>Amount</label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Row>
                </div>
                :
                this.state.dosingFormat === 'specificTimes' ?
                <div>
                  <Row>
                    {this.state.dose_type !== 'pills' &&
                      <Col l={2} offset='l3'>
                        <div className="input-field">
                          <input className={`ui ${this.state.dose_type === 'pills' && 'disabled'} input`}
                            type="number" id="dose" name="dose" value={this.state.dose_type === 'pills' ? '' : this.state.dose} min="0" step="25"
                            onChange={(e) => {
                              if (this.state.dose_type !== 'pills') {
                                this.handleChange(e);
                              }
                            }}
                          />
                          <label className='active' htmlFor='dose'>Dose</label>
                          <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.dose : ''}</div>
                        </div>
                      </Col>
                    }
                    <Col l={2}>
                      <Input type='select' name="dose_type" value={this.state.dose_type} onChange={this.handleChange.bind(this)}>
                        <option value="mg">mg</option>
                        <option value="iu">iu</option>
                        <option value="pills">{this.state.amount == 1 ? 'pill' : 'pills'}</option>
                  	   </Input>
                    </Col>
                    <div className="input-field col l2">
                      <input type="number" name="frequency" value={this.state.frequency} min="1" onChange={this.handleChange.bind(this)} />
                      <label className='active' htmlFor='frequency'>Times Per Day</label>
                      <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.frequency : ''}</div>
                    </div>
                  </Row>
                  <Row>
                    <ol className='col l8 offset-l1'>
                      {this.state.dosingDetails.specificDoses.map((dose, index) =>
                        <li className='row' key={index}>
                          <div className="col s4">
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
                            <div className="input-field">
                              <input type="number"  id={`${this.state.name}_${dose.time}_dose`} value={dose.quantity} min=".1" onChange={(e) => this.handleDosingDetailsChange({type: 'specificDoses', index, targetProperty: 'quantity', changedValue: e.target.value})}/>
                              <label className='active' htmlFor={`${this.state.name}_${dose.time}_dose`}>Amount</label>
                            </div>
                          </div>
                        </li>
                      )}
                    </ol>
                  </Row>
                </div>
                :
                this.state.dosingFormat === 'byHours' ?
                <Row>
                  <div className={`input-field ${this.state.dose_type === 'pills' ? 'col l2 offset-l3' : 'col l1 offset-l3'}`}>
                    <input type="number" id={`${this.state.name}_hourlyDoseQuantity`} value={this.state.dosingDetails.hourlyDose.quantity} min=".0" onChange={(e) => this.handleDosingDetailsChange({type: 'hourlyDose', targetProperty: 'quantity', changedValue: e.target.value})}/>
                    <label className='active' htmlFor={`${this.state.name}_hourlyDoseQuantity`}>Take</label>
                  </div>

                  {this.state.dose_type !== 'pills' &&
                    <div className="input-field col l2">
                      <input className={`ui ${this.state.dose_type === 'pills' && 'disabled'} input`}
                        type="number" id="dose" name="dose" value={this.state.dose_type === 'pills' ? '' : this.state.dose} min="0" step="25"
                        onChange={(e) => {
                          if (this.state.dose_type !== 'pills') {
                            this.handleChange(e);
                          }
                        }}
                      />
                      <label className='active' htmlFor='dose'>Dose</label>
                      <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.dose : ''}</div>
                    </div>
                  }

                  <Input s={this.state.dose_type !== 'pills' ? 1 : 2} type='select' name="dose_type" value={this.state.dose_type} onChange={this.handleChange.bind(this)}>
                    <option value="mg">mg</option>
                    <option value="iu">iu</option>
                    <option value="pills">{this.state.amount == 1 ? 'pill' : 'pills'}</option>
                	</Input>

                  <Input
                    s={2}
                    type='select'
                    value={this.state.dosingDetails.hourlyDose.hourInterval}
                    label={`Every ${this.state.dosingDetails.hourlyDose.hourInterval} ${this.state.dosingDetails.hourlyDose.hourInterval == 1 ? 'hour' : 'hours'}`}
                    onChange={(e) => this.handleDosingDetailsChange({type: 'hourlyDose', targetProperty: 'hourInterval', changedValue: e.target.value})}>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(hour =>
                        <option key={hour} value={hour}>{hour}</option>
                      )}
                  </Input>
                </Row>
                : this.state.dosingFormat === 'prn' ?
                <Row>
                  <div className="col s2 offset-l1">
                    <span>Take up to</span>
                  </div>

                  <div className={`input-field ${this.state.dose_type === 'pills' ? 'col l2' : 'col l1'}`}>
                    <input type="number" value={this.state.dosingDetails.prnDose.quantity} min=".0" onChange={(e) => this.handleDosingDetailsChange({type: 'prnDose', targetProperty: 'quantity', changedValue: e.target.value})}/>
                  </div>

                  {this.state.dose_type !== 'pills' &&
                    <div className="input-field col l2">
                      <input className={`ui ${this.state.dose_type === 'pills' && 'disabled'} input`}
                        type="number" id="dose" name="dose" value={this.state.dose_type === 'pills' ? '' : this.state.dose} min="0" step="25"
                        onChange={(e) => {
                          if (this.state.dose_type !== 'pills') {
                            this.handleChange(e);
                          }
                        }}
                      />
                      <label className='active' htmlFor='dose'>Dose</label>
                      <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.dose : ''}</div>
                    </div>
                  }

                  <Input s={this.state.dose_type !== 'pills' ? 1 : 2} type='select' name="dose_type" value={this.state.dose_type} onChange={this.handleChange.bind(this)}>
                    <option value="mg">mg</option>
                    <option value="iu">iu</option>
                    <option value="pills">{this.state.amount == 1 ? 'pill' : 'pills'}</option>
                	</Input>

                  <div className="col s1">
                    <span>Every</span>
                  </div>
                  <Input
                    s={2}
                    type='select'
                    value={this.state.dosingDetails.prnDose.hourInterval}
                    label={`${this.state.dosingDetails.prnDose.hourInterval == 1 ? 'hour' : 'hours'}`}
                    onChange={(e) => this.handleDosingDetailsChange({type: 'prnDose', targetProperty: 'hourInterval', changedValue: e.target.value})}>
                      {[24,12,6,4,3,2,1].map(hour =>
                        <option key={hour} value={hour}>{hour}</option>
                      )}
                  </Input>
                </Row>
                :
                <Row>
                  <div className='input-field col l8 offset-l2'>
                    <textarea className="materialize-textarea" id="otherDosingInstructions" value={this.state.dosingDetails.other.dosingInstructions} onChange={(e) => this.handleDosingDetailsChange({type: 'other', targetProperty: 'dosingInstructions', changedValue: e.target.value})}></textarea>
                    <label htmlFor="otherDosingInstructions" className='active'>Dosing Instructions</label>
                  </div>
                </Row>
              }
            </div> */}


            {/* <div>
              <div className='grey-text'>Details</div>
              <div className="Collapsible__container z-depth-2">
              	<Collapsible trigger=
                  {
                    <div className='valign-wrapper'>
                      <i className='material-icons'>date_range</i>
                      <div>Dates
                        <span className="red-text text-darken-2">{this.props.showErrors && (this.props.treatment.errors.daysOfWeek || this.props.treatment.errors.dateRange || this.props.treatment.errors.individualDates) ? 'Invalid dates' : ''}</span>
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
                        <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.treatment.errors.daysOfWeek : ''}</div>
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
                              }, (err, res) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  this.getAllErrors();
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
                                  this.getAllErrors();
                                }
                              });
                              this.setState({ startDate, endDate });
                            }}
                            focusedInput={this.state.focusedInput}
                            onFocusChange={focusedInput => this.setState({ focusedInput: this.state.focusedInput === 'startDate' ? 'endDate' : 'startDate' })}
                            // isOutsideRange={(day) => (this.state.daysOfWeek.includes(day.format('dddd')) && day.isSameOrAfter(moment().startOf('day')) ) ? false : true}
                            isOutsideRange={(day) => this.state.daysOfWeek.includes(day.format('dddd')) ? false : true}
                            numberOfMonths={2}
                          />
                          <div className="input-response red-text text-darken-2 align-right">{this.props.showErrors ? this.props.treatment.errors.dateRange : ''}</div>
                        </div>
                      : this.state.dateSelectMode === 'individual select' ?
                        <div className='date-picker-wrapper individual-date-picker'>
                          <DayPickerSingleDateController
                            date={null}
                            onDateChange={date => this.handleIndividualDateSelection(date)}
                            isDayHighlighted={date => this.state.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(date.format('MM DD YYYY'))}
                          />
                          <div className="input-response red-text text-darken-2 align-right">{this.props.showErrors ? this.props.treatment.errors.individualDates : ''}</div>
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
                    <input type="radio" name={`${this.state.name}_dosingFormat`} id={`${this.state.name}_format:default`} value='default' checked={this.state.dosingFormat === 'default'} onChange={(e) => this.handleDosingFormatChange('dosingFormat', e.target.value)} />
                    <label htmlFor={`${this.state.name}_format:default`}>Default</label>
                  </p>
                  <p>
                    <input type="radio" name={`${this.state.name}_dosingFormat`} id={`${this.state.name}_format:generalTimes`} value='generalTimes' checked={this.state.dosingFormat === 'generalTimes'} onChange={(e) => this.handleDosingFormatChange('dosingFormat', e.target.value)} />
                    <label htmlFor={`${this.state.name}_format:generalTimes`}>General Times</label>
                  </p>
                  <p>
                    <input type="radio" name={`${this.state.name}_dosingFormat`} id={`${this.state.name}_format:specificTimes`} value='specificTimes' checked={this.state.dosingFormat === 'specificTimes'} onChange={(e) => this.handleDosingFormatChange('dosingFormat', e.target.value)} />
                    <label htmlFor={`${this.state.name}_format:specificTimes`}>Specific Times</label>
                  </p>
                  <p>
                    <input type="radio" name={`${this.state.name}_dosingFormat`} id={`${this.state.name}_format:byHours`} value='byHours' checked={this.state.dosingFormat === 'byHours'} onChange={(e) => this.handleDosingFormatChange('dosingFormat', e.target.value)} />
                    <label htmlFor={`${this.state.name}_format:byHours`}>{`Every ${this.state.dosingDetails.hourlyDose.hourInterval == 0 ? 'x' : this.state.dosingDetails.hourlyDose.hourInterval} ${this.state.dosingDetails.hourlyDose.hourInterval == 1 ? 'hour' : 'hours'}`}</label>
                  </p>
                  <p>
                    <input type="radio" name={`${this.state.name}_dosingFormat`} id={`${this.state.name}_format:prn`} value='prn' checked={this.state.dosingFormat === 'prn'} onChange={(e) => this.handleDosingFormatChange('dosingFormat', e.target.value)} />
                    <label htmlFor={`${this.state.name}_format:prn`}>PRN (as neeeded)</label>
                  </p>
                  <p>
                    <input type="radio" name={`${this.state.name}_dosingFormat`} id={`${this.state.name}_format:other`} value='other' checked={this.state.dosingFormat === 'other'} onChange={(e) => this.handleDosingFormatChange('dosingFormat', e.target.value)} />
                    <label htmlFor={`${this.state.name}_format:other`}>Other</label>
                  </p>
                </div>
                {this.state.dosingFormat === 'generalTimes' &&
                <div className='col l8'>
                  {this.state.dosingDetails.generalDoses.map((dose, index) =>
                    <div className='row' key={index}>
                      <div className="col s2">
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
                        <input type="number" name="frequency" value={this.state.frequency} min="1" onChange={this.handleChange.bind(this)}/>
                        <label className='active' htmlFor='frequency'>Times Per Day</label>
                      </div>
                    </div>
                    {this.state.dosingDetails.specificDoses.map((dose, index) =>
                      <div className='row' key={index}>
                        <div className="col s4">
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
                        <input type="radio" name={`${this.state.name}_meals`} id={`${this.state.name}_mealInstructions_${mealInstruction}`} value={mealInstruction} checked={this.state.otherInstructions.meals === mealInstruction} onChange={(e) => this.handleInstructionsChange('meals', e.target.value)}/>
                        <label htmlFor={`${this.state.name}_mealInstructions_${mealInstruction}`}>{mealInstruction}</label>
                      </p>
                    )}
                    Contraindications:
                    {['None', 'antibiotic', 'probiotic'].map(contraindicatedInstruction =>
                      <p key={contraindicatedInstruction}>
                        <input type="radio" name={`${this.state.name}_contraindications`} id={`${this.state.name}_contraindicatedInstructions_${contraindicatedInstruction}`} value={contraindicatedInstruction} checked={this.state.otherInstructions.contraindications === contraindicatedInstruction} onChange={(e) => this.handleInstructionsChange('contraindications', e.target.value)}/>
                        <label htmlFor={`${this.state.name}_contraindicatedInstructions_${contraindicatedInstruction}`}>{contraindicatedInstruction !== 'None' ? "Don't take within 3 hours of" : ''} {contraindicatedInstruction}</label>
                      </p>
                    )}
                    Custom:
                    <div className='container'>
                      <div className="input-field">
                        <textarea className="materialize-textarea" name={`${this.state.name}_userDefined`} id={`${this.state.name}_userDefinedInstructions`} value={this.state.otherInstructions.userDefined} onChange={(e) => this.handleInstructionsChange('userDefined', e.target.value)}></textarea>
                        <label className='active' htmlFor={`${this.state.name}_userDefinedInstructions`}>Specify</label>
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
                          <input type="radio" name={`${this.state.name}_treatmentType`} id={`${this.state.name}_type_${treatmentType}`} value={treatmentType} checked={this.state.info.type === treatmentType} onChange={(e) => this.handleInfoChange('type', e.target.value)}/>
                          <label htmlFor={`${this.state.name}_type_${treatmentType}`}>{treatmentType}</label>
                        </p>
                      )}
                      <div className="input-field inline">
                        <input name={`${this.state.name}_treatmentTypeOtherValue`} id={`${this.state.name}_otherType`} value={this.state.info.typeOtherValue} disabled={this.state.info.type !== 'Other'} onChange={(e) => this.handleInfoChange('typeOtherValue', e.target.value)} />
                        <label className='active' htmlFor={`${this.state.name}_otherType`}>Specify</label>
                      </div>
                    </div>
                    <div className='col l3'>
                      Category:
                      <div className="input-field">
                        <input name={`${this.state.name}_treatmentCategory`} value={this.state.info.category} placeholder='e.g. SSRI' onChange={(e) => this.handleInfoChange('category', e.target.value)} />
                      </div>
                    </div>
                    <div className='col l3'>
                      Used to treat:
                      <div className="input-field">
                        <input name={`${this.state.name}_usedToTreat`} value={this.state.info.usedToTreat} placeholder='e.g. Depression' onChange={(e) => this.handleInfoChange('usedToTreat', e.target.value)} />
                      </div>
                    </div>
                  </div>
              	</Collapsible>
              </div>
            </div> */}
          {/* </div>
        </div> */}
      </div>
    );
  }
};
