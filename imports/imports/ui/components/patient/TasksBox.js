import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import Loader from '/imports/ui/components/Loader';

import { Requests } from '../../../api/requests';

class TasksBox extends React.Component {
  addLymeDoctor(doctorId) {
    Meteor.call('users.updateLymeDoctor', doctorId, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        Meteor.call('requests.remove', {patientId: Meteor.userId(), doctorId: doctorId});
      }
    });
  }
  denyDoctorRequest(doctorId) {
    Meteor.call('requests.remove', {patientId: Meteor.userId(), doctorId: doctorId})
  }
  render() {
    if (this.props.isFetching) {
      return (
        // <div className="progress">
        //   <div className="indeterminate"></div>
        // </div>
        <Loader />
      );
    }
    return (
      <div className="dashboard-user-info__tasks-box z-depth-4">
        <div className='section'>

          <h5 className="purple-text text-lighten-2 center-align">Tasks</h5>
            {(this.props.dailyCheckinStatus === 'complete' && this.props.requests.length === 0 && Meteor.user().doctorId)
            ?
              <p className='center'>No tasks require your attention.</p>
            :
              <div>
                {this.props.dailyCheckinStatus !== 'complete' &&
                  <div>
                    <div>
                      {this.props.dailyCheckinStatus === 'partially complete' ? "Your check in is incomplete" : "You haven't checked in today"}
                    </div>
                    <Link
                      className="waves-effect waves-light purple darken-1 btn"
                      to={{
                        pathname: "/patient/checkin",
                        state: {
                          checkinDate: moment().format('MMMM Do YYYY'),
                          symptoms: this.props.userSymptoms,
                          treatments: this.props.userTreatments
                        },
                      }}>
                      {this.props.dailyCheckinStatus === 'partially complete' ? "Finish checking in" : "Check in now"}
                    </Link>
                  </div>
                }
                <div>
                {(!Meteor.user().doctorId && this.props.requests.length === 0) &&
                  <div className='section'>
                    <Link
                      className='deep-purple-text'
                      to={{
                        pathname: '/patient/account',
                        state: {
                          activeTab: 'medicalInfo'
                        }
                      }}>
                      Select Lyme Doctor
                    </Link>
                  </div>
                }
                {this.props.requests.map(request =>
                  <div key={request._id}>
                    <div className='row'>
                      <div className='col s10'>
                        <div>Accept request from Dr {request.doctorName} to link accounts</div>
                      </div>
                      <div className='col s1'>
                        {/* <button className='btn-floating waves-effect waves-light green'><i className="material-icons">check</i></button> */}
                        <i className="material-icons green-text button--icon" onClick={() => this.addLymeDoctor(request.doctorId)}>check</i>
                      </div>
                      <div className='col s1'>
                        {/* <button className='btn-floating waves-effect waves-light red'><i className="material-icons">clear</i></button> */}
                        <i className="material-icons red-text button--icon" onClick={() => this.denyDoctorRequest(request.doctorId)}>clear</i>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            }
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  const requestsHandle = Meteor.subscribe('requestsToUser');
  return {
    requests: Requests.find().fetch(),
    isFetching: !requestsHandle.ready() || !Meteor.user()
  }
}, TasksBox);
