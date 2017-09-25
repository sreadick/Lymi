import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

const Home = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return (
    <div className='indigo darken-2 page-content'>
      <div className="page-content__main-heading">Home Page</div>
    </div>
  );
};

export default createContainer(() => {
  return {
    isFetching: false
  };
}, Home);
