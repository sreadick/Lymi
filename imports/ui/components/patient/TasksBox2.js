import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import ReactTooltip from 'react-tooltip'
import moment from 'moment';

import { getTasks, getCheckinComplianceData } from '/imports/utils/utils';

import CheckinPieChart from '/imports/ui/components/patient/CheckinPieChart';
import Loader from '/imports/ui/components/Loader';

import { Topics } from '/imports/api/forum';
import { ForumPosts } from '/imports/api/forum';
import { Requests } from '/imports/api/requests';

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
      <div className="task-box z-depth-3">
        <div className="task-box__section">
          <h3 className="task-box__heading valign-wrapper">
            Notifications
            {this.props.userTasks.numTasks > 0 &&
              <span className="task-box__heading__numTasks">
                {this.props.userTasks.numTasks}
              </span>
            }
          </h3>
          {/* {(this.props.userTasks.dailyCheckinStatus === 'complete' && this.props.userTasks.requests.length === 0 && this.props.userTasks.newPosts.length === 0) */}
          {!this.props.hasTasks
            ?
              <p>No new notifications.</p>
            :
            <ul className='task-box__item__container'>
              {this.props.userTasks.dailyCheckinStatus !== 'complete' &&
                <li className='task-box__item'>
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
                <li className='task-box__item'>
                  <Link
                    className='task-box__link'
                    to=''
                    onClick={() => Session.set('showDoctorSearch', true)}>
                    Select Lyme Doctor
                  </Link>
                </li>
              } */}
              {this.props.userTasks.requests.map(request =>
                <li className='task-box__item' key={request._id}>
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
                  <li className='task-box__item' key={post._id}>
                    <div className='row'>
                      <div className='col s10'>
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
                      <div className='col s1 offset-s1'>
                        <i
                          className="material-icons indigo-text button--icon"
                          data-tip data-for='dismissNotification'
                          onClick={() => Meteor.call('forumPosts.update',
                            {postId: post._id, updateProp: 'viewedByTopicAuthor', newValue: true}
                          )}>
                          not_interested
                        </i>
                        <ReactTooltip id='dismissNotification' place='bottom' effect='solid'>
                          Dismiss
                        </ReactTooltip>
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
        </div>

        <div className="task-box__section">
          <h3 className="task-box__heading">Practitioner</h3>
          {this.props.currentDoctor ?
            <div>
              <div className='task-box__item'>
                <p>{this.props.currentDoctor.profile.firstName} {this.props.currentDoctor.profile.lastName}</p>
                <p>Address:<span className='grey-text text-darken-1'> { `${this.props.currentDoctor.profile.officeAddress}, ${this.props.currentDoctor.profile.city}, ${this.props.currentDoctor.profile.state} ${this.props.currentDoctor.profile.zip}`}</span></p>
                <p>Phone #:<span className='grey-text text-darken-1'> {`  ${this.props.currentDoctor.profile.phone}`}</span></p>
                <p>Email:<span className='grey-text text-darken-1'>{` ${this.props.currentDoctor.emails[0].address}`}</span></p>
                {/* <p>Email: {this.props.currentDoctor.emails[0].address}</p> */}
              </div>

              <h5 className="task-box__subheading">Appointments</h5>
              <div className='task-box__item'>
                {this.props.userAppts.last &&
                  <div>
                    <p>Last Appointment:</p>
                    <p className='grey-text text-darken-1'>{moment(this.props.userAppts.last).format('MM/DD/YY')}</p>
                  </div>
                }
                <div>
                  <p>Next Appointment:</p>
                  {this.props.userAppts.next ?
                    <div>
                      <p className='grey-text text-darken-1'>{moment(this.props.userAppts.next).format('MM/DD/YY (h:mm a)')}</p>
                      <div>
                        <span className='blue-text button--link' onClick={() => Session.set('showAppointmentScheduler', true)}>update</span>
                        <span className='red-text button--link' onClick={() => Meteor.call('users.appointments.removeLast')}> remove</span>
                      </div>
                    </div>
                  :
                    <p className='grey-text text-darken-1'>
                      <span className='grey-text text-darken-1'>None </span>
                      {/* <span className='green-text text-darken-1 button--link right' onClick={() => Session.set('showAppointmentScheduler', true)}> Set Appointment</span> */}
                      <Link
                        className='task-box__link task-box__link--edit right'
                        to=''
                        onClick={() => Session.set('showAppointmentScheduler', true)}>
                        Set Appointment
                      </Link>
                    </p>
                  }
                </div>
              </div>
            </div>
            :
            <Link
              className='task-box__link'
              to=''
              onClick={() => Session.set('showDoctorSearch', true)}>
              Select Lyme Doctor
            </Link>
          }
        </div>

        <div className="task-box__section">
          <h3 className="task-box__heading">Account</h3>
          <h5 className="task-box__subheading">
            Tracking:
            <Link
              className='task-box__link task-box__link--edit right'
              to='/patient/account'>
              Edit
            </Link>
          </h5>
          <div className='task-box__item'>
            <ul>
              {this.props.userInfo.profile.settings.trackedItems.map(item =>
                <li key={item}> {item}</li>
              )}
            </ul>
          </div>

          <h5 className="task-box__subheading">Check-Ins:</h5>
          {this.props.userTasks.dailyCheckinStatus === 'complete' &&
            <div className='task-box__item'>
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
                Edit check-in
              </Link>
            </div>
          }
          <div className='task-box__item'>
            <p className='grey-text'>Daily Completion: {this.props.checkinComplianceData.roundedCheckinPercentage}%</p>
            <CheckinPieChart
              daysCheckedIn={this.props.checkinComplianceData.daysCheckedIn}
              daysNotCheckedIn={this.props.checkinComplianceData.daysNotCheckedIn}
              animate={false}
              showLegend={false}
              height={130}
              padding={{top: 10}}
            />
          </div>
        </div>


        <div className="task-box__section">
          <h3 className="task-box__heading">Lyme Share</h3>
          <h5 className="task-box__subheading">My Topics:</h5>
          <ul className='task-box__item__container'>
            {this.props.userTopics.length > 0 ?
              this.props.userTopics.map(topic =>
                <li key={topic._id} className='task-box__item'>
                  <div className='row'>
                    <div className='col s7'>
                      <Link
                        className='task-box__link'
                        to={`/patient/forum/subforum/${topic.subforumId}/topic/${topic._id}`}>
                        {topic.title}
                      </Link>
                    </div>
                    <div className='col s5'>
                      Replies: {this.props.topicReplies.filter(reply => reply.topicId === topic._id).length}
                    </div>
                  </div>
                </li>
              )
              :
              <li className='task-box__item'>
                No Topics...
              </li>
            }
          </ul>
        </div>
      </div>
    );
  }
};

export default createContainer((props) => {
  // const requestsHandle = Meteor.subscribe('requestsToUser');
  // const userInfo = Meteor.user();
  const topicsHandle = Meteor.subscribe('topics');
  const forumPostsHandle = Meteor.subscribe('forumPosts');

  const currentdDoctorHandle = Meteor.subscribe('currentDoctor', props.userInfo.doctorId);
  const currentDoctor = Meteor.users.findOne({ 'account.type': 'doctor', _id: props.userInfo.doctorId });
  // console.log(currentDoctor);
  const userTasks = getTasks();
  // console.log(ForumPosts.find({topicAuthorId: Meteor.userId()}).fetch());
  return {
    // requests: Requests.find().fetch(),
    // userInfo,
    userTasks,
    hasTasks: (userTasks.dailyCheckinStatus !== 'complete' || userTasks.requests.length > 0 || userTasks.newPosts.length > 0) ? true : false,
    checkinComplianceData: getCheckinComplianceData(props.userInfo.account.createdAt, props.checkins),
    currentDoctor,
    userTopics: Topics.find({authorId: props.userInfo._id}, {sort: {createdAt: -1}}).fetch(),
    topicReplies: ForumPosts.find({topicAuthorId: Meteor.userId()}).fetch(),
    isFetching: !topicsHandle.ready() || !currentdDoctorHandle.ready() || !forumPostsHandle.ready()
  }
}, TasksBox2);
