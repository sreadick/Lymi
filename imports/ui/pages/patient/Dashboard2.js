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
import Loader from '/imports/ui/components/Loader';

const Dashboard2 = (props) => {
  if (props.isFetching) {
    return (
      // <div className="progress">
      //   <div className="indeterminate"></div>
      // </div>
      <Loader />
    );
  } else if (Meteor.user().account.status === 'initializing' || props.userSymptoms.length === 0 || (props.userTreatments.length === 0 && props.trackedItems.includes('treatments'))) {
    return <Redirect to="/patient" />
  } else if (props.userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0)) {
    return <Redirect to="/patient/selecttreatments" />
  }
  return (
    <div className="dashboard__page">
      <div className="dashboard__task-box z-depth-2">

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
}, Dashboard2);
