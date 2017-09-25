import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Input, Button } from 'react-materialize';

class Settings extends React.Component {
  render() {
    return (
      <div className='account-info'>
        <div className='account-info__heading'>Settings</div>
        <div className='account-info__subheading'>Tracked Items</div>
        <div className='section'>
          <Row>
            <Input name='trackedItems' type='checkbox' label='Symptoms' disabled='disabled' />
            <Input name='trackedItems' type='checkbox' label='Treatments' disabled='disabled' />
          </Row>
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  return {

  }
}, Settings)
