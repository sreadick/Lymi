import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import { capitalizePhrase } from '/imports/utils/utils';
import moment from 'moment';
import { Row, Input } from 'react-materialize';

import ProfileImageModel from '../../components/ProfileImageModel';

import { ForumPosts } from '../../../api/forum';
import { Topics } from '../../../api/forum';
// import { SubForums } from '../../../api/forum';

import Loader from '/imports/ui/components/Loader';

class Profile extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className="profile__page">
        {this.props.showProfileImageModel && <ProfileImageModel />}
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
          <Link
            className=''
            to=''
            onClick={(e) => {
              e.preventDefault();
              Session.set('showProfileImageModel', true)
            }}>
            Change Avatar Pic
          </Link>
          {/* </div> */}
          <hr />

          <div className='section profile__section'>
            <div className='profile__heading__wrapper'>
              <p className='profile__heading'>My Personal Info:</p>
              <Link className='profile__link' to={'/patient/account'}>edit</Link>
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
              <div>Office Address:
                  {this.props.userInfo.profile.officeAddress ?
                    <div>
                      <p>{this.props.userInfo.profile.officeAddress} {this.props.userInfo.profile.apartment && 'Apt ' + this.props.userInfo.profile.apartment}</p>
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
                    <p><Link to={`/forum/subforum/${topic.subforumId}/topic/${topic._id}`}>{topic.title}</Link></p>
                    <p>Replies: {posts.length}</p>
                    <p>{lastPost ? `Last Post: ${moment(lastPost.createdAt).fromNow()} by ${lastPost.authorUsername || lastPost.authorFirstName}` : ''}</p>
                    <p>{`Viewed: ${topic.views || 0} ${topic.views === 1 ? 'time' : 'times'}`}</p>
                  </li>
                )
              })}
            </ul>
          </div>
          <hr />
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  const userInfo = Meteor.user();
  console.log(userInfo);
  const forumPostsHandle = Meteor.subscribe('forumPosts');
  const topicsHandle = Meteor.subscribe('topics');
  // const subforumsHandle = Meteor.subscribe('subforums');
  // const userAppts = Meteor.user() ? Meteor.user().profile.medical.appointments : undefined;
  return {
    userInfo,
    userTopics: Topics.find({authorId: Meteor.userId()}).fetch(),
    showProfileImageModel: Session.get('showProfileImageModel') || false,
    // userPhoto: (userInfo && userInfo.profile.userPhoto) ? userInfo.profile.userPhoto : undefined,
    isFetching: !userInfo || !topicsHandle.ready() || !forumPostsHandle.ready(),
  }
}, Profile)
