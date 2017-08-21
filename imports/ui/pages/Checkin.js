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
  componentDidUpdate(prevProps) {
    if ((prevProps.checkinHistoryIsReady && prevProps.todaysCheckin.symptoms && prevProps.todaysCheckin.treatments && this.props.checkinHistoryIsReady && this.props.todaysCheckin.symptoms && this.props.todaysCheckin.treatments)) {
      if (prevProps.todaysCheckin.treatments.toString() !== this.props.todaysCheckin.treatments.toString() || prevProps.todaysCheckin.symptoms.toString() !== this.props.todaysCheckin.symptoms.toString()) {
        if ((!this.props.todaysCheckin.symptoms.every((checkinSymptom) => checkinSymptom.severity > 0) && this.props.todaysCheckin.symptoms.some((checkinSymptom) => checkinSymptom.severity > 0)) || (!this.props.todaysCheckin.treatments.every((checkinTreatment) => checkinTreatment.compliance) && this.props.todaysCheckin.treatments.some((checkinTreatment) => checkinTreatment.compliance))) {
          Meteor.call('checkinHistories.dailyCompleted.update', 'partial');
        }
      }
    }
  }

  render() {
    if (this.props.isFetching) {
      return <div></div>
    }
    // if (CheckinHistories.findOne().dailyCompleted === 'yes') {
    //   return <Redirect to="/home"/>
    // }
    return (
      <div className="checkin-item__container">
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

  const userSymptoms = UserSymptoms.find().fetch();
  const userTreatments = UserTreatments.find().fetch();
  const checkinSymptomNames = todaysCheckin ? todaysCheckin.symptoms.map((symptom) => symptom.name) : [];
  const checkinTreatmentNames = todaysCheckin ? todaysCheckin.treatments.map((treatment) => treatment.name) : [];

  if (checkinHistoryIsReady ) {
    if (!todaysCheckin) {
      Meteor.call('checkinHistories.checkins.create', {
        date: currentDate,
        symptoms: userSymptoms,
        treatments: userTreatments,
      });
      Meteor.call('checkinHistories.dailyCompleted.update', 'no');
    } else {
      // if (!userSymptoms.every((symptom, index) => symptom.name === checkinSymptomNames[index])) {
      if (todaysCheckin.symptoms.map((checkinSymptom) => checkinSymptom.name).toString() !== userSymptoms.map((userSymptom) => userSymptom.name).toString()) {
        Meteor.call('checkinHistories.checkins.symptoms.update', {
          date: currentDate,
          symptoms: userSymptoms,
          todaysCheckinSymptoms: todaysCheckin.symptoms
        });
        // Meteor.call('checkinHistories.dailyCompleted.update', 'modified symptoms');
      }
      // if (!userTreatments.every((treatment, index) => treatment.name === checkinTreatmentNames[index])) {
      if (todaysCheckin.treatments.map((checkinTreatment) => checkinTreatment.name).toString() !== userTreatments.map((userTreatment) => userTreatment.name).toString()) {
        Meteor.call('checkinHistories.checkins.treatments.update', {
          date: currentDate,
          treatments: userTreatments,
          todaysCheckinTreatments: todaysCheckin.treatments
        });
        // Meteor.call('checkinHistories.dailyCompleted.update', 'modified treatments');
      }
      // if ((!todaysCheckin.symptoms.every((checkinSymptom) => checkinSymptom.severity > 0) && todaysCheckin.symptoms.some((checkinSymptom) => checkinSymptom.severity > 0)) || (!todaysCheckin.treatments.every((checkinTreatment) => checkinTreatment.compliance === undefined) && todaysCheckin.treatments.some((checkinTreatment) => checkinTreatment.compliance === undefined))) {
      //   Meteor.call('checkinHistories.dailyCompleted.update', 'partial');
      //   console.log('something');
      // }
      // console.log(todaysCheckin.symptoms.every((checkinSymptom) => checkinSymptom.severity > 0));
      // console.log(todaysCheckin.symptoms.some((checkinSymptom) => checkinSymptom.severity > 0));
    }
  }
  return {
    symptomCheckinItems: todaysCheckin ? todaysCheckin.symptoms : [],
    treatmentCheckinItems: todaysCheckin ? todaysCheckin.treatments : [],
    isFetching: !checkinHistoryIsReady,
    checkinHistoryIsReady,
    todaysCheckin
  }
}, Checkin)
