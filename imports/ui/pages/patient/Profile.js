import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import { capitalizePhrase, getCheckinComplianceData } from '../../../utils/utils';
import moment from 'moment';
import { Row, Input } from 'react-materialize';

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';
// import { ForumPosts } from '../../../api/forum-posts';
import { ForumPosts } from '../../../api/forum';
import { Topics } from '../../../api/forum';
// import { SubForums } from '../../../api/forum';

import Loader from '/imports/ui/components/Loader';
import CheckinPieChart from '../../components/patient/CheckinPieChart';

class Profile extends React.Component {
  // checkinComplianceData() {
  //   const startDate = moment(this.props.userInfo.account.createdAt).startOf('day');
  //   const currentDate = moment().startOf('day');
  //   const numDaysUsingApp = currentDate.diff(startDate, 'days') + 1;
  //   let daysCheckedIn = 0;
  //   this.props.checkinHistory.checkins.forEach(checkin => {
  //     if (checkin.symptoms.some(checkinSymptom => checkinSymptom.severity > 0)) {
  //       daysCheckedIn++
  //     }
  //   })
  //   const checkinPercentage = (typeof (daysCheckedIn / numDaysUsingApp) !== 'number') ? 0 : (daysCheckedIn / numDaysUsingApp * 100);
  //   return {
  //     checkinPercentage,
  //     daysCheckedIn,
  //     daysNotCheckedIn: numDaysUsingApp - daysCheckedIn
  //   }
  // }

  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className="profile__page">
        <div className='profile z-depth-2'>
          {/* <div className='section profile__section'> */}
          <div className='profile__header'>
            {this.props.userInfo.profile.userPhoto ?
              <img className='profile__avatar' src={this.props.userInfo.profile.userPhoto} />
            :
              <div className='profile__avatar--inital'>
                {this.props.userInfo.username ?
                  this.props.userInfo.username.charAt(0)
                  :
                  this.props.userInfo.profile.firstName.charAt(0)
                }
              </div>
            }
            <div>
              <div className='profile__user-name'>
                { this.props.userInfo.username ?
                  this.props.userInfo.username
                  :
                  capitalizePhrase(this.props.userInfo.profile.firstName + " " + this.props.userInfo.profile.lastName)
                }
              </div>
              {this.props.userInfo.account.createdAt &&
                <div>Joined {moment(this.props.userInfo.account.createdAt).format('MMMM DD, YYYY')}</div>
              }
            </div>
          </div>
          {/* <Link className='' to={{pathname: '/patient/account', state: {activeTab: 'preferences'}}}>Change Avatar Pic</Link> */}
          <Link className='' to='/patient/account'>Change Avatar Pic</Link>
          {/* </div> */}
          <hr />

          {this.props.userInfo.account.createdAt &&
            <div className='section'>
              {/* Daily check-in completion {Math.round(this.props.checkinComplianceData.checkinPercentage * 100) / 100}% */}
              Daily check-in completion: {this.props.checkinComplianceData.roundedCheckinPercentage}%
              <CheckinPieChart
                daysCheckedIn={this.props.checkinComplianceData.daysCheckedIn}
                daysNotCheckedIn={this.props.checkinComplianceData.daysNotCheckedIn}
                animate={true}
                showLegend={true}
                height={70}
               />
              {/* Daily check-in completion {Math.round(this.checkinComplianceData().checkinPercentage * 100) / 100}%
              <CheckinPieChart
                daysCheckedIn={this.checkinComplianceData().daysCheckedIn}
                daysNotCheckedIn={this.checkinComplianceData().daysNotCheckedIn}
                height={70}
               /> */}
            </div>
          }
          <hr />

          <div className='section profile__section'>
            <div className='profile__heading__wrapper'>
              <p className='profile__heading'>Tracking Items:</p>
              <Link className='profile__link' to={'/patient/account'}>edit</Link>
            </div>
            <Row>
              <Input name='trackedItems' type='checkbox' label='Symptoms' value='symptoms' defaultChecked={this.props.userInfo.profile.settings.trackedItems.includes('symptoms')} disabled='disabled' />
              <Input name='trackedItems' type='checkbox' label='Treatments' value='treatments' defaultChecked={this.props.userInfo.profile.settings.trackedItems.includes('treatments')} disabled='disabled' />
              <Input name='trackedItems' type='checkbox' label='Notable Events' value='notable events' defaultChecked={this.props.userInfo.profile.settings.trackedItems.includes('notable events')} disabled='disabled' />
            </Row>
          </div>
          <hr />

          <div className='section profile__section'>
            <div className='profile__heading__wrapper'>
              <p className='profile__heading'>Current Symptoms:</p>
              <Link className='profile__link' to={'/patient/selectsymptoms'}>edit</Link>
            </div>
            <ul>
              {this.props.userSymptoms.map(symptom =>
                <li key={symptom.name}>{symptom.name}</li>
              )}
            </ul>
          </div>
          <hr />
          {this.props.userInfo.profile.settings.trackedItems.includes('treatments') &&
            <div className='section profile__section'>
              <div className='profile__heading__wrapper'>
                <p className='profile__heading'>Current Treatments:</p>
                <Link className='profile__link' to={'/patient/selecttreatments'}>edit</Link>
              </div>
              <ul>
                {this.props.userTreatments.map(treatment =>
                  <li key={treatment.name}>{treatment.name.charAt(0).toUpperCase() + treatment.name.slice(1)}</li>
                )}
              </ul>
            </div>
          }
          <hr />

          <div className='section profile__section'>
            <p className='profile__heading'>Lyme Share Topics:</p>
            <ul className='profile__topics'>
              {this.props.userTopics.map(topic => {
                const posts = ForumPosts.find({topicId: topic._id}).fetch();
                let lastPost;
                if (posts.length > 0) {
                  lastPost = posts.pop()
                }
                return (
                  <li key={topic._id}>
                    <Link to={`/forum/subforum/${topic.subforumId}/topic/${topic._id}`}>{topic.title}</Link>
                    <p>Replies: {posts.length}</p>
                    <p>{lastPost ? `Last Post: ${moment(lastPost.createdAt).fromNow()} by ${lastPost.authorUsername || lastPost.authorFirstName}` : ''}</p>
                  </li>
                )
              })}
            </ul>
          </div>
          <hr />

          <div className='section profile__section'>
            <div className='profile__heading__wrapper'>
              <p className='profile__heading'>My Medical Info:</p>

              <Link className='profile__link' to={{pathname: '/patient/account', state: {activeTab: 'medicalInfo'}}}>edit</Link>
              {/* <p className='profile__heading'>Lyme Practioner:</p> */}
            </div>
            <div>
              <span className=''>Lyme Practioner: </span>
              {this.props.currentDoctor ?
                <span>{this.props.currentDoctor.profile.firstName} {this.props.currentDoctor.profile.lastName}</span>
                :
                <span>None</span>
              }
            </div>
            <div>
              <span className=''>Inital Date of Infection: </span>
              {this.props.userInfo.profile.medical.initialInfectionDate.month ?
                <span>{this.props.userInfo.profile.medical.initialInfectionDate.month} {this.props.userInfo.profile.medical.initialInfectionDate.day}, {this.props.userInfo.profile.medical.initialInfectionDate.year}</span>
                :
                <span>N/A</span>
              }
            </div>
            <div>
              <span className=''>Tick-Born Infections: </span>
              {this.props.userInfo.profile.medical.tickBorneDiseases.length > 0 ?
                <ul>
                  {this.props.userInfo.profile.medical.tickBorneDiseases.map(diseaseName =>
                    <li key={diseaseName} className='grey-text'> - {diseaseName}</li>
                  )}
                </ul>
                :
                <span>N/A</span>
              }
            </div>
          </div>
          <hr />

          <div className='section profile__section'>
            <div className='profile__heading__wrapper'>
              <p className='profile__heading'>My Personal Info:</p>
              <Link className='profile__link' to={{pathname: '/patient/account', state: {activeTab: 'personalInfo'}}}>edit</Link>
            </div>
            <div>
              <p>Date of Birth:
                <span>
                  {(this.props.userInfo.profile.birthYear && this.props.userInfo.profile.birthMonth && this.props.userInfo.profile.birthDay)
                    ? moment(`${this.props.userInfo.profile.birthYear} ${this.props.userInfo.profile.birthMonth} ${this.props.userInfo.profile.birthDay}`, 'YYYY MMM DD').format('MM/DD/YY')
                    : 'N/A'
                  }
                </span>
              </p>
              <div>Address:
                  {/* {(this.props.userInfo.profile.street && this.props.userInfo.profile.city && this.props.userInfo.profile.state && this.props.userInfo.profile.zip) */}
                  {this.props.userInfo.profile.street ?
                    <div>
                      <p>{this.props.userInfo.profile.street} {this.props.userInfo.profile.apartment && 'Apt ' + this.props.userInfo.profile.apartment}</p>
                      <p>
                        {(this.props.userInfo.profile.city && this.props.userInfo.profile.state && this.props.userInfo.profile.zip)
                          ?
                          `${this.props.userInfo.profile.city}, ${this.props.userInfo.profile.state} ${this.props.userInfo.profile.zip}`
                          :
                          <span>
                            {`${this.props.userInfo.profile.city} ${this.props.userInfo.profile.state} ${this.props.userInfo.profile.zip}`} <br />
                              - Address is incomplete <Link to={{pathname: '/patient/account', state: {activeTab: 'personalInfo'}}}>(Update Now)</Link>
                            </span>
                        }
                      </p>
                    </div>
                    : (this.props.userInfo.profile.state || this.props.userInfo.profile.city || this.props.userInfo.profile.zip || this.props.userInfo.profile.apartment) ?
                      // <span>{` (${this.props.userInfo.profile.city && 'City: ' + this.props.userInfo.profile.city} ${this.props.userInfo.profile.state && 'State: ' + this.props.userInfo.profile.state})`}</span>
                      <div>
                        <div>{this.props.userInfo.profile.city && 'City: ' + this.props.userInfo.profile.city}</div>
                        <div>{this.props.userInfo.profile.state && 'State: ' + this.props.userInfo.profile.state}</div>
                        <div>{this.props.userInfo.profile.zip && 'Zip: ' + this.props.userInfo.profile.zip}</div>
                        <div>{this.props.userInfo.profile.apartment && 'Apartment #: ' + this.props.userInfo.profile.apartment}</div>
                        <div>Address is incompete <Link to={{pathname: '/patient/account', state: {activeTab: 'personalInfo'}}}>(Update Now)</Link></div>
                      </div>
                    : "N/A"
                  }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const forumPostsHandle = Meteor.subscribe('forumPosts');
  const topicsHandle = Meteor.subscribe('topics');
  // const subforumsHandle = Meteor.subscribe('subforums');
  // const userAppts = Meteor.user() ? Meteor.user().profile.medical.appointments : undefined;
  const currentdDoctorHandle = Meteor.subscribe('currentDoctor', Meteor.user() && Meteor.user().doctorId);
  return {
    userInfo: Meteor.user(),
    userSymptoms:  UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    userTopics: Topics.find({authorId: Meteor.userId()}).fetch(),
    currentDoctor: Meteor.user() && Meteor.users.findOne({ 'account.type': 'doctor', _id: Meteor.user().doctorId }),
    checkinComplianceData: (Meteor.user() && checkinHandle.ready()) ? getCheckinComplianceData(Meteor.user().account.createdAt, CheckinHistories.findOne().checkins) : {},
    isFetching: !Meteor.user() || !symptomsHandle.ready() || !treatmentsHandle.ready() || !checkinHandle.ready() || !currentdDoctorHandle.ready() || !topicsHandle.ready() || !forumPostsHandle.ready(),
  }
}, Profile)
