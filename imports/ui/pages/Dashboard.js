import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';

import SymptomChart from '../components/SymptomChart';

// ToDo //

// transition/animation compat //
// materialize //

const Dashboard = (props) => {
  if (props.isFetching) {
    return <div></div>
  } else if (props.userSymptoms.length === 0 || props.userTreatments.length === 0) {
    return <Redirect to="/home" />
  } else if (props.userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0)) {
    return <Redirect to="/home/selecttreatments" />
  }

  return (
    <div className="ui container">
      <div className="page-content__main-heading">Dashboard</div>
      {props.checkinHistory.dailyCompleted ?
        <div className="ui positive message">
          {moment(props.checkinHistory.lastCheckin).fromNow() === "a few seconds ago" ? "Thanks for checking in"
          : `Last checked in ${moment(props.checkinHistory.lastCheckin).fromNow()}`
          }
        </div>
      : <div className="ui message">
          <div className="ui centered grid">
            <div className="row">
              <div className="ui header">You haven't checked in today</div>
            </div>
            <div className="row">
              <Link className="ui black button" to="/home/checkin/symptoms">
                Check in now
              </Link>
            </div>
          </div>
        </div>}



      <div className="ui segment">
        <Link className="ui small blue right floated button" to="/home/selectsymptoms">edit</Link>
        <div className="page-content__subheading">Symptoms: </div>
        <div className="ui big ordered list">
          {props.userSymptoms.map((symptom) => {
            return (
              <div className="item" key={symptom._id}>
                <div className="item__label">{symptom.name}</div>
              </div>
            );
          })}
        </div>
        <div className="ui raised segment">
          <SymptomChart checkins={props.checkinHistory.checkins}/>
        </div>
      </div>


      <div className="ui segment">
        <Link className="ui small blue right floated button" to="/home/selecttreatments">edit</Link>
        <div className="page-content__subheading">Treatments: </div>
        <div className="ui big ordered list">
          {props.userTreatments.map((treatment) => {
            return (
              <div className="item" key={treatment._id}>
                <div className="item__label">{treatment.name.charAt(0).toUpperCase() + treatment.name.slice(1)}</div>
                <div className="item__content">
                  {`
                    ${treatment.amount}
                    ${treatment.dose_type !== "pills" ? `x ${treatment.dose}${treatment.dose_type}` : treatment.amount === 1 ? "pill" : "pills"}
                    ${treatment.frequency}/day
                  `}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default createContainer(() => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  const currentDate = moment().format('MMMM Do YYYY');
  const todaysCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;

  if (checkinHistoryIsReady && !todaysCheckin) {
    Meteor.call('checkinHistories.checkins.update', {
      date: currentDate,
      symptoms: UserSymptoms.find().fetch(),
      treatments: UserTreatments.find().fetch(),
    });
    Meteor.call('checkinHistories.dailyCompleted.update', false)
  }
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHistoryIsReady || !symptomsHandle.ready() || !treatmentsHandle.ready()),
  };
}, Dashboard);
