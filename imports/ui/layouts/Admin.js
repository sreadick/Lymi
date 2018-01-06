import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

import Loader from '/imports/ui/components/Loader';

const Admin = (props) => {
  if (props.isFetching) {
    return <Loader />;
  } else if (props.account.type !== 'admin') {
    if (props.account.type === 'doctor') {
      return <Redirect to ='/doctor' />
    } else {
      return <Redirect to="/patient" />
    }
  }

  return (
    <div>
      <h1>Admin...</h1>
      <div className="btn" onClick={() => Accounts.logout()}>Logout</div>

      {props.doctors.map(doctor =>
        <div className='section' key={doctor._id}>
          <span>{doctor.profile.firstName} {doctor.profile.lastName}</span>
          <div>
            <span>Address: {doctor.profile.officeAddress} {doctor.profile.city} {doctor.profile.state} {doctor.profile.zip}</span>
          </div>
          <div>
            <span>Phone: {doctor.profile.phone}</span>
          </div>
          <div>
            <span>NPI#: {doctor.profile.npi}</span>
          </div>
          <div>{doctor.account.status}</div>
          {doctor.account.status === 'pending approval' &&
            <button onClick={() => Meteor.call('users.updateAccountStatus', {userId: doctor._id, status: 'approved'})}>Approve</button>
          }
        </div>
      )}
    </div>
  )
}

export default createContainer(() => {
  const account = Meteor.user() ? Meteor.user().account : undefined;
  const userHandle = Meteor.subscribe('allUsers')
  return {
    isFetching: !Meteor.user() || !userHandle.ready(),
    account,
    doctors: Meteor.users.find({'account.type': 'doctor'}).fetch(),
  };
}, Admin);
