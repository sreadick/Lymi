import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import moment from 'moment';
import { getAppointments } from '/imports/utils/utils';
import { Row, Input, Button } from 'react-materialize';

import Loader from '/imports/ui/components/Loader';
import DoctorSearch from '../DoctorSearch';
import AppointmentScheduler from '../AppointmentScheduler';

class Practitioner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointments: props.appointments || []
    };
  }

  render() {
    return (
      <div className='account-info'>
        { this.props.showDoctorSearch && <DoctorSearch /> }
        { this.props.showAppointmentScheduler && <AppointmentScheduler currentAppt={this.props.userAppts.next} /> }
        <div className='account-info__heading'>Lyme Practitioner</div>
        {!this.props.currentDoctor ?
          <div className='section'>
            <p>Your doctor is not currently linked</p>
            <span className='purple-text text-lighten-1 button--link' onClick={() => Session.set('showDoctorSearch', true)}>Search for your Doctor</span>
          </div>
        :
          <div className='section'>
            <div className='right'>
              <div className='right blue-text text-lighten-1 button--link' onClick={() => Session.set('showDoctorSearch', true)}>Change Doctors</div>
              <div className='red-text text-lighten-1 button--link' onClick={() => Meteor.call('users.updateLymeDoctor', undefined)}>Remove Current Doctor</div>
            </div>
            <p>{this.props.currentDoctorInfo.name}</p>
            <p>Address: {this.props.currentDoctorInfo.address}</p>
            <p>Phone #: {this.props.currentDoctorInfo.phone}</p>
            <p>Email: {this.props.currentDoctorInfo.email}</p>
            {this.props.userAppts.last &&
              <span>Last Appointment: {moment(this.props.userAppts.last).format('MM/DD/YY')}</span>
            }
            <div>
              <span>Next Appointment: </span>
              {this.props.userAppts.next
                ?
                  <span>
                    {moment(this.props.userAppts.next).format('MM/DD/YY (h:mm a)')}
                    <div>
                      <span className='blue-text text-darken-1 button--link' onClick={() => Session.set('showAppointmentScheduler', true)}>Change Date </span>
                      <span className='red-text text-darken-1 button--link' onClick={() => Meteor.call('users.appointments.removeLast')}> Remove</span>
                    </div>
                  </span>
                :
                  <span>
                    N/A
                    <div className='green-text text-darken-1 button--link' onClick={() => Session.set('showAppointmentScheduler', true)}>Set Appointment</div>
                  </span>
              }
            </div>
          </div>
        }
      </div>
    );
  }
};

export default createContainer(props => {
  const userInfo = Meteor.user();

  const currentdDoctorHandle = Meteor.subscribe('currentDoctor', userInfo && userInfo.doctorId);
  const currentDoctor = userInfo && Meteor.users.findOne({ 'account.type': 'doctor', _id: userInfo.doctorId });
  const currentDoctorInfo = {};

  if (currentDoctor && currentdDoctorHandle.ready()) {
    currentDoctorInfo.name = `${currentDoctor.profile.firstName} ${currentDoctor.profile.lastName}`;
    currentDoctorInfo.address = `${currentDoctor.profile.officeAddress}, ${currentDoctor.profile.city}, ${currentDoctor.profile.state} ${currentDoctor.profile.zip}`;
    currentDoctorInfo.phone = currentDoctor.profile.phone;
    currentDoctorInfo.email = currentDoctor.emails[0].address;
  }

  return {
    currentDoctor,
    showDoctorSearch: Session.get('showDoctorSearch') || false,
    showAppointmentScheduler: Session.get('showAppointmentScheduler') || false,
    currentDoctorInfo,
    userAppts: userInfo ? getAppointments(userInfo.profile.medical.appointments) : {},
    isFetching: !userInfo || !currentdDoctorHandle.ready(),
  }
}, Practitioner)
