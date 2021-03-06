import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { Row, Input, Button } from 'react-materialize';

export default class WelcomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trackedItems: Meteor.user().profile.settings.trackedItems
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
      <div className="page-content page-content-welcome-page">
        <div className='section'>
          <h3 className='deep-purple-text text-darken-2'>Welcome to LymeLog {Meteor.user().profile.firstName}!</h3>
        </div>
        <div className='section'></div>
        <div className='section'>
          <p>Select which items you wish to track in addition to your symptoms. We <strong>strongly</strong> recommend leaving treatments selected so that you and your physician can better monitor your progression. These options can be changed at any time via your account page</p>
        </div>
        <div className='section'>
          <Input className='filled-in' name='trackedItems' type='checkbox' label='Symptoms' value='symptoms' checked={this.state.trackedItems.includes('symptoms')} labelClassName={this.state.trackedItems.includes('symptoms') ? 'black-text' : ''} disabled='disabled' />
          <Input className='filled-in' name='trackedItems' type='checkbox' label='Treatments' value='treatments' checked={this.state.trackedItems.includes('treatments')} labelClassName={this.state.trackedItems.includes('treatments') ? 'black-text' : ''} onChange={this.toggleTrackedItem.bind(this)} />
          <Input className='filled-in' name='trackedItems' type='checkbox' label='Notable Events' value='notable events' checked={this.state.trackedItems.includes('notable events')} labelClassName={this.state.trackedItems.includes('notable events') ? 'black-text' : ''} onChange={this.toggleTrackedItem.bind(this)}/>
        </div>
        <div className='section'></div>
        <div className='message--treatment-date'>
          LymeLog is all about tracking your progress so we ask that you take the time to briefly "check-in" every day with your Lyme related symptoms and treatments. If you have other conditions or treatments that you don't with to track daily, for you and your doctor's benefit we urge you to add them to your medical profile via your "account" page.
        </div>
        <div className='section'></div>
        <div className='section'>
          <Button
            className='waves-effect waves-light btn-large black'
            onClick={() => {
              Meteor.call('users.updateAccountStatus', {userId: Meteor.userId(), status: 'initialized'}, (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  this.props.history.push('/patient/selectsymptoms')
                }
              })
            }}>
            Next: Select Symptoms
          </Button>
        </div>
      </div>
    );
  }
}
