import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

import PtInfoSideNav from '../PtInfoSideNav';

configureAnchors({offset: -120, scrollDuration: 800});

export default class GeneralInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      // activeLink: 'personal',
      // navLinks: ['personal', 'medical', 'appointments']
    };

    this.handleScrolling = this.handleScrolling.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.personalSection = document.querySelector('#pt-summary__subsection--general--personal').getBoundingClientRect().top;
    this.medicalSection = document.querySelector('#pt-summary__subsection--general--medical').getBoundingClientRect().top;
    this.apptsSection = document.querySelector('#pt-summary__subsection--general--appts').getBoundingClientRect().top;

    this.personalLink = document.getElementById('pt-summary__navbar__link--personal');
    this.medicalLink = document.getElementById('pt-summary__navbar__link--medical');
    this.apptsLink = document.getElementById('pt-summary__navbar__link--appointments');

    this.personalLink.classList.add('active');
    document.addEventListener('scroll', this.handleScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrolling);
  }

  handleScrolling() {
    this.personalLink.classList.remove('active');
    this.medicalLink.classList.remove('active');
    this.apptsLink.classList.remove('active');

    if (window.scrollY + this.props.headerHeights >= Math.floor(this.apptsSection)) {
      this.apptsLink.classList.add('active');
    } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.medicalSection)) {
      this.medicalLink.classList.add('active');
    } else {
      this.personalLink.classList.add('active');
    }
    // if (window.scrollY + this.props.headerHeights >= Math.floor(this.apptsSection)) {
    //   this.setState({activeLink: 'appointments'})
    // } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.medicalSection)) {
    //   this.setState({activeLink: 'medical'})
    // } else {
    //   this.setState({activeLink: 'personal'})
    // }
  }

  render() {
    const {profile} = this.props.patientInfo;
    console.log(profile);
    return (
      <div className='pt-summary__flex-wrapper'>
        <div className='pt-summary__content'>
          <div className='pt-summary__section'>
            <div className='pt-summary__subsection' id='pt-summary__subsection--general--personal'>
              <ScrollableAnchor id={'heading--personal'}>
                <div className='pt-summary__subheading'>Personal Information</div>
              </ScrollableAnchor>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Birthday: </span>
                <span className='pt-summary__item__response'>
                  { (profile.birthMonth && profile.birthDay && profile.birthYear) 
                    ?
                    `${profile.birthMonth} ${profile.birthDay}, ${profile.birthYear}`
                    :
                    "N/A"
                  }
                </span>
                {/* <span className='pt-summary__item__response'>September 28th 1983</span> */}
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

            <div className='pt-summary__subsection' id='pt-summary__subsection--general--medical'>
              <ScrollableAnchor id={'heading--medical'}>
                <div className='pt-summary__subheading'>Medical Information</div>
              </ScrollableAnchor>
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

            <div className='pt-summary__subsection' id='pt-summary__subsection--general--appts'>
              <ScrollableAnchor id={'heading--appointments'}>
                <div className='pt-summary__subheading'>Appointments</div>
              </ScrollableAnchor>
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
        </div>
        <div className='pt-summary__navbar__wrapper'>
          <PtInfoSideNav
            // activeLink={this.state.activeLink}
            // links={this.state.navLinks}
            links={[
              {
                name: 'personal',
                displayedName: 'Personal Information'
              },
              {
                name: 'medical',
                displayedName: 'Medical Information'
              },
              {
                name: 'appointments',
                displayedName: 'Appointments'
              }
            ]}
          />
        </div>
      </div>
    );
  }
}

// export default createContainer((props) => {
//   return {
//
//   };
//
// }, GeneralInfo);





// {/* <div className='pt-summary__section'>
//   <div className='pt-summary__subsection' id='pt-summary__subsection--general--personal'>
//     <ScrollableAnchor id={'heading--personal'}>
//       <div className='pt-summary__subheading'>Personal Information</div>
//     </ScrollableAnchor>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Birthday: </span>
//       <span className='pt-summary__item__response'>September 28th 1983</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Address: </span>
//       <span className='pt-summary__item__response'>123 Fake St. Apt 2F, New York, NY 10018</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Email: </span>
//       <span className='pt-summary__item__response'>dannyash@gmail.com</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Home Phone: </span>
//       <span className='pt-summary__item__response'>Not Listed</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Cell Phone: </span>
//       <span className='pt-summary__item__response'>(555)-123-4567</span>
//     </div>
//   </div>
//
//   <div className='pt-summary__subsection' id='pt-summary__subsection--general--medical'>
//     <ScrollableAnchor id={'heading--medical'}>
//       <div className='pt-summary__subheading'>Medical Information</div>
//     </ScrollableAnchor>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Tick-Borne Infections: </span>
//       <span className='pt-summary__item__response'>Lyme, Bartonella, Babesia</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Initial Diagnosis: </span>
//       <span className='pt-summary__item__response'>June 11th 2017</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Height: </span>
//       <span className='pt-summary__item__response'>5'10"</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Weight: </span>
//       <span className='pt-summary__item__response'>185lbs</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Sex: </span>
//       <span className='pt-summary__item__response'>M</span>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Non-Lyme Complications: </span>
//       <ul className='pt-summary__item__list'>
//         <li>Diabetes (Type 1)</li>
//         <li>Hypertension</li>
//       </ul>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Other Physicians: </span>
//       <ul className='pt-summary__item__list'>
//         <li>Oliver Katz (PCP) - phone: (555)-444-3333</li>
//       </ul>
//     </div>
//   </div>
//
//   <div className='pt-summary__subsection' id='pt-summary__subsection--general--appts'>
//     <ScrollableAnchor id={'heading--appointments'}>
//       <div className='pt-summary__subheading'>Appointments</div>
//     </ScrollableAnchor>
//     <div className='pt-summary__item'>
//       <ul className='pt-summary__item__list'>
//         <li>07/09/17</li>
//         <li>
//           09/17/17
//           <span>-Notes: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
//
//         </li>
//         <li>12/28/17</li>
//         <li>
//           03/22/18
//           <span>-Notes: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
//         </li>
//       </ul>
//     </div>
//     <div className='pt-summary__item'>
//       <span className='pt-summary__item__label'>Next Visit: </span>
//       <span className='pt-summary__item__response'>06/13/18</span>
//     </div>
//   </div>
// </div> */}
