import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';

import { Meteor } from 'meteor/meteor';

const Patient = (props) => {
  if (props.isFetching) {
    return <div></div>;
  } else if (props.userSymptoms.length > 0 && props.userTreatments.length > 0) {
    return <Redirect to="/patient/dashboard" />
  } else if (props.userSymptoms.length > 0) {
    return <Redirect to="/patient/selecttreatments" />
  } else {
    return <Redirect to="/patient/selectsymptoms" />
  }
}

export default createContainer(() => {
  let symptomsHandle = Meteor.subscribe('userSymptoms');
  let treatmentsHandle = Meteor.subscribe('userTreatments');
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    isFetching: (!symptomsHandle.ready() || !treatmentsHandle.ready()),
  };
}, Patient);
