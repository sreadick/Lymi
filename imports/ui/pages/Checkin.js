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
  componentDidUpdate(prevProps) {
    if (this.props.checkinHistoryIsReady && (this.props.userTreatments !== prevProps.userTreatments || this.props.userSymptoms !== prevProps.userSymptoms)) {
      if (!this.props.todaysCheckin) {
        Meteor.call('checkinHistories.checkins.create', {
          date: this.props.currentDate,
          symptoms: this.props.userSymptoms,
          treatments: this.props.userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'date range' && moment().isBetween(treatment.startDateValue, treatment.endDateValue) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY'))))),
        });
      } else {
        Meteor.call('checkinHistories.checkins.update', {
          date: this.props.currentDate,
          symptoms: this.props.userSymptoms,
          todaysCheckinSymptoms: this.props.todaysCheckin.symptoms,
          treatments: this.props.userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'date range' && moment().isBetween(treatment.startDateValue, treatment.endDateValue) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY'))))),
          todaysCheckinTreatments: this.props.todaysCheckin.treatments
        });
        // Meteor.call('checkinHistories.checkins.symptoms.update', {
        //   date: this.props.currentDate,
        //   symptoms: this.props.userSymptoms,
        //   todaysCheckinSymptoms: this.props.todaysCheckin.symptoms
        // });
        // Meteor.call('checkinHistories.checkins.treatments.update', {
        //   date: this.props.currentDate,
        //   treatments: this.props.userTreatments.filter((treatment) => (treatment.dateSelectMode === 'fromNowOn' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'dateRange' && moment().isBetween(treatment.startDateValue, treatment.endDateValue))),
        //   todaysCheckinTreatments: this.props.todaysCheckin.treatments
        // });
      }
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
  // if (checkinHistoryIsReady ) {
  //   if (!todaysCheckin) {
  //     Meteor.call('checkinHistories.checkins.create', {
  //       date: currentDate,
  //       symptoms: userSymptoms,
  //       // treatments: userTreatments.filter((treatment) => treatment.includeDetails === false || treatment.daysOfWeek.includes(moment().format('dddd'))),
  //       // treatments: userTreatments.filter((treatment) => treatment.includeDetails === false || (treatment.dateRangeToggled === false && treatment.daysOfWeek.includes(moment().format('dddd'))) || moment().isBetween(treatment.startDateValue, treatment.endDateValue)),
  //       treatments: userTreatments.filter((treatment) => (treatment.dateSelectMode === 'fromNowOn' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'dateRange' && moment().isBetween(treatment.startDateValue, treatment.endDateValue))),
  //     });
  //   } else {
  //     if (todaysCheckin.symptoms.map((checkinSymptom) => checkinSymptom.name).toString() !== userSymptoms.map((userSymptom) => userSymptom.name).toString()) {
  //       Meteor.call('checkinHistories.checkins.symptoms.update', {
  //         date: currentDate,
  //         symptoms: userSymptoms,
  //         todaysCheckinSymptoms: todaysCheckin.symptoms
  //       });
  //     }
  //
  //     if (todaysCheckin.treatments.map((checkinTreatment) => checkinTreatment.name).toString() !== userTreatments.map((userTreatment) => userTreatment.name).toString()) {
  //       Meteor.call('checkinHistories.checkins.treatments.update', {
  //         date: currentDate,
  //         // treatments: userTreatments.filter((treatment) => treatment.includeDetails === false || treatment.daysOfWeek.includes(moment().format('dddd'))),
  //         // treatments: userTreatments.filter((treatment) => treatment.includeDetails === false || (treatment.dateRangeToggled === false && treatment.daysOfWeek.includes(moment().format('dddd'))) || moment().isBetween(treatment.startDateValue, treatment.endDateValue)),
  //         treatments: userTreatments.filter((treatment) => (treatment.dateSelectMode === 'fromNowOn' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'dateRange' && moment().isBetween(treatment.startDateValue, treatment.endDateValue))),
  //         todaysCheckinTreatments: todaysCheckin.treatments
  //       });
  //     }
  //   }
  // }
  // console.log(userTreatments.filter((treatment) => (treatment.dateSelectMode === 'fromNowOn' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'dateRange' && moment().isBetween(treatment.startDateValue, treatment.endDateValue))))
  // userTreatments.forEach((treatment) => console.log(treatment.individualDateValues, moment().startOf('day').valueOf()));
  return {
    currentDate,
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
