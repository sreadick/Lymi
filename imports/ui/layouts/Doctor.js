import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';

const Doctor = (props) => {
  if (props.isFetching) {
    return <div></div>;
  } else {
    return <Redirect to="/doctor/home" />
  }
}

export default createContainer(() => {
  return {
    isFetching: false,
  };
}, Doctor);
