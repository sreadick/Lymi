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


class Checkin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fromTreatmentsCheckin: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      if (this.props.location.pathname === "/home/checkin/treatments") {
        this.setState({ fromTreatmentsCheckin: true })
      } else {
        this.setState({ fromTreatmentsCheckin: false })
      }
    }
  }
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
      <Switch>
        <Route exact path="/home/checkin/symptoms" render={() => {
          return (
            <SymptomsCheckin
              symptomCheckinItems={this.props.symptomCheckinItems}
              treatmentCheckinItems={this.props.treatmentCheckinItems}
              fromTreatmentsCheckin={this.state.fromTreatmentsCheckin}
              {...this.props}
            />
          );
        }} />
        <Route exact path="/home/checkin/treatments" render={() => {
          return <TreatmentsCheckin treatmentCheckinItems={this.props.treatmentCheckinItems} {...this.props} />
        }} />
        <Route exact path="/home/checkin" render={() => {
          return <Redirect to="/home/checkin/symptoms" />
        }} />
      </Switch>
    );
  }
};

export default createContainer(() => {

  Meteor.subscribe('userSymptoms');
  Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  const currentDate = moment().format('MMMM Do YYYY');
  let todaysCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;
  let yesterdaysCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === moment().subtract(1, 'day').format('MMMM Do YYYY')) : undefined;

  const userSymptoms = UserSymptoms.find().fetch();
  const userTreatments = UserTreatments.find().fetch();
  // const checkinSymptomNames = todaysCheckin ? todaysCheckin.symptoms.map((symptom) => symptom.name) : [];
  // const checkinTreatmentNames = todaysCheckin ? todaysCheckin.treatments.map((treatment) => treatment.name) : [];
  if (checkinHistoryIsReady ) {
    if (!todaysCheckin) {
      Meteor.call('checkinHistories.checkins.create', {
        date: currentDate,
        symptoms: userSymptoms,
        treatments: userTreatments.filter((treatment) => treatment.includeDetails === false || treatment.daysOfWeek.includes(moment().format('dddd'))),
      });
    } else {
      if (todaysCheckin.symptoms.map((checkinSymptom) => checkinSymptom.name).toString() !== userSymptoms.map((userSymptom) => userSymptom.name).toString()) {
        Meteor.call('checkinHistories.checkins.symptoms.update', {
          date: currentDate,
          symptoms: userSymptoms,
          todaysCheckinSymptoms: todaysCheckin.symptoms
        });
      }
      if (todaysCheckin.treatments.map((checkinTreatment) => checkinTreatment.name).toString() !== userTreatments.map((userTreatment) => userTreatment.name).toString()) {
        Meteor.call('checkinHistories.checkins.treatments.update', {
          date: currentDate,
          treatments: userTreatments.filter((treatment) => treatment.includeDetails === false || treatment.daysOfWeek.includes(moment().format('dddd'))),
          todaysCheckinTreatments: todaysCheckin.treatments
        });
      }
    }
  }
  return {
    userSymptoms,
    userTreatments,
    symptomCheckinItems: todaysCheckin ? todaysCheckin.symptoms : [],
    treatmentCheckinItems: todaysCheckin ? todaysCheckin.treatments : [],
    isFetching: !checkinHistoryIsReady,
    checkinHistoryIsReady,
    todaysCheckin,
    yesterdaysCheckin
  }
}, Checkin)
