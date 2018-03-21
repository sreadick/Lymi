import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { getTasks } from '/imports/utils/utils';

import Loader from '/imports/ui/components/Loader';

import { Requests } from '../../../api/requests';

class TasksBox2 extends React.Component {
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
        <Loader />
      );
    }
    return (
      <div className="task-box">
        <h3 className="task-box__heading">Tasks</h3>
        {(this.props.userTasks.dailyCheckinStatus === 'complete' && this.props.userTasks.requests.length === 0 && this.props.userInfo.doctorId)
          ?
            <p className='center'>No tasks require your attention.</p>
          :
          <ul className='task-box__task__list'>
            {this.props.userTasks.dailyCheckinStatus !== 'complete' &&
              <li className='task-box__task'>
                {/* <div>
                  {this.props.userTasks.dailyCheckinStatus === 'partially complete' ? "Your check in is incomplete" : "You haven't checked in today"}
                </div> */}
                <Link
                  // className="task-box__link"
                  className=""
                  to={{
                    pathname: "/patient/checkin",
                    state: {
                      checkinDate: moment().format('MMMM Do YYYY'),
                      symptoms: this.props.userSymptoms,
                      treatments: this.props.userTreatments
                    },
                  }}>
                  {this.props.userTasks.dailyCheckinStatus === 'partially complete' ? "Finish checking in" : "Check in now"}
                </Link>
              </li>
            }
            <div>
            {(!this.props.userInfo.doctorId && this.props.userTasks.requests.length === 0) &&
              <li className='task-box__task'>
                <Link
                  className=''
                  to={{
                    pathname: '/patient/account',
                    state: {
                      activeTab: 'medicalInfo'
                    }
                  }}>
                  Select Lyme Doctor
                </Link>
              </li>
            }
            {this.props.userTasks.requests.map(request =>
              <li className='task-box__task' key={request._id}>
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
              </li>
            )}
            </div>
          </ul>
        }
      </div>
    );
  }
};

export default createContainer(() => {
  // const requestsHandle = Meteor.subscribe('requestsToUser');
  const userInfo = Meteor.user();
  return {
    // requests: Requests.find().fetch(),
    userInfo,
    userTasks: getTasks(),
    isFetching: !userInfo
  }
}, TasksBox2);
