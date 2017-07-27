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

const Checkin = (props) => (
  <div className="ui container">
    <h2 className="ui center aligned large black header">Check in for {moment().format('MMMM Do YYYY')}</h2>
    <Switch>
      <Route exact path="/home/checkin/symptoms" render={() => {
        return <SymptomsCheckin symptomCheckinItems={props.symptomCheckinItems} />
      }} />
      <Route exact path="/home/checkin/treatments" render={() => {
        return <TreatmentsCheckin treatmentCheckinItems={props.treatmentCheckinItems} />
      }} />
    </Switch>
    <Link to="/home/checkin/symptoms">symptoms</Link>
    <Link to="/home/checkin/treatments">treatments</Link>
  </div>
)

export default createContainer(() => {
  Meteor.subscribe('userSymptoms');
  Meteor.subscribe('userTreatments')
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const currentDate = moment().format('MMMM Do YYYY');
  let todaysCheckin = checkinHandle.ready() ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;

  if (checkinHandle.ready() && !todaysCheckin) {
    Meteor.call('checkinHistories.addCheckin', {
      date: currentDate,
      symptoms: UserSymptoms.find().fetch(),
      treatments: UserTreatments.find().fetch(),
    })
  }

  return {
    symptomCheckinItems: todaysCheckin ? todaysCheckin.symptoms : [],
    treatmentCheckinItems: todaysCheckin ? todaysCheckin.treatments : []
  }
}, Checkin)
