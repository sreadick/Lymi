import React from 'react';
import { Meteor } from 'meteor/meteor';

export default PtInfoSideNav = (props) => (
  <div className='pt-summary__navbar'>
    {props.links.map(link =>
      <a
        key={link.name}
        // className={`pt-summary__navbar__link ${props.activeLink === link && 'active'}`}
        className={`pt-summary__navbar__link`}
        href={`#heading--${link.name}`}
        id={`pt-summary__navbar__link--${link.name}`}>
        {link.displayedName}
      </a>
    )}
    {/* <a href='#SxHeading' className={`pt-summary__navbar__link ${props.activeLink === 'symptoms' && 'active'}`}>
      Symptoms
    </a>
    <a href='#RxHeading' className={`pt-summary__navbar__link ${props.activeLink === 'treatments' && 'active'}`}>
      Treatments
    </a>
    <a href='#InfoHeading' className={`pt-summary__navbar__link ${props.activeLink === 'info' && 'active'}`}>
      User Info
    </a> */}
  </div>
);
