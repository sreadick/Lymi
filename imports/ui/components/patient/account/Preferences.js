import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Input, Button } from 'react-materialize';

import ProfileBackgroundModel from '../ProfileBackgroundModel';
import ProfileImageModel from '../ProfileImageModel';

class Preferences extends React.Component {
  render() {
    return (
      <div className='account-info'>
        <div className='account-info__heading'>Preferences</div>
        <div className='account-info__subheading'>Profile</div>
        <div className='section'>
          <p>Current Profile Background:</p>
          <img style={{width: '150px', height: '100px'}} src={this.props.backgroundURL}/>
          <a href='#' className='deep-purple-text right' onClick={() => Session.set('showProfileBackgroundModel', true)}>Change background</a>
        </div>
        <div className='section'>
          <p>Current Alias Image:</p>
          {this.props.userPhoto ?
            <img style={{width: '100px', height: '100px', borderRadius: '50%'}} src={this.props.userPhoto}/>
            :
            <span>None Selected</span>
          }
          <a href='#' className='deep-purple-text right' onClick={() => Session.set('showProfileImageModel', true)}>Select Image</a>
        </div>

        {this.props.showProfileBackgroundModel && <ProfileBackgroundModel />}
        {this.props.showProfileImageModel && <ProfileImageModel />}
      </div>
    );
  }
};

export default createContainer(props => {
  return {
    showProfileBackgroundModel: Session.get('showProfileBackgroundModel'),
    showProfileImageModel: Session.get('showProfileImageModel'),
    backgroundURL: (Meteor.user() && Meteor.user().profile.backgroundURL) ? Meteor.user().profile.backgroundURL : undefined,
    userPhoto: (Meteor.user() && Meteor.user().profile.userPhoto) ? Meteor.user().profile.userPhoto : undefined,
  }
}, Preferences)
