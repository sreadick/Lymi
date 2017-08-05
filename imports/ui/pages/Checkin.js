import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';

import SymptomsCheckin from './SymptomsCheckin';
import TreatmentsCheckin from './TreatmentsCheckin';

const Checkin = (props) => {
  if (props.isFetching) {
    return <div></div>
  } else if (CheckinHistories.findOne().dailyCompleted === true) {
    return <Redirect to="/home"/>
  }
  return (
    <div className="checkin-item__container">
      <div className="ui center aligned large black header">Check in for {moment().format('MMMM Do YYYY')}</div>
      <Switch>
        <Route exact path="/home/checkin/symptoms" render={() => {
          return <SymptomsCheckin symptomCheckinItems={props.symptomCheckinItems} {...props} />
        }} />
        <Route exact path="/home/checkin/treatments" render={() => {
          return <TreatmentsCheckin treatmentCheckinItems={props.treatmentCheckinItems} {...props} />
        }} />
        <Route exact path="/home/checkin" render={() => {
          return <Redirect to="/home/checkin/symptoms" />
        }} />
      </Switch>
      {/* <Link to="/home/checkin/symptoms">symptoms</Link>
      <Link to="/home/checkin/treatments">treatments</Link> */}
    </div>
  );
};

export default createContainer(() => {

  Meteor.subscribe('userSymptoms');
  Meteor.subscribe('userTreatments')
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  const currentDate = moment().format('MMMM Do YYYY');
  let todaysCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;

  return {
    symptomCheckinItems: todaysCheckin ? todaysCheckin.symptoms : [],
    treatmentCheckinItems: todaysCheckin ? todaysCheckin.treatments : [],
    isFetching: !checkinHistoryIsReady,
    checkinHistoryIsReady
  }
}, Checkin)
