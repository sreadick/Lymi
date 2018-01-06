import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';

import Loader from '/imports/ui/components/Loader';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';

import { Meteor } from 'meteor/meteor';

const Patient = (props) => {
  if (props.isFetching) {
    return <Loader />;
  } else if (props.accountStatus === 'initializing') {
    return <Redirect to="/patient/welcomepage" />
  } else if (props.userSymptoms.length > 0 && (props.userTreatments.length > 0 || !props.trackedItems.includes('treatments'))) {
    return <Redirect to="/patient/dashboard" />
  } else if (props.userSymptoms.length > 0 && props.trackedItems.includes('treatments')) {
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
    trackedItems: Meteor.user() ? Meteor.user().profile.settings.trackedItems : [],
    accountStatus: Meteor.user() ? Meteor.user().account.status : undefined
  };
}, Patient);
