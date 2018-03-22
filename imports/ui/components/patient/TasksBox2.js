import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { getTasks, getCheckinComplianceData } from '/imports/utils/utils';

import CheckinPieChart from '/imports/ui/components/patient/CheckinPieChart';
import Loader from '/imports/ui/components/Loader';

import { Topics } from '/imports/api/forum';
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
        <h3 className="task-box__heading">Notifications</h3>
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
                  className="task-box__link"
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
            {/* {(!this.props.userInfo.doctorId && this.props.userTasks.requests.length === 0) &&
              <li className='task-box__task'>
                <Link
                  className='task-box__link'
                  to=''
                  onClick={() => Session.set('showDoctorSearch', true)}>
                  Select Lyme Doctor
                </Link>
              </li>
            } */}
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
            {this.props.userTasks.newPosts.map((post) => {
              const topic = Topics.findOne(post.topicId);

              return (
                <li className='task-box__task' key={post._id}>
                  <div className='row'>
                    <div className='col s12'>
                      <span className=''>{post.authorUsername || post.authorFirstName}</span>
                      <span> responded to </span>
                      <Link
                        className='task-box__link--topic'
                        onClick={() => Meteor.call('forumPosts.update',
                          {postId: post._id, updateProp: 'viewedByTopicAuthor', newValue: true}
                        )}
                        to={`/patient/forum/subforum/${post.subforumId}/topic/${post.topicId}`}>
                        {topic.title}
                      </Link>
                    </div>
                    <div className='col s12 grey-text text-darken-1'>
                      -{moment(post.createdAt).fromNow()}
                    </div>
                  </div>
                </li>
              );
            })}
            </div>
          </ul>
        }

        <h3 className="task-box__heading">Practitioner</h3>
        <ul className='task-box__task__list'>
          <li className='task-box__task'>
            {this.props.currentDoctor ?
              <p>{this.props.currentDoctor.profile.firstName} {this.props.currentDoctor.profile.lastName}</p>
              :
              <Link
                className='task-box__link'
                to=''
                onClick={() => Session.set('showDoctorSearch', true)}>
                Select Lyme Doctor
              </Link>
            }
          </li>
        </ul>

        <h3 className="task-box__heading">Account</h3>
        <h5 className="task-box__subheading">Tracking:</h5>
        <ul className='task-box__task__list'>
          <li className='task-box__task'>
            <ul>
              {/* Tracking: */}
              {this.props.userInfo.profile.settings.trackedItems.map(item =>
                <li key={item}> {item}</li>
              )}
            </ul>
          </li>
        </ul>

        <h5 className="task-box__subheading">Check-Ins:</h5>
        {/* <p>Daily check-in completion {Math.round(this.props.checkinComplianceData.checkinPercentage * 100) / 100}%</p> */}
        <p>Daily Completion: {this.props.checkinComplianceData.roundedCheckinPercentage}%</p>
        <CheckinPieChart
          daysCheckedIn={this.props.checkinComplianceData.daysCheckedIn}
          daysNotCheckedIn={this.props.checkinComplianceData.daysNotCheckedIn}
          animate={false}
          showLegend={false}
          height={130}
         />



        <h3 className="task-box__heading">Lyme Share</h3>
        <h5 className="task-box__subheading">My Topics:</h5>
        <ul className='task-box__task__list'>
          {this.props.userTopics.length > 0 ?
            this.props.userTopics.map(topic =>
              <li key={topic._id} className='task-box__task'>
                <Link
                  className='task-box__link'
                  to={`/patient/forum/subforum/${topic.subforumId}/topic/${topic._id}`}>
                  {topic.title}
                </Link>
              </li>
            )
            :
            <li className='task-box__task'>
              No Topics...
            </li>
          }
        </ul>
      </div>
    );
  }
};

export default createContainer((props) => {
  // const requestsHandle = Meteor.subscribe('requestsToUser');
  // const userInfo = Meteor.user();
  const topicsHandle = Meteor.subscribe('topics');
  const currentdDoctorHandle = Meteor.subscribe('currentDoctor', props.userInfo.doctorId);
  const currentDoctor = Meteor.users.findOne({ 'account.type': 'doctor', _id: props.userInfo.doctorId });
  // console.log(currentDoctor);
  console.log(getTasks());
  return {
    // requests: Requests.find().fetch(),
    // userInfo,
    userTasks: getTasks(),
    checkinComplianceData: getCheckinComplianceData(props.userInfo.account.createdAt, props.checkins),
    currentDoctor,
    userTopics: Topics.find({authorId: props.userInfo._id}, {sort: {createdAt: -1}}).fetch(),
    isFetching: !topicsHandle.ready() || !currentdDoctorHandle.ready()
  }
}, TasksBox2);
