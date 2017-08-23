import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


export default class ProfileBackgroundModel extends React.Component {
  render() {
    return (
      <div className="boxed-view__box--profile-background-model__wrapper">
        <div className="boxed-view__box--profile-background-model">
          <i className='material-icons right'
            onClick={() => Session.set('showProfileBackgroundModel', false)}>
            clear
          </i>
          <form onSubmit={(e) => {
            e.preventDefault();
            // console.log(Meteor.user().profile);
            // console.log(Meteor.user().profile.backgroundURL);
            if (this.refs.backgroundURL.value.trim().length > 0) {
              Meteor.users.update(Meteor.userId(), {
                $set: {
                  'profile.backgroundURL': this.refs.backgroundURL.value.trim()
                }
              }, (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  Session.set('showProfileBackgroundModel', false);
                }
              })
            }
          }}>
            <h6>Paste the url to your favoriate photo.</h6>
            <div className='input-field'>
              <input type='url' id='background-url' name='background-url' ref='backgroundURL' placeholder='http://example.com/file.jpg' />
              <label className='active' htmlFor='background-url'>Background url</label>
              <button className='deep-purple btn' type='submit'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
