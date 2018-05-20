import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Input, Button } from 'react-materialize';

import ProfileImageModel from '../../ProfileImageModel';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    const { trackedItems } = props.settingsInfo;

    this.state = {
      trackedItems
    };
  }

  toggleTrackedItem(e) {
    const trackedItems = this.state.trackedItems.slice();
    if (trackedItems.includes(e.target.value)) {
      trackedItems.splice(trackedItems.indexOf(e.target.value), 1)
    } else {
      // trackedItems.push(e.target.value)
      const newPosition = (e.target.value === 'notable events' && trackedItems.includes('treatments')) ? 2 : 1;
      trackedItems.splice(newPosition, 0, e.target.value);
    }
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'profile.settings.trackedItems': trackedItems
      }
    });
    this.setState({
      trackedItems
    });
  }

  render() {
    return (
      <div className='account-info'>
        {this.props.showProfileImageModel && <ProfileImageModel />}

        <div className='account-info__heading'>Settings</div>
        <div className='account-info__subheading'>Tracked Items</div>
        <div className='section'>
          <Row>
            <Input name='trackedItems' type='checkbox' label='Symptoms' value='symptoms' defaultChecked={this.state.trackedItems.includes('symptoms')} disabled='disabled' />
            <Input name='trackedItems' type='checkbox' label='Treatments' value='treatments' defaultChecked={this.state.trackedItems.includes('treatments')} onChange={this.toggleTrackedItem.bind(this)} />
            <Input name='trackedItems' type='checkbox' label='Notable Events' value='notable events' defaultChecked={this.state.trackedItems.includes('notable events')} onChange={this.toggleTrackedItem.bind(this)}/>
          </Row>
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
      </div>
    );
  }
};

export default createContainer(props => {
  // const trackedItems = props.userInfo.profile.settings.trackedItems
  // const trackedItems = Meteor.user().profile.settings.trackedItems
  // console.log(trackedItems);
  return {
    showProfileImageModel: Session.get('showProfileImageModel'),
    userPhoto: (Meteor.user() && Meteor.user().profile.userPhoto) ? Meteor.user().profile.userPhoto : undefined,
  }
}, Settings)
