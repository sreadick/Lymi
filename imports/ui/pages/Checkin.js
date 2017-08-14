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
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     currentDate: moment().format('MMMM Do YYYY'),
  //     isFetching: true,
  //     todaysCheckin: undefined,
  //     symptomCheckinItems: []
  //
  //   }
  // }
  // componentDidMount(props) {
  //   Meteor.subscribe('userSymptoms');
  //   Meteor.subscribe('userTreatments');
  //   const checkinHandle = Meteor.subscribe('checkinHistories');
  //   this.checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  //
  //   // const checkinHandle = Meteor.subscribe('checkinHistories');
  //   //
  //   // console.log(this.props)
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.symptomCheckinItems !== this.props.symptomCheckinItems) {
  //     this.setState({
  //       symptomCheckinItems: UserSymptoms.find().fetch(),
  //     })
  //   }
  //   if (this.checkinHistoryIsReady) {
  //     console.log(true)
  //   }
  //   console.log(this.state);
  // }

  render() {
    if (this.props.isFetching) {
      return <div></div>
    } else if (CheckinHistories.findOne().dailyCompleted === 'yes') {
      return <Redirect to="/home"/>
    }
    return (
      <div className="checkin-item__container">
        <div className="ui center aligned large black header">Check in for {moment().format('MMMM Do YYYY')}</div>
        <Switch>
          <Route exact path="/home/checkin/symptoms" render={() => {
            return <SymptomsCheckin symptomCheckinItems={this.props.symptomCheckinItems} {...this.props} />
          }} />
          <Route exact path="/home/checkin/treatments" render={() => {
            return <TreatmentsCheckin treatmentCheckinItems={this.props.treatmentCheckinItems} {...this.props} />
          }} />
          <Route exact path="/home/checkin" render={() => {
            return <Redirect to="/home/checkin/symptoms" />
          }} />
        </Switch>
        {/* <Link to="/home/checkin/symptoms">symptoms</Link>
        <Link to="/home/checkin/treatments">treatments</Link> */}
      </div>
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

  // edit
  const userSymptoms = UserSymptoms.find().fetch();
  const userTreatments = UserTreatments.find().fetch();
  const checkinSymptomNames = todaysCheckin ? todaysCheckin.symptoms.map((symptom) => symptom.name) : [];
  const checkinTreatmentNames = todaysCheckin ? todaysCheckin.treatments.map((treatment) => treatment.name) : [];

  if (checkinHistoryIsReady) {

  }

  if (checkinHistoryIsReady ) {
    if (!todaysCheckin) {
      Meteor.call('checkinHistories.checkins.create', {
        date: currentDate,
        symptoms: userSymptoms,
        treatments: userTreatments,
      });
      Meteor.call('checkinHistories.dailyCompleted.update', 'no');
    } else {
      if (!userSymptoms.every((symptom, index) => symptom.name === checkinSymptomNames[index])) {
        Meteor.call('checkinHistories.checkins.symptoms.update', {
          date: currentDate,
          symptoms: userSymptoms,
        })
      }
      if (!userTreatments.every((treatment, index) => treatment.name === checkinTreatmentNames[index])) {
        Meteor.call('checkinHistories.checkins.treatments.update', {
          date: currentDate,
          treatments: userTreatments,
        })
      }
    }
  }
  return {
    symptomCheckinItems: todaysCheckin ? todaysCheckin.symptoms : [],
    treatmentCheckinItems: todaysCheckin ? todaysCheckin.treatments : [],
    isFetching: !checkinHistoryIsReady,
    checkinHistoryIsReady
  }
}, Checkin)
