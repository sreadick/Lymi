import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import { Session } from 'meteor/session';
import Collapsible from 'react-collapsible';

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import TasksBox from '../../components/patient/TasksBox';
import SymptomChart from '../../components/patient/SymptomChart';
import TreatmentChart from '../../components/patient/TreatmentChart';
import ProfileBackgroundModel from '../../components/patient/ProfileBackgroundModel';
import ProfileImageModel from '../../components/patient/ProfileImageModel';

const Dashboard = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  } else if (props.userSymptoms.length === 0 || props.userTreatments.length === 0) {
    return <Redirect to="/patient" />
  } else if (props.userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0)) {
    return <Redirect to="/patient/selecttreatments" />
  }
  return (
    <div className="">
      <div className='dashboard-user-info' style={{backgroundImage: Meteor.user() ? `url(${Meteor.user().profile.backgroundURL})` : '' }}>
        <div className='dashboard-user-info__top-row valign-wrapper'>
          <div>
            {props.userPhoto &&
              <div className='userPhoto__wrapper'>
                <img className='userPhoto' src={props.userPhoto} />
              </div>
            }
          </div>
          <div className='dashboard-user-info__name'>
            {Meteor.user() && <div>{Meteor.user().profile.firstName} {Meteor.user().profile.lastName}</div>}
          </div>
          <div className=''>
            {
              props.dailyCheckinStatus === 'complete' &&
              <div className="">
                <div className='white-text right'>{`Last checked in ${moment(props.checkinHistory.lastCheckin).fromNow()}`}</div>
                <Link
                  className="waves-effect waves-light indigo darken-1 btn right"
                  to={{
                    pathname: "/patient/checkin",
                    state: {
                      checkinDate: moment().format('MMMM Do YYYY'),
                      symptoms: props.userSymptoms,
                      treatments: props.userTreatments
                    },
                  }}>
                  Edit check-in
                </Link>
              </div>
            }
          </div>
        </div>

        <TasksBox userSymptoms={props.userSymptoms} userTreatments={props.userTreatments} todayTreatments={props.todayTreatments} dailyCheckinStatus={props.dailyCheckinStatus} />
      </div>

      <div className='dashboard-chart-section symptoms'>
        <div className=''>
          <div className='row'>
            <div className='col sm12 m3'>
              <div className="dashboard-chart-section__list">
                <ol className='collection with-header z-depth-2'>
                  <li className="collection-header"><h5>My Symptoms:</h5></li>

                  {props.userSymptoms.map((symptom) => {
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
                  {props.checkinHistory.checkins.length > 0 &&
                    <div>
                      <SymptomChart
                        symptomNames={props.userSymptoms.map(symptom => symptom.name)}
                        checkins={props.checkinHistory.checkins}
                        symptomColors={props.userSymptoms.map(symptom => symptom.color)}
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
            <Link className="waves-effect waves-light blue btn" to="/patient/selectsymptoms">Edit</Link>
            {props.checkinHistory.checkins.length > 0 &&
              <Link className='waves-effect waves-light black btn' to="/patient/history/symptoms">Full History</Link>
            }
          </div>
        </div>
      </div>

      {/* <div className="row dashboard-chart-section treatments"> */}
      <div className="row dashboard-chart-section treatments">
        <div className='col s7'>
          <div className='treatment-chart__wrapper'>
            {props.checkinHistory.checkins.length > 0 &&
              <TreatmentChart
                treatments={props.userTreatments}
                checkins={props.checkinHistory.checkins}
              />
            }
          </div>
        </div>
        <div className='col s5'>
          <ul className='collection with-header z-depth-2'>
            <li className="collection-header"><h5>My Treatments:</h5></li>
            <div className="collection-item center-align">
              <button className={props.currentSelectedTreatmentTab === 'today' ? 'deep-purple btn' : 'grey btn'} onClick={() => Session.set('currentSelectedTreatmentTab', 'today')}>Today</button>
              <button className={props.currentSelectedTreatmentTab === 'all' ? 'deep-purple btn' : 'grey btn'} onClick={() => Session.set('currentSelectedTreatmentTab', 'all')}>All Treatments</button>
            </div>
            {props.displayedTreatments.length === 0 ?
              <li className='collection-item center-align'>No treatments are scheduled for today</li>
            : props.displayedTreatments.map((treatment) => {
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
            <Link className="waves-effect waves-light blue btn" to="/patient/selecttreatments">edit</Link>
            {props.checkinHistory.checkins.length > 0 &&
              <Link className='waves-effect waves-light black btn' to="/patient/history/treatments">Full History</Link>
            }
          </div>
        </div>
      </div>

    </div>
  );
};

export default createContainer(() => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');

  const checkinHistory =  CheckinHistories.findOne();
  const userTreatments = UserTreatments.find().fetch();
  const userSymptoms =  UserSymptoms.find().fetch();

  const todayTreatments = userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'date range' && (treatment.daysOfWeek.includes(moment().format('dddd')) && moment().isBetween(treatment.startDateValue, treatment.endDateValue)) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY')))));
  const currentSelectedTreatmentTab = Session.get('currentSelectedTreatmentTab') || 'today';

  const currentDate = moment().format('MMMM Do YYYY');
  const todaysCheckin = (checkinHandle.ready() && checkinHistory) ? checkinHistory.checkins.find((checkin) => checkin.date === currentDate) : undefined;

  let dailyCheckinStatus;
  if ((checkinHandle.ready() && todaysCheckin) && (userSymptoms.every(userSymptom => todaysCheckin.symptoms.find(checkinSymptom => (checkinSymptom.name === userSymptom.name && checkinSymptom.severity > 0))) && todayTreatments.every(userTreatment => todaysCheckin.treatments.find(checkinTreatment => (checkinTreatment.name === userTreatment.name && checkinTreatment.compliance !== null))))) {
    dailyCheckinStatus = 'complete';
  } else if ((checkinHandle.ready() && todaysCheckin) && (userSymptoms.some(userSymptom => todaysCheckin.symptoms.find(checkinSymptom => (checkinSymptom.name === userSymptom.name && checkinSymptom.severity > 0))) || todayTreatments.some(userTreatment => todaysCheckin.treatments.find(checkinTreatment => (checkinTreatment.name === userTreatment.name && checkinTreatment.compliance !== null))))) {
    dailyCheckinStatus = 'partially complete';
  } else {
    dailyCheckinStatus = 'incomplete';
  }
  return {
    userSymptoms,
    userTreatments,
    checkinHistory,
    dailyCheckinStatus,
    displayedTreatments: currentSelectedTreatmentTab === 'today' ? todayTreatments : userTreatments,
    isFetching: (!symptomsHandle.ready() || !treatmentsHandle.ready() || !checkinHandle.ready() || !Meteor.user()),
    currentSelectedTreatmentTab,
    userPhoto: (Meteor.user() && Meteor.user().profile.userPhoto) ? Meteor.user().profile.userPhoto : undefined,
    todayTreatments

  };
}, Dashboard);