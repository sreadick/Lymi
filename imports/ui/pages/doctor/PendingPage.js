import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
// import { Button } from 'react-materialize';

export default PendingPage = (props) => {

  return (
    <div className='page-content doctor white'>
      <p>Please be patient while we verify the information you provided. The process can take up to 24 hours.</p>
    </div>
  );
};
