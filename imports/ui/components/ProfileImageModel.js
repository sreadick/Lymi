import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


export default class ProfileImageModel extends React.Component {
  selectProfilePhoto() {
    const file = this.refs.photoInput.files[0];
    const imageType = /image.*/;

    if (file.type.match(imageType)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = reader.result;
        Meteor.users.update(Meteor.userId(), {
          $set: {
            'profile.userPhoto': img.src
          }
        });
        Session.set('showProfileImageModel', false)
      }

      reader.readAsDataURL(file);
    } else {
      alert('File type not supported');
    }
  }
  render() {
    return (
      <div className="boxed-view__box--profile-model__wrapper">
        <div className="boxed-view__box--profile-model">
          <i className='material-icons right'
            onClick={() => Session.set('showProfileImageModel', false)}>
            clear
          </i>
          <form onSubmit={(e) => {
            e.preventDefault();
            selectProfilePhoto()
          }}>
            <div>
              <span>Select your profile picture </span>
              <input type='file' ref='photoInput' onChange={this.selectProfilePhoto.bind(this)}/>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
