import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

const PtInfoSideNav = (props) => (
  <div className='pt-summary__navbar'>
    <a href='#SxHeading' className={`pt-summary__navbar__link ${props.activeLink === 'symptoms' && 'active'}`}>
      Symptoms
    </a>
    <a href='#RxHeading' className={`pt-summary__navbar__link ${props.activeLink === 'treatments' && 'active'}`}>
      Treatments
    </a>
    <a href='#InfoHeading' className={`pt-summary__navbar__link ${props.activeLink === 'info' && 'active'}`}>
      User Info
    </a>
  </div>
);

export default createContainer((props) => {
  return {

  };

}, PtInfoSideNav);
