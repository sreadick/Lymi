import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Input, Button } from 'react-materialize';

class Settings extends React.Component {
  render() {
    return (
      <div className='account-info'>
        <div className='account-info__heading'>Settings</div>
      </div>
    );
  }
};

export default createContainer(props => {
  return {

  }
}, Settings)
