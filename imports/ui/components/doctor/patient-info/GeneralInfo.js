import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

class GeneralInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      // activeLink: 'symptoms',
    };
  }

  render() {
    const {props} = this;

    return (
      <div className='pt-summary__section'>
        {/* <ScrollableAnchor id={'InfoHeading'}>
          <div className='pt-summary__heading pt-summary__heading--info'>Patient Info</div>
        </ScrollableAnchor> */}
        <div className='pt-summary__subsection'>
          <div className='pt-summary__subheading'>Personal</div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Birthday: </span>
            <span className='pt-summary__item__response'>September 28th 1983</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Address: </span>
            <span className='pt-summary__item__response'>123 Fake St. Apt 2F, New York, NY 10018</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Email: </span>
            <span className='pt-summary__item__response'>dannyash@gmail.com</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Home Phone: </span>
            <span className='pt-summary__item__response'>Not Listed</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Cell Phone: </span>
            <span className='pt-summary__item__response'>(555)-123-4567</span>
          </div>
        </div>

        <div className='pt-summary__subsection'>
          <div className='pt-summary__subheading'>Medical</div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Tick-Borne Infections: </span>
            <span className='pt-summary__item__response'>Lyme, Bartonella, Babesia</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Initial Diagnosis: </span>
            <span className='pt-summary__item__response'>June 11th 2017</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Height: </span>
            <span className='pt-summary__item__response'>5'10"</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Weight: </span>
            <span className='pt-summary__item__response'>185lbs</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Sex: </span>
            <span className='pt-summary__item__response'>M</span>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Non-Lyme Complications: </span>
            <ul className='pt-summary__item__list'>
              <li>Diabetes (Type 1)</li>
              <li>Hypertension</li>
            </ul>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Other Physicians: </span>
            <ul className='pt-summary__item__list'>
              <li>Oliver Katz (PCP) - phone: (555)-444-3333</li>
            </ul>
          </div>
        </div>

        <div className='pt-summary__subsection'>
          <div className='pt-summary__subheading'>Appointments</div>
          <div className='pt-summary__item'>
            {/* <span className='pt-summary__item__label'>Other Physicians: </span> */}
            <ul className='pt-summary__item__list'>
              <li>07/09/17</li>
              <li>
                09/17/17
                <span>-Notes: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>

              </li>
              <li>12/28/17</li>
              <li>
                03/22/18
                <span>-Notes: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
              </li>
            </ul>
          </div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Next Visit: </span>
            <span className='pt-summary__item__response'>06/13/18</span>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer((props) => {
  return {

  };

}, GeneralInfo);
