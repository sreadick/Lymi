import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';

const Dashboard = (props) => {
  if (props.isFetching) {
    return <div></div>
  } else if (props.userSymptoms.length === 0 || props.userTreatments.length === 0) {
    return <Redirect to="/home"/>
  }
  return (
    <div className="ui container">
      <h1>Dashboard</h1>
      <h2>Symptoms: </h2>
      <Link className="ui small blue basic button" to="/home/selectsymptoms">edit</Link>
      <div>
        {props.userSymptoms.map((symptom) => {
          return <h3 key={symptom._id}>{symptom.name}</h3>
        })}
      </div>
      <h2>Treatments: </h2>
      <Link className="ui small blue basic button" to="/home/selecttreatments">edit</Link>
      <div>
        {props.userTreatments.map((treatment) => {
          return (
            <div key={treatment._id}>
              <h3>{treatment.name}</h3>
              <span>{treatment.amount} X {treatment.dose}{treatment.dose_type} {treatment.frequency}/day</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default createContainer(() => {
  let symptomsHandle = Meteor.subscribe('userSymptoms');
  let treatmentsHandle = Meteor.subscribe('userTreatments');
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    isFetching: (!symptomsHandle.ready() || !treatmentsHandle.ready())
  };
}, Dashboard);
