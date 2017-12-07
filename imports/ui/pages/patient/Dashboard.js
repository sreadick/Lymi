import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import { Session } from 'meteor/session';
import { capitalizePhrase, filterCurrentDayTreatments } from '../../../utils/utils';

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import TasksBox from '../../components/patient/TasksBox';
import SymptomChart from '../../components/patient/SymptomChart';
import TreatmentChart from '../../components/patient/TreatmentChart';
import ProfileBackgroundModel from '../../components/patient/ProfileBackgroundModel';
import ProfileImageModel from '../../components/patient/ProfileImageModel';
import Pagination from '../../components/patient/Pagination';
import TreatmentCollapsible from '../../components/patient/TreatmentCollapsible';

const Dashboard = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  } else if (Meteor.user().account.status === 'initializing' || props.userSymptoms.length === 0 || (props.userTreatments.length === 0 && props.trackedItems.includes('treatments'))) {
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

        <div className='dashboard-user-info__bottom-row'>
          <div className='tracked-items__wrapper'>
            <h5>Tracked Items:
              <Link to='/patient/account' className='right'>
                edit
              </Link>
            </h5>
            <ul className='tracked-items'>
              {props.trackedItems.map(trackedItem =>
                <li className='tracked-items__item-name' key={trackedItem}>
                  {trackedItem}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className='row grey lighten-4 dashboard-chart-section'>
        <div className='col sm12 m3'>
          <div className='row'>
            <div className="dashboard-chart-section__list">
              <ol className='collection with-header z-depth-2'>
                <li className="collection-header">
                  <h5>My Symptoms:
                    <div className='secondary-content'>
                      {props.checkinHistory.checkins.length > 0 &&
                        <Link className='waves-effect waves-light' to="/patient/history/symptoms"><i className='dashboard-chart-section__collection-header-icon black-text material-icons'>insert_chart</i></Link>
                      }
                      <Link className="waves-effect waves-light" to="/patient/selectsymptoms"><i className='dashboard-chart-section__collection-header-icon blue-text material-icons'>edit</i></Link>
                    </div>
                  </h5>
                </li>

                {props.userSymptoms.map((symptom) => {
                  return (
                    <li className="collection-item" key={symptom._id}
                      style={{
                        background: (!props.activeSegmentSymptoms || (props.activeSegmentSymptoms && props.activeSegmentSymptoms.find(groupedSymptom => groupedSymptom.name === symptom.name))) ? symptom.color : 'white',
                        color: (!props.activeSegmentSymptoms || (props.activeSegmentSymptoms && props.activeSegmentSymptoms.find(groupedSymptom => groupedSymptom.name === symptom.name))) ? 'white' : symptom.color,
                      }}>
                      <span className="">
                        {capitalizePhrase(symptom.name)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
        <div className='col sm12 m9'>
          <div className='row'>
            {/* <div className="dashboard-chart-section__chart__wrapper"> */}
              <div className="dashboard-chart-section__chart z-depth-2">
                {props.checkinHistory.checkins.length > 0 &&
                  // <div>
                    <SymptomChart
                      symptomNames={props.activeSegmentSymptoms ?
                        props.activeSegmentSymptoms.map(symptom => symptom.name)
                        :
                        props.userSymptoms.map(symptom => symptom.name)
                      }
                      checkins={props.checkinHistory.checkins}
                      symptomColors={props.activeSegmentSymptoms ?
                        props.activeSegmentSymptoms.map(symptom => symptom.color)
                        :
                        props.userSymptoms.map(symptom => symptom.color)
                      }
                      height={140}
                      padding={{top: 40, right: 30, bottom: 20, left: 0}}
                    />
                  // </div>
                }
              </div>
            {/* </div> */}
          </div>
          {props.userSymptoms.length > 3 &&
            <div className='row center-align'>
                <Pagination display='dashboard' activeSegmentNumber={props.activeSegmentNumber} totalNumSegments={Math.ceil(props.userSymptoms.length / 3)}/>
            </div>
          }
        </div>
      </div>

      {props.trackedItems.includes('treatments') &&
        // <div className="row dashboard-chart-section treatments">
        <div className="row dashboard-chart-section black">
          <div className='col sm12 m9'>
            <div className='row'>
              <div className='treatment-chart__wrapper z-depth-2'>
                {props.checkinHistory.checkins.length > 0 &&
                  <TreatmentChart
                    treatments={props.userTreatments}
                    checkins={props.checkinHistory.checkins}
                  />
                }
              </div>
            </div>
          </div>
          <div className='col sm12 m3'>
            <ul className='collection with-header z-depth-2'>
              <li className="collection-header">
                <h5>My Treatments:
                  <div className='secondary-content'>
                    {props.checkinHistory.checkins.length > 0 &&
                      <Link className='waves-effect waves-light' to="/patient/history/treatments"><i className='dashboard-chart-section__collection-header-icon black-text material-icons'>insert_chart</i></Link>
                    }
                    <Link className="waves-effect waves-light" to="/patient/selecttreatments"><i className='dashboard-chart-section__collection-header-icon blue-text material-icons'>edit</i></Link>
                  </div>
                </h5>
              </li>

              {props.userTreatments.map((treatment) => {
                return (
                  <TreatmentCollapsible
                    key={treatment._id}
                    treatment={treatment}
                    takeTreatmentToday={!!props.todayTreatments.find(todayTreatment => todayTreatment._id === treatment._id)}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      }
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

  // const todayTreatments = userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'date range' && (treatment.daysOfWeek.includes(moment().format('dddd')) && moment().isBetween(treatment.startDateValue, treatment.endDateValue)) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY')))));
  const todayTreatments = filterCurrentDayTreatments(userTreatments);
  // const currentSelectedTreatmentTab = Session.get('currentSelectedTreatmentTab') || 'today';

  const currentDate = moment().format('MMMM Do YYYY');
  const todaysCheckin = (checkinHandle.ready() && checkinHistory) ? checkinHistory.checkins.find((checkin) => checkin.date === currentDate) : undefined;

  const trackedItems = Meteor.user().profile.settings.trackedItems;

  let dailyCheckinStatus;
  if ((checkinHandle.ready() && todaysCheckin) && (userSymptoms.every(userSymptom => todaysCheckin.symptoms.find(checkinSymptom => (checkinSymptom.name === userSymptom.name && checkinSymptom.severity > 0))) && (todayTreatments.every(userTreatment => todaysCheckin.treatments.find(checkinTreatment => (checkinTreatment.name === userTreatment.name && checkinTreatment.compliance !== null))) || !trackedItems.includes('treatments')))) {
    dailyCheckinStatus = 'complete';
  } else if ((checkinHandle.ready() && todaysCheckin) && (userSymptoms.some(userSymptom => todaysCheckin.symptoms.find(checkinSymptom => (checkinSymptom.name === userSymptom.name && checkinSymptom.severity > 0))) || (todayTreatments.some(userTreatment => todaysCheckin.treatments.find(checkinTreatment => (checkinTreatment.name === userTreatment.name && checkinTreatment.compliance !== null))) || !trackedItems.includes('treatments')))) {
    dailyCheckinStatus = 'partially complete';
  } else {
    dailyCheckinStatus = 'incomplete';
  }
  const activeSegmentNumber = userSymptoms.length > 3 ? (Session.get('activeSegmentNumber_dashboard') || 1) : undefined;
  return {
    userSymptoms,
    userTreatments,
    checkinHistory,
    dailyCheckinStatus,
    // displayedTreatments: currentSelectedTreatmentTab === 'today' ? todayTreatments : userTreatments,
    isFetching: (!symptomsHandle.ready() || !treatmentsHandle.ready() || !checkinHandle.ready() || !Meteor.user()),
    // currentSelectedTreatmentTab,
    activeSegmentNumber,
    activeSegmentSymptoms: activeSegmentNumber ? userSymptoms.slice((activeSegmentNumber - 1) * 3, activeSegmentNumber * 3) : undefined,
    userPhoto: (Meteor.user() && Meteor.user().profile.userPhoto) ? Meteor.user().profile.userPhoto : undefined,
    todayTreatments,
    trackedItems

  };
}, Dashboard);
