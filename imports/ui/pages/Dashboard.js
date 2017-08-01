import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';

import SymptomChart from '../components/SymptomChart';

const Dashboard = (props) => {
  if (props.isFetching) {
    return <div>FETCHING</div>
  } else if (props.userSymptoms.length === 0 || props.userTreatments.length === 0) {
    return <Redirect to="/home"/>
  }

  return (
    <div className="ui container">
        {props.checkinHistory.dailyCompleted ?
          <div className="ui positive message">
            {moment(props.checkinHistory.lastCheckin).fromNow() === "a few seconds ago" ? "Thanks for checking in!"
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
          </div>
        }



      <div className="ui segment">
        <Link className="ui small blue right floated button" to="/home/selectsymptoms">edit</Link>
        <span className="ui big header">Symptoms: </span>
        <div className="ui big ordered list">
          {props.userSymptoms.map((symptom) => {
            return (
              <div className="item" key={symptom._id}>
                <div className="header">{symptom.name}</div>
              </div>
            );
          })}
        </div>
        <SymptomChart checkins={props.checkinHistory.checkins}/>
      </div>


      <div className="ui segment">
        <Link className="ui small blue right floated button" to="/home/selecttreatments">edit</Link>
        <span className="ui big header">Treatments: </span>
        <div className="ui big ordered list">
          {props.userTreatments.map((treatment) => {
            return (
              <div className="item" key={treatment._id}>
                <div className="header">{treatment.name}</div>
                <div className="description">{treatment.amount} X {treatment.dose}{treatment.dose_type} {treatment.frequency}/day</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default createContainer(() => {
  let symptomsHandle = Meteor.subscribe('userSymptoms');
  let treatmentsHandle = Meteor.subscribe('userTreatments');
  let checkinHandle = Meteor.subscribe('checkinHistories');

  const currentDate = moment().format('MMMM Do YYYY');
  let todaysCheckin = checkinHandle.ready() ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;

  if (checkinHandle.ready() && !todaysCheckin) {
    console.log(1);
  Meteor.call('checkinHistories.checkins.update', {
    date: currentDate,
    symptoms: UserSymptoms.find().fetch(),
    treatments: UserTreatments.find().fetch(),
  })
    Meteor.call('checkinHistories.dailyCompleted.update', false)
  }
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHandle.ready() || !symptomsHandle.ready() || !treatmentsHandle.ready()),
  };
}, Dashboard);
