import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import ReactTooltip from 'react-tooltip'
import { Session } from 'meteor/session';
import { capitalizePhrase, filterCurrentDayTreatments, getTasks, getColor, getExtendedTreatmentHistory } from '../../../utils/utils';

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import TasksBox2 from '../../components/patient/TasksBox2';
import SymptomChart from '../../components/patient/SymptomChart';
import TreatmentChart from '../../components/patient/TreatmentChart2';
import NotableEvents from '../../components/patient/NotableEvents';
import DoctorSearch from '../../components/patient/DoctorSearch';

// import ProfileBackgroundModel from '../../components/patient/ProfileBackgroundModel';
// import ProfileImageModel from '../../components/patient/ProfileImageModel';
// import Pagination from '../../components/patient/Pagination';
import TreatmentCollapsible from '../../components/patient/TreatmentCollapsible';
import Loader from '/imports/ui/components/Loader';

const Dashboard2 = (props) => {
  if (props.isFetching) {
    return (
      // <div className="progress">
      //   <div className="indeterminate"></div>
      // </div>
      <Loader />
    );
  } else if (props.userInfo.account.status === 'initializing' || props.userSymptoms.length === 0 || (props.userTreatments.length === 0 && props.trackedItems.includes('treatments'))) {
    return <Redirect to="/patient" />
  } else if (props.userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0)) {
    return <Redirect to="/patient/selecttreatments" />
  }
  // console.log(props.userSymptoms.filter(symptom => symptom.system === props.activeSegmentSymptoms));
  // console.log(props.userSymptoms);
  // console.log(props.activeSegmentSymptoms);
  return (
    <div className="dashboard__page">
      { props.showDoctorSearch && <DoctorSearch /> }
      <div className="dashboard__flex-wrapper">
        <div className="dashboard__page__content">

          <div className='dashboard__section z-depth-2'>

            <div className="dashboard__list__container">
              <div className='dashboard__list__header'>
                <h5>My Symptoms:</h5>
                <Link
                  className=""
                  to="/patient/selectsymptoms"
                  data-tip data-for='editSymptoms'>
                  <i className='blue-text material-icons'>
                    edit
                  </i>
                </Link>
                <ReactTooltip id='editSymptoms' effect='solid'>
                  Edit Symptoms
                </ReactTooltip>
              </div>
              <ul className='dashboard__list'>
                {props.userSymptoms.map((symptom) => {
                  return (
                    <li className="dashboard__list__item" key={symptom._id}>
                      <span className="">
                        {capitalizePhrase(symptom.name)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="dashboard__chart__container">
              {props.checkins.length > 0 &&
                <div className="dashboard__chart__header">
                  <span className=''>
                    Past {props.checkins.length > 13 ? 14 : props.checkins.length} {props.checkins.length === 1 ? 'Day' : 'Days'}
                  </span>
                  <Link
                    to="/patient/history/symptoms"
                    data-tip data-for='fullSymptomHistory'>
                    <i className='black-text material-icons'>
                      insert_chart
                    </i>
                  </Link>
                  <ReactTooltip id='fullSymptomHistory' effect='solid'>
                    Full Symptom History
                  </ReactTooltip>
                </div>
              }
              <div className="dashboard__chart">
                {props.checkins.length > 0 &&
                  <SymptomChart
                    symptomNames={props.userSymptoms.filter(symptom => symptom.system === props.activeSymptomGroup).map(symptom => symptom.name)}
                    checkins={props.checkins.length > 13 ? props.checkins.slice(-14) : props.checkins}
                    symptomColors={props.userSymptoms.filter(symptom => symptom.system === props.activeSymptomGroup).map((symptom, index) => getColor(index))}
                    height={100}
                    // padding={{top: 0, right: 15, bottom: 10, left: 0}}
                    padding={{top: 0, right: 15, bottom: 10, left: 0}}
                  />
                  // {/* <SymptomChart
                  //   symptomNames={props.activeSegmentSymptoms ?
                  //     props.activeSegmentSymptoms.map(symptom => symptom.name)
                  //     :
                  //     props.userSymptoms.map(symptom => symptom.name)
                  //   }
                  //   checkins={props.checkins}
                  //   symptomColors={props.activeSegmentSymptoms ?
                  //     props.activeSegmentSymptoms.map(symptom => symptom.color)
                  //     :
                  //     props.userSymptoms.map(symptom => symptom.color)
                  //   }
                  //   height={100}
                  //   padding={{top: 20, right: 15, bottom: 10, left: 0}}
                  // /> */}
                }
              </div>
              <div className="dashboard__chart__symptom-group__list">
                {props.userSymptomGroups.map((symptomGroup) => {
                  return (
                    <ul
                      key={symptomGroup}
                      className={`dashboard__chart__symptom-group ${props.activeSymptomGroup === symptomGroup && 'active'}`}
                      onClick={() => Session.set('activeSymptomGroup', symptomGroup)}>
                      <span className='dashboard__chart__symptom-group__title'>{symptomGroup}</span>
                      {props.userSymptoms.filter(symptom => symptom.system === symptomGroup).map((symptom, index) =>
                        <li
                          key={symptom._id}
                          className='dashboard__chart__symptom-group__symptom'
                          style={{color: symptom.system === props.activeSymptomGroup ? getColor(index) : '#333'}}>
                          {capitalizePhrase(symptom.name)}
                        </li>
                      )}
                    </ul>
                  );
                })}
              </div>
            </div>

          </div>


          {props.trackedItems.includes('treatments') &&
            <div className='dashboard__section z-depth-2'>
              <div className="dashboard__list__container">
                <div className='dashboard__list__header'>
                  <h5>My Treatments:</h5>
                  <Link
                    className=""
                    to="/patient/selecttreatments"
                    data-tip data-for='editTreatments'>
                    <i className='blue-text material-icons'>
                      edit
                    </i>
                  </Link>
                  <ReactTooltip id='editTreatments' effect='solid'>
                    Edit Treatments
                  </ReactTooltip>
                </div>

                <ul className='collection dashboard__list'>
                  {props.userTreatments.map((treatment) =>
                    <TreatmentCollapsible
                      key={treatment._id}
                      treatment={treatment}
                      takeTreatmentToday={!!props.todayTreatments.find(todayTreatment => todayTreatment._id === treatment._id)}
                    />
                  )}
                </ul>
              </div>
              <div className='dashboard__chart__container'>
                {props.checkins.length > 0 &&
                  <div className="dashboard__chart__header dashboard__chart__header--treatments">
                    <span className=''>
                      Past {props.extendedTreatmentCheckins.length > 13 ? 14 : props.extendedTreatmentCheckins.length} {props.extendedTreatmentCheckins.length === 1 ? 'Day' : 'Days'}
                    </span>
                    <Link
                      to="/patient/history/treatments"
                      data-tip data-for='fullTreatmentHistory'>
                      <i className='black-text material-icons'>
                        insert_chart
                      </i>
                    </Link>
                    <ReactTooltip id='fullTreatmentHistory' effect='solid'>
                      Full Treatment History
                    </ReactTooltip>
                  </div>
                }
                {props.extendedTreatmentCheckins.length > 0 &&
                  <TreatmentChart
                    treatments={props.userTreatments}
                    currentTreatmentNames={props.userTreatments.map(treatment => treatment.name)}
                    checkins={props.extendedTreatmentCheckins.length > 13 ? props.extendedTreatmentCheckins.slice(-14) : props.extendedTreatmentCheckins}
                    // checkins={props.extendedTreatmentCheckins}
                  />
                }
              </div>
            </div>
          }

          {props.trackedItems.includes('notable events') &&
            <div className='dashboard__section z-depth-2'>
              <div className="dashboard__list__container">
                <div className='dashboard__list__header'>
                  <h5>Notable Events:</h5>
                </div>
                {props.notableEventCheckins.length > 0 &&
                  <ul className='dashboard__list'>
                    <li className="dashboard__list__item">
                      {props.notableEventCheckins.length} {props.notableEventCheckins.length === 1 ? "Event" : "Events"} Recorded
                    </li>
                  </ul>
                }

              </div>
              <div className='dashboard__chart__container'>
                {props.notableEventCheckins.length > 0 ?
                  <NotableEvents checkins={props.notableEventCheckins}/>
                :
                  <p>No Events Recorded</p>
                }
              </div>
            </div>
          }

        </div>

        <div className="task-box__container z-depth-1">
          <TasksBox2
            userInfo={props.userInfo}
            userSymptoms={props.userSymptoms}
            userTreatments={props.userTreatments}
            checkins={props.checkins}/>
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

  const userInfo = Meteor.user();

  const checkins = checkinHandle.ready() ? checkinHistory.checkins : [];

  // const todayTreatments = userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'date range' && (treatment.daysOfWeek.includes(moment().format('dddd')) && moment().isBetween(treatment.startDateValue, treatment.endDateValue)) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY')))));
  const todayTreatments = filterCurrentDayTreatments(userTreatments);
  // const currentSelectedTreatmentTab = Session.get('currentSelectedTreatmentTab') || 'today';

  const currentDate = moment().format('MMMM Do YYYY');
  const todaysCheckin = (checkinHandle.ready() && checkinHistory) ? checkins.find((checkin) => checkin.date === currentDate) : undefined;

  const trackedItems = userInfo.profile.settings.trackedItems;

  const activeSegmentNumber = userSymptoms.length > 3 ? (Session.get('activeSegmentNumber_dashboard') || 1) : undefined;

  let userSymptomGroups = [];
  userSymptoms.forEach((symptom) => {
    if (!userSymptomGroups.includes(symptom.system)) {
      userSymptomGroups.push(symptom.system);
    }
  })
  userSymptomGroups.sort((symptomSystemA, symptomSystemB) => {
    const GroupALength = userSymptoms.filter(symptom => symptom.system === symptomSystemA).length;
    const GroupBLength = userSymptoms.filter(symptom => symptom.system === symptomSystemB).length;
    return GroupALength - GroupBLength;
  })

  return {
    userSymptoms,
    activeSymptomGroup: Session.get('activeSymptomGroup') || (symptomsHandle.ready() && userSymptomGroups[0]),
    userTreatments,
    // checkinHistory,
    checkins,
    // displayedTreatments: currentSelectedTreatmentTab === 'today' ? todayTreatments : userTreatments,
    // currentSelectedTreatmentTab,
    activeSegmentNumber,
    activeSegmentSymptoms: activeSegmentNumber ? userSymptoms.slice((activeSegmentNumber - 1) * 3, activeSegmentNumber * 3) : undefined,
    userPhoto: (userInfo && userInfo.profile.userPhoto) ? userInfo.profile.userPhoto : undefined,
    todayTreatments,
    trackedItems,
    userSymptomGroups,
    extendedTreatmentCheckins: (treatmentsHandle.ready() && checkinHandle.ready() && checkins.length > 0) ? getExtendedTreatmentHistory(userTreatments, checkins) : [],
    notableEventCheckins: checkins.filter(checkin => !!checkin.notableEvents),
    showDoctorSearch: Session.get('showDoctorSearch') || false,
    userInfo,
    isFetching: (!symptomsHandle.ready() || !treatmentsHandle.ready() || !checkinHandle.ready() || !userInfo)
  };
}, Dashboard2);
