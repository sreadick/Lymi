import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { Session } from 'meteor/session';
import { capitalizePhrase, filterCurrentDayTreatments, getColor, getExtendedSymptomHistory, getExtendedTreatmentHistory, getExtendedHistory } from '../../../utils/utils';

import { UserSymptoms } from '/imports/api/user-symptoms';
import { UserTreatments } from '/imports/api/user-treatments';
import { CheckinHistories } from '/imports/api/checkin-histories';

import SymptomChart from './SymptomChart';
import SymptomChart2 from './charts/SymptomChart2';
import TreatmentChart2 from './TreatmentChart2';
import TreatmentChart3 from './charts/TreatmentChart3';
import TreatmentCollapsible from './TreatmentCollapsible';
import Loader from '../Loader';

const SxRxDisplay = (props) => {
  if (props.isFetching) {
    return (
      <div className="">
        <Loader />
      </div>
    );
  }
  return (
    <div className='z-depth-2'>
      <div className='dashboard__section dashboard__section--SxRx'>
        <div className="dashboard__chart__symptom-group__list">
          {props.userSymptomGroups.map((symptomGroup, index, array) => {
            return (
              <ul
                key={symptomGroup}
                className={`dashboard__chart__symptom-group ${(array.length - 1 === index && (index + 1) % 3 !== 1) && 'stretch'} ${props.activeSymptomGroup === symptomGroup && 'active'}`}
                onClick={() => Session.set('activeSymptomGroup', symptomGroup)}>
                <span className='dashboard__chart__symptom-group__title'>{symptomGroup}</span>
                {props.userSymptoms.filter(symptom => symptom.system === symptomGroup).map((symptom, index) =>
                  <li
                    key={symptom._id}
                    className='dashboard__chart__symptom-group__symptom'
                    style={{color: symptom.system === props.activeSymptomGroup ? symptom.color : '#333'}}>
                    {capitalizePhrase(symptom.name)}
                  </li>
                )}
              </ul>
            );
          })}
        </div>

        <div className="dashboard__chart__container">
          {props.checkins.length > 0 &&
            <div className="dashboard__chart__header">
              <span className=''>
                { props.modifiedSymptomCheckins.length >= 14 ? 'Past 2 Weeks'
                  :
                  `Past ${props.modifiedSymptomCheckins.length} ${props.modifiedSymptomCheckins.length === 1 ? 'Day' : 'Days'}`
                }
              </span>
              <Link
                to="/patient/history"
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
                checkins={props.modifiedSymptomCheckins}
                symptomColors={props.userSymptoms.filter(symptom => symptom.system === props.activeSymptomGroup).map(symptom => symptom.color)}
                height={125}
                // padding={{top: 0, right: 0, bottom: 10, left: 0}}
              />
              // <div className='jklsz'>
              //   <SymptomChart2
              //     checkins={props.modifiedSymptomCheckins}
              //       symptomNames={props.userSymptoms.filter(symptom => symptom.system === props.activeSymptomGroup).map(symptom => symptom.name)}
              //
              //     symptomColors={props.userSymptoms.filter(symptom => symptom.system === props.activeSymptomGroup).map(symptom => symptom.color)}
              //   />
              // </div>
            }
          </div>
        </div>
      </div>


      {props.trackedItems.includes('treatments') &&
        <div className='dashboard__section'>
          <div className="dashboard__list__container">
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
            {props.extendedCheckins.length > 0 &&
              <TreatmentChart2
                treatments={props.userTreatments}
                currentTreatmentNames={props.userTreatments.map(treatment => treatment.name)}
                checkins={props.extendedCheckins.length > 13 ? props.extendedCheckins.slice(-14) : props.extendedCheckins}
                showLabels={false}
              />
              // <div className='bhgjs'>
              //   <TreatmentChart3
              //     treatments={props.userTreatments}
              //     treatmentNames={props.userTreatments.map(treatment => treatment.name)}
              //     checkins={props.extendedTreatmentCheckins.length > 13 ? props.extendedTreatmentCheckins.slice(-14) : props.extendedTreatmentCheckins}
              //   />
              // </div>
            }
          </div>
        </div>
      }
    </div>
  );
}

export default createContainer(() => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');

  const checkinHistory =  CheckinHistories.findOne();
  const userTreatments = UserTreatments.find().fetch();
  const userSymptoms =  UserSymptoms.find().fetch();

  const userInfo = Meteor.user();

  const checkins = checkinHandle.ready() ? checkinHistory.checkins : [];

  const todayTreatments = filterCurrentDayTreatments(userTreatments);

  const currentDate = moment().format('MMMM Do YYYY');
  const todaysCheckin = (checkinHandle.ready() && checkinHistory) ? checkins.find((checkin) => checkin.date === currentDate) : undefined;

  const trackedItems = userInfo.profile.settings.trackedItems;

  // const activeSegmentNumber = userSymptoms.length > 3 ? (Session.get('activeSegmentNumber_dashboard') || 1) : undefined;
  userSymptoms.sort((symptomA, symptomB) => {
    if (symptomA.system < symptomB.system) {
      return -1;
    }
    if (symptomA.system > symptomB.system) {
      return 1;
    }
    return 0;
  });

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
    userSymptoms: userSymptoms.map((symptom, index) => (
      {
        ...symptom,
        color: getColor(index)
      }
    )),
    activeSymptomGroup: Session.get('activeSymptomGroup') || (symptomsHandle.ready() && userSymptomGroups[0]),
    userTreatments,
    checkins,
    // activeSegmentNumber,
    // activeSegmentSymptoms: activeSegmentNumber ? userSymptoms.slice((activeSegmentNumber - 1) * 3, activeSegmentNumber * 3) : undefined,
    todayTreatments,
    trackedItems,
    userSymptomGroups,
    // extendedTreatmentCheckins: (treatmentsHandle.ready() && checkinHandle.ready() && checkins.length > 0) ? getExtendedTreatmentHistory(userTreatments, checkins) : [],
    modifiedSymptomCheckins: (symptomsHandle.ready() && checkinHandle.ready() && checkins.length > 0) ? getExtendedSymptomHistory(userSymptoms, checkins) : [],

    // extendedCheckins: (treatmentsHandle.ready() && checkinHandle.ready() && checkins.length > 0) ? getExtendedHistory(userTreatments, checkins) : [],
    extendedCheckins: (symptomsHandle.ready() && treatmentsHandle.ready() && checkinHandle.ready() && checkins.length > 0) ? getExtendedHistory(userSymptoms, userTreatments, checkins) : [],
    userInfo,
    isFetching: (!symptomsHandle.ready() || !treatmentsHandle.ready() || !checkinHandle.ready() || !userInfo)
  };
}, SxRxDisplay);
