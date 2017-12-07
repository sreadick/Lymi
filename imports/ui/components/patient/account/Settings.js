import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Input, Button } from 'react-materialize';

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
      trackedItems.push(e.target.value)
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
        <div className='account-info__heading'>Settings</div>
        <div className='account-info__subheading'>Tracked Items</div>
        <div className='section'>
          <Row>
            <Input name='trackedItems' type='checkbox' label='Symptoms' value='symptoms' defaultChecked={this.state.trackedItems.includes('symptoms')} disabled='disabled' />
            <Input name='trackedItems' type='checkbox' label='Treatments' value='treatments' defaultChecked={this.state.trackedItems.includes('treatments')} onChange={this.toggleTrackedItem.bind(this)} />
            <Input name='trackedItems' type='checkbox' label='Notable Events' value='notable events' defaultChecked={this.state.trackedItems.includes('notable events')} onChange={this.toggleTrackedItem.bind(this)}/>
          </Row>
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
    // trackedItems
  }
}, Settings)
