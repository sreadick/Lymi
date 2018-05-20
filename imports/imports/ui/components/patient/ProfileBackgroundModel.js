import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { backgroundImages } from '../../../public/resources/backgroundImages';

export default class ProfileBackgroundModel extends React.Component {
  constructor(props) {
    super(props);

    this.handleBackgroundSelect = this.handleBackgroundSelect.bind(this);
  }
  handleBackgroundSelect(e, imageAddress) {
    if (imageAddress.trim().length > 0) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          'profile.backgroundURL': imageAddress.trim()
        }
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          Session.set('showProfileBackgroundModel', false);
        }
      })
    }
  }
  render() {
    return (
      <div className="boxed-view__box--profile-model__wrapper">
        <div className="boxed-view__box--profile-model">
          <i className='material-icons right'
            onClick={() => Session.set('showProfileBackgroundModel', false)}>
            clear
          </i>
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log(this.refs.backgroundURL.value);
            this.handleBackgroundSelect(e, this.refs.backgroundURL.value)
          }}>
            <h6>Select a background from the list below</h6>
            <ul className='background-image-list'>
              {backgroundImages.map((imageAddress) =>
                <li key={imageAddress}>
                  <img src={imageAddress} onClick={(e) => this.handleBackgroundSelect(e, imageAddress)} />
                </li>
              )}
            </ul>
            <h6>Or paste the url to your favoriate photo.</h6>
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
