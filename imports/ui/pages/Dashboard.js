import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import { Session } from 'meteor/session';
import Collapsible from 'react-collapsible';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';
// import { Images } from '../../api/images';

import TasksBox from '../components/TasksBox';
import SymptomChart from '../components/SymptomChart';
import TreatmentChart from '../components/TreatmentChart';
import ProfileBackgroundModel from '../components/ProfileBackgroundModel';
import ProfileImageModel from '../components/ProfileImageModel';


// ToDo //

class Dashboard extends React.Component {
  render() {
    if (this.props.isFetching) {
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      );
    } else if (this.props.userSymptoms.length === 0 || this.props.userTreatments.length === 0) {
      return <Redirect to="/home" />
    } else if (this.props.userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0)) {
      return <Redirect to="/home/selecttreatments" />
    }
    return (
      <div className="">
        {this.props.userPhoto &&
          <div className='userPhoto__wrapper'>
            <img className='userPhoto' src={this.props.userPhoto} />
          </div>
        }
        {this.props.showProfileBackgroundModel && <ProfileBackgroundModel />}
        {this.props.showProfileImageModel && <ProfileImageModel />}
        <div className='dashboard-user-info' style={{backgroundImage: Meteor.user() ? `url(${Meteor.user().profile.backgroundURL})` : '' }}>
          <div className='dashboard-user-info__name'>
            {Meteor.user() && <h2>{Meteor.user().profile.firstName} {Meteor.user().profile.lastName}</h2>}
          </div>

          <TasksBox userSymptoms={this.props.userSymptoms} userTreatments={this.props.userTreatments} todayTreatments={this.props.todayTreatments}  />
        </div>

        <div className='dashboard-chart-section symptoms'>
          <div className=''>
            <div className='row'>
              <div className='col sm12 m3'>
                <div className="dashboard-chart-section__list">
                  <ol className='collection with-header z-depth-2'>
                    <li className="collection-header"><h5>My Symptoms:</h5></li>

                    {this.props.userSymptoms.map((symptom) => {
                      return (
                        <li className="collection-item" key={symptom._id} style={{background: symptom.color, color: 'white'}}>
                          <span className="">
                            {symptom.name}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
              <div className='col sm12 m9'>
                <div className="dashboard-chart-section__chart__wrapper z-depth-2">
                  <div className="dashboard-chart-section__chart">
                    {this.props.checkinHistory.checkins.length > 0 &&
                      <div>
                        <SymptomChart
                          symptomNames={this.props.userSymptoms.map(symptom => symptom.name)}
                          checkins={this.props.checkinHistory.checkins}
                          symptomColors={this.props.userSymptoms.map(symptom => symptom.color)}
                          height={120}
                          padding={{top: 40, right: 30, bottom: 20, left: 0}}
                        />
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className=''>
              <Link className="waves-effect waves-light blue btn" to="/home/selectsymptoms">Edit</Link>
              <Link className='waves-effect waves-light black btn' to="/home/history/symptoms">Full History</Link>
            </div>
          </div>
        </div>

        {/* <div className="row dashboard-chart-section treatments"> */}
        <div className="row dashboard-chart-section treatments">
          <div className='col s7'>
            <div className='treatment-chart__wrapper'>
              <TreatmentChart
                treatments={this.props.userTreatments}
                checkins={this.props.checkinHistory.checkins}
              />
            </div>
          </div>
          <div className='col s5'>
            <ul className='collection with-header z-depth-2'>
              <li className="collection-header"><h5>My Treatments:</h5></li>
              <div className="collection-item center-align">
                <button className={this.props.currentSelectedTreatmentTab === 'today' ? 'deep-purple btn' : 'grey btn'} onClick={() => Session.set('currentSelectedTreatmentTab', 'today')}>Today</button>
                <button className={this.props.currentSelectedTreatmentTab === 'all' ? 'deep-purple btn' : 'grey btn'} onClick={() => Session.set('currentSelectedTreatmentTab', 'all')}>All Treatments</button>
              </div>
              {this.props.displayedTreatments.length === 0 ?
                <li className='collection-item center-align'>No treatments are scheduled for today</li>
              : this.props.displayedTreatments.map((treatment) => {
                return (
                  //edit
                  <li className="collection-item" key={treatment._id}>
                  	<Collapsible trigger=
                      {
                        <div>
                          <h5 className="title deep-purple-text text-lighten-1">{treatment.name.charAt(0).toUpperCase() + treatment.name.slice(1)}</h5>
                          <span className=''>
                            { treatment.dosingFormat !== 'default' ?
                              `${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}`
                              :
                              `${treatment.amount} ${treatment.dose_type !== "pills" ? `x ${treatment.dose}${treatment.dose_type}` : treatment.amount === 1 ? "pill" : "pills"} ${treatment.frequency}/day`
                            }
                          </span>
                          {treatment.dosingFormat !== 'default' &&
                            <div>
                              {/* <h5 className="small grey-text text-darken-2">Dosing:</h5> */}
                              {treatment.dosingFormat === 'generalTimes' &&
                              <div>
                                {treatment.dosingDetails.generalDoses.map(dose => {
                                  if (dose.quantity > 0) {
                                    return <div className='grey-text text-darken-2' key={dose.time}>Take {dose.quantity} {dose.time === 'bedtime' ? 'at' : 'in the'} {dose.time}</div>
                                  }
                                })}
                              </div>
                              }
                              {treatment.dosingFormat === 'specificTimes' &&
                              <div>
                                {treatment.dosingDetails.specificDoses.map(dose => {
                                  if (dose.quantity > 0) {
                                    return <div className='grey-text text-darken-2' key={dose.time}>Take {dose.quantity} at {moment(dose.time).format('h:mm a')}</div>
                                  }
                                })}
                              </div>
                              }
                              {treatment.dosingFormat === 'byHours' &&
                              <div>
                                {(treatment.dosingDetails.hourlyDose.hourInterval > 0 && treatment.dosingDetails.hourlyDose.quantity > 0) &&
                                  <div className='grey-text text-darken-2'>Take {treatment.dosingDetails.hourlyDose.quantity} every {treatment.dosingDetails.hourlyDose.hourInterval == 1 ? 'hour' : treatment.dosingDetails.hourlyDose.hourInterval + ' hours'}</div>
                                }
                              </div>
                              }
                              {treatment.dosingFormat === 'prn' &&
                              <div>
                                {(treatment.dosingDetails.prnDose.hourInterval > 0 && treatment.dosingDetails.prnDose.quantity > 0) &&
                                  <div className='grey-text text-darken-2'>Take up to {treatment.dosingDetails.prnDose.quantity} every {treatment.dosingDetails.prnDose.hourInterval == 1 ? 'hour' : treatment.dosingDetails.prnDose.hourInterval + ' hours'}</div>
                                }
                              </div>
                              }
                              {treatment.dosingFormat === 'other' &&
                              <div>
                                <div className='grey-text text-darken-2'>  {treatment.dosingDetails.other.dosingInstructions}</div>
                              </div>
                              }
                            </div>
                          }
                        </div>
                      }
                    >
                      <div>
                        <h5 className="grey-text text-darken-2">Dates:</h5>
                        <div>
                          {(treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.length === 7) ?
                            <div>Every Day</div>
                            :
                            (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.length !== 7) ?
                            <div>{treatment.daysOfWeek.map((dayOfWeek, index, array) => <span key={dayOfWeek}>{dayOfWeek}{index !== array.length - 1 ? ', ' : ''}</span>)}</div>
                            :
                            (treatment.dateSelectMode === 'date range' && treatment.daysOfWeek.length === 7) ?
                            <div>Every day <span className='grey-text text-darken-3'>(from {moment(treatment.startDateValue).format('MMM Do YY')} to {moment(treatment.endDateValue).format('MMM Do YY')})</span></div>
                            :
                            (treatment.dateSelectMode === 'date range' && treatment.daysOfWeek.length !== 7) ?
                            <div>
                              {treatment.daysOfWeek.map((dayOfWeek, index, array) => <span key={dayOfWeek}>{dayOfWeek}{index !== array.length - 1 ? ', ' : ''}</span>)}
                              <div className='grey-text text-darken-3'>(from {moment(treatment.startDateValue).format('MMM Do YY')} to {moment(treatment.endDateValue).format('MMM Do YY')})</div>
                            </div>
                            :
                            <div>{treatment.individualDateValues.sort((a, b) => a - b).map(dateValue => <div key={dateValue}>{moment(dateValue).format('MM-DD-YY')} </div>)}</div>
                          }
                        </div>
                        {(treatment.otherInstructions.meals !== 'None' || treatment.otherInstructions.contraindications !== 'None' || treatment.otherInstructions.userDefined.trim()) &&
                          <div>
                            <h5 className="grey-text text-darken-2">Instructions:</h5>
                            {Object.entries(treatment.otherInstructions).map(([instructionCategory, instructionValue]) => {
                              if (instructionCategory === 'meals' && instructionValue !== 'None') {
                                return (
                                  <div key={instructionCategory}>{instructionCategory.charAt(0).toUpperCase() + instructionCategory.slice(1)}:
                                    <pre>  {instructionValue}</pre>
                                  </div>
                                );
                              } if (instructionCategory === 'contraindications' && instructionValue !== 'None') {
                                return (
                                  <div key={instructionCategory}>{instructionCategory.charAt(0).toUpperCase() + instructionCategory.slice(1)}:
                                    <pre>  {`Don't take within 3 hours of ${instructionValue}`}</pre>
                                  </div>
                                );
                              } else if (instructionCategory === 'userDefined' && instructionValue.trim()) {
                                return (
                                  <div key={instructionCategory}>Other:
                                    <pre>  {instructionValue}</pre>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        }
                        {(treatment.info.type !== 'N/A' || treatment.info.category.trim() || treatment.info.usedToTreat.trim()) &&
                          <div className='section'>
                            <h5 className="grey-text text-darken-2">Treatment Info:</h5>
                            {Object.entries(treatment.info).map(([infoCategory, infoValue]) => {
                              if (infoCategory === 'type' && infoValue !== 'N/A') {
                                if (infoValue === 'Other') {
                                  return (
                                    <div key={infoCategory}>{infoCategory.charAt(0).toUpperCase() + infoCategory.slice(1)}:
                                      <pre>  {treatment.info.typeOtherValue.trim() ? treatment.info.typeOtherValue.charAt(0).toUpperCase() + treatment.info.typeOtherValue.slice(1) : 'Other'}</pre>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div key={infoCategory}>{infoCategory.charAt(0).toUpperCase() + infoCategory.slice(1)}:
                                      <pre>  {infoValue.trim() ? infoValue : infoCategory}</pre>
                                    </div>
                                  );
                                }
                              } else if (infoCategory !== 'typeOtherValue' && infoValue !== 'N/A' && infoValue.trim()) {
                                return (
                                  <div key={infoCategory}>{infoCategory === 'usedToTreat' ? 'Used to treat' : 'Category'}:
                                    <pre>  {infoValue.trim() ? infoValue : infoCategory}</pre>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        }
                      </div>
                    </Collapsible>
                  </li>
                );
              })}
            </ul>
            <div className='right'>
              <Link className="waves-effect waves-light blue btn" to="/home/selecttreatments">edit</Link>
              <Link className='waves-effect waves-light black btn' to="/home/history/treatments">Full History</Link>
            </div>
          </div>
        </div>

      </div>
    );
  }
};

export default createContainer(() => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');

  // edit
  const todayTreatments = UserTreatments.find().fetch().filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'date range' && (treatment.daysOfWeek.includes(moment().format('dddd')) && moment().isBetween(treatment.startDateValue, treatment.endDateValue)) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY')))));
  const currentSelectedTreatmentTab = Session.get('currentSelectedTreatmentTab') || 'today';
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    displayedTreatments: currentSelectedTreatmentTab === 'today' ? todayTreatments : UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!symptomsHandle.ready() || !treatmentsHandle.ready()),
    showProfileBackgroundModel: Session.get('showProfileBackgroundModel'),
    currentSelectedTreatmentTab,
    showProfileImageModel: Session.get('showProfileImageModel'),
    userPhoto: (Meteor.user() && Meteor.user().profile.userPhoto) ? Meteor.user().profile.userPhoto : undefined,
    todayTreatments

  };
}, Dashboard);
