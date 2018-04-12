import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import moment from 'moment';

import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { getTasks } from '../../utils/utils';

import { UserSymptoms } from '/imports/api/user-symptoms';
import { UserTreatments } from '/imports/api/user-treatments';
// import { ForumPosts } from '/imports/api/forum';
import { Topics } from '/imports/api/forum';

const PrivateHeader = (props) => {
  // if (window.innerWidth > 768) {
  if (props.isfetching) {
    <div></div>
  }
  return (
    <div className={`nav-header ${props.isForumPage ? 'nav-header--forum' : props.accountType === 'doctor' ? 'private doctor z-depth-1' : 'private patient z-depth-1'}`} >
      <div className="nav-header__content--private">
        <div className="nav-header__content--left">
          {!props.isForumPage &&
            <i
              className='nav-header__icon--menu material-icons'
              onClick={() => Session.set('sidebarToggled', !props.sidebarToggled) }>
              {props.sidebarToggled ? "clear" : "menu"}
            </i>
          }
          <Link
            className={`nav-header__link--title ${props.accountType === 'doctor' ? 'doctor' : 'patient'}`}
            to={props.isForumPage ? "/patient/forum" : '/'}>
            {props.title}
          </Link>
          {props.isForumPage && <div className='nav-header__vl'></div>}
          {(props.isForumPage || (props.accountType === 'patient' && props.path !== '/patient/dashboard' && props.path !== '/patient/welcomepage' && props.path !== '/patient/selectsymptoms' && props.path !== '/patient/selecttreatments' && props.path !== '/patient/checkin')) &&
            <Link className={`nav-header__link--dashboard`} to='/patient/dashboard'>Dashboard</Link>
          }
          {/* {props.isForumPage &&
            <Link className={`nav-header__link--dashboard`} to='/patient/dashboard'>Dashboard</Link>
          } */}

        </div>
        <div className="nav-header__content--right">

          {/* <div className='nav-header__icon__wrapper' onClick={() => alert('FAQ Page Coming Soon!')}>
            <i className='nav-header__icon--help material-icons'>help</i>
          </div> */}
          {props.accountType === 'patient' && props.path !== '/patient/welcomepage' && props.path !== '/patient/selectsymptoms' && props.path !== '/patient/selecttreatments' && props.path !== '/patient/checkin' &&
            <div
              className='nav-header__icon__wrapper nav-header__notifications-item'
              id='nav-header__button--notifications'
              onClick={(e) => {
                e.target.classList.add('active');
                const navHeaderNotificationsDropdown = document.getElementById('nav-header__dropdown--notifications');
                navHeaderNotificationsDropdown.classList.add('active');
              }}>
              <i
                className={`nav-header__icon--help material-icons nav-header__notifications-item ${(props.currentTasks.dailyCheckinStatus !== 'complete' || props.currentTasks.requests.length > 0) ? 'green-text' : (!props.currentTasks.doctorIsLinked || props.currentTasks.newPosts.length > 0) ? 'blue-text text-darken-2' : 'black-text'}`}
                onClick={() => document.getElementById('nav-header__button--notifications').classList.add('active')}>
                {props.currentTasks.dailyCheckinStatus !== 'complete' ? 'notifications_active' : (!props.currentTasks.doctorIsLinked || props.currentTasks.newPosts.length > 0) ? 'notifications' : 'notifications_none'}
              </i>

              <div className='nav-header__dropdown--notifications nav-header__notifications-item z-depth-4' id='nav-header__dropdown--notifications'>
                <div className='nav-header__dropdown--notifications__heading'>
                  Notifications
                </div>
                {props.currentTasks.dailyCheckinStatus !== 'complete' || props.currentTasks.requests.length > 0 || !props.currentTasks.doctorIsLinked || props.currentTasks.newPosts.length > 0
                ?
                <div>
                  {props.currentTasks.dailyCheckinStatus !== 'complete' &&
                    <div className='row'>
                      <div className='col s12'>
                      {/* <span>
                        {props.currentTasks.dailyCheckinStatus === 'partially complete' ? "Your check in is incomplete" : "You haven't checked in today"}
                      </span> */}
                        <Link
                          // className="purple-text text-darken-1"
                          className=""
                          to={{
                            pathname: "/patient/checkin",
                            state: {
                              checkinDate: moment().format('MMMM Do YYYY'),
                              symptoms: props.userSymptoms,
                              treatments: props.userTreatments
                            },
                          }}>
                          {props.currentTasks.dailyCheckinStatus === 'partially complete' ? "Finish checking in" : "Check in now"}
                        </Link>
                      </div>
                    </div>
                  }
                  {props.currentTasks.requests.length > 0 &&
                    props.currentTasks.requests.map(request =>
                      <div key={request._id}>
                        <div className='row'>
                          <div className='col s9'>Accept request from Dr {request.doctorName} to link accounts</div>
                          <div className='col s1 offset-s1'>
                            <i
                              className="material-icons green-text button--icon"
                              onClick={() => Meteor.call('users.updateLymeDoctor', request.doctorId, (err, res) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  Meteor.call('requests.remove', {patientId: Meteor.userId(), doctorId: request.doctorId});
                                }
                              })}>
                              check
                            </i>
                          </div>
                          <div className='col s1'>
                            <i
                              className="material-icons red-text button--icon"
                              onClick={() => Meteor.call('requests.remove', {patientId: Meteor.userId(), doctorId: request.doctorId})}>
                              clear
                            </i>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  {!props.currentTasks.doctorIsLinked &&
                    <div className='row'>
                      <div className='col s12'>
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
                      </div>
                    </div>
                  }
                  {props.currentTasks.newPosts.length > 0 &&
                    props.currentTasks.newPosts.map((post) => {
                      const topic = Topics.findOne(post.topicId);
                      return (
                        <div key={post._id}>
                          <div className='row'>
                            <div className='col s12'>
                              <span className=''>{post.authorUsername || post.authorFirstName}</span>
                              <span> responded to </span>
                              <Link
                                className=''
                                onClick={() => Meteor.call('forumPosts.update',
                                  {postId: post._id, updateProp: 'viewedByTopicAuthor', newValue: true}
                                )}
                                to={`/patient/forum/subforum/${topic.subforumId}/topic/${topic._id}`}>
                                {topic.title}
                              </Link>
                            </div>
                            <div className='col s12 grey-text text-darken-2'>
                              -{moment(post.createdAt).fromNow()}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                :
                <div>
                  No Outstanding Tasks
                </div>
                }
              </div>
            </div>
          }
          <Link className='nav-header__icon__wrapper' to='/patient/account'>
            <i className='nav-header__icon--settings material-icons'>settings</i>
          </Link>
          <div className='nav-header__icon__wrapper nav-header__profile-item' id='nav-header__button--avatar' onClick={(e) => {
            e.target.classList.add('active');
            const navHeaderProfileDropdown = document.getElementById('nav-header__dropdown--avatar');
            navHeaderProfileDropdown.classList.add('active');
          }}>
            {Meteor.user().profile.userPhoto ?
              <img src={Meteor.user().profile.userPhoto} className='nav-header__avatar nav-header__profile-item' onClick={() => document.getElementById('nav-header__button--avatar').classList.add('active')} />
            :
              <div className='nav-header__avatar--initial nav-header__profile-item' onClick={() => document.getElementById('nav-header__button--avatar').classList.add('active')}>
                {Meteor.user().username ?
                  Meteor.user().username.charAt(0)
                  :
                   Meteor.user().profile.firstName.charAt(0)
                 }
              </div>
            }
            <div className='nav-header__dropdown--avatar nav-header__profile-item z-depth-4' id='nav-header__dropdown--avatar'>
              <div className='nav-header__dropdown--avatar__top-row'>
                <div className='nav-header__dropdown--avatar__top-row__left'>
                  {Meteor.user().profile.userPhoto ?
                    <img src={Meteor.user().profile.userPhoto} className='nav-header__avatar' />
                    :
                    <div className='nav-header__avatar--initial'>
                      {Meteor.user().username ?
                        Meteor.user().username.charAt(0)
                        :
                         Meteor.user().profile.firstName.charAt(0)
                       }
                    </div>
                  }
                </div>
                <div className='nav-header__dropdown--avatar__top-row__right'>
                  <div className='nav-header__dropdown--avatar__text'>
                    {Meteor.user().username ?
                      Meteor.user().username
                      :
                      Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName
                    }
                  </div>
                  <div className='nav-header__dropdown--avatar__text--email'>{Meteor.user().emails[0].address}</div>
                  <Link className="btn blue" to="/patient/profile">My Profile</Link>
                </div>
              </div>
              {/* <div className='nav-header__dropdown--avatar__bottom-row'> */}
                <Link className="nav-header__dropdown--avatar__bottom-row" to="#" onClick={() => Accounts.logout()}>Logout</Link>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PrivateHeader.propTypes = {
  title: PropTypes.string.isRequired
}


export default createContainer(props => {
  const currentTasks = props.accountType === 'patient' ? getTasks() : {};

  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  // const forumPostsHandle = Meteor.subscribe('forumPosts');
  const topicsHandle = Meteor.subscribe('topics');

  const userTreatments = UserTreatments.find().fetch();
  const userSymptoms =  UserSymptoms.find().fetch();
  // const userTopics = Topics.find({authorId: Meteor.userId()}).fetch();
  // const newPosts = ForumPosts.find({topicAuthorId: Meteor.userId(), viewedByTopicAuthor: false}).fetch();
  // console.log(newPosts);

  return {
    sidebarToggled: Session.get('sidebarToggled') || false,
    showProfileDropdown: Session.get('showProfileDropdown') || false,
    showNotificationsDropdown: Session.get('showNotificationsDropdown') || false,
    // showAccountDropdown: Session.get('showAccountDropdown') || false,
    userSymptoms,
    userTreatments,
    currentTasks,
    isTopicPage: props.path === '/patient/forum/subforum/:subforumId/topic/:topicId',
    isfetching: !symptomsHandle.ready() || !treatmentsHandle.ready() || !topicsHandle.ready() || !Meteor.user(),
  }
}, PrivateHeader)
// export default PrivateHeader;
