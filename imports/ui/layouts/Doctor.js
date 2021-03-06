import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import Loader from '/imports/ui/components/Loader';

const Doctor = (props) => {
  if (props.isFetching) {
    return <Loader />;
  } else if (props.account.status === 'pending approval') {
    return <Redirect to ='/doctor/pending' />
  } else {
    return <Redirect to="/doctor/home" />
  }
}

export default createContainer(() => {
  const account = Meteor.user().account;
  return {
    isFetching: !Meteor.user(),
    account
  };
}, Doctor);
