import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Row, Col, Input } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

import PtInfoSideNav from '../PtInfoSideNav';
import CheckinPieChart from '../../patient/CheckinPieChart';


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
    this.accountSection = document.querySelector('#pt-summary__subsection--general--account').getBoundingClientRect().top;
    this.historySection = document.querySelector('#pt-summary__subsection--general--history').getBoundingClientRect().top;

    this.personalLink = document.getElementById('pt-summary__navbar__link--personal');
    this.medicalLink = document.getElementById('pt-summary__navbar__link--medical');
    this.apptsLink = document.getElementById('pt-summary__navbar__link--appointments');
    this.accountLink = document.getElementById('pt-summary__navbar__link--account');
    this.historyLink = document.getElementById('pt-summary__navbar__link--history');

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
    this.accountLink.classList.remove('active');
    this.historyLink.classList.remove('active');

    if (window.scrollY + this.props.headerHeights >= Math.floor(this.historySection)) {
      this.historyLink.classList.add('active');
    } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.accountSection)) {
      this.accountLink.classList.add('active');
    } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.apptsSection)) {
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
    const {profile, account} = this.props.patientInfo;
    const { medical } = profile;
    console.log(this.props.patientInfo);
    return (
      <div className='pt-summary__flex-wrapper'>
        <div className='pt-summary__content'>
          <div className='pt-summary__section'>
            <div className='pt-summary__subsection' id='pt-summary__subsection--general--personal'>
              <ScrollableAnchor id={'heading--personal'}>
                <div className='pt-summary__subheading'>Personal Information</div>
              </ScrollableAnchor>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Full Name: </span>
                <span className='pt-summary__item__response'>{profile.firstName} {profile.middleInitial && profile.middleInitial.charAt(0).toUpperCase() + profile.middleInitial.slice(1)} {profile.lastName}</span>
              </div>
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
                {/* <span className='pt-summary__item__response'>123 Fake St. Apt 2F, New York, NY 10018</span> */}
                <span className='pt-summary__item__response'>
                  {profile.street ?
                      <span>{profile.street} {profile.apartment && 'Apt ' + profile.apartment} {profile.city} {profile.state} {profile.zip}</span>
                  :
                    'N/A'
                  }
                </span>
              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Email: </span>
                <span className='pt-summary__item__response'>{this.props.patientInfo.emails[0].address}</span>
              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Home Phone: </span>
                <span className='pt-summary__item__response'>{profile.homePhone || 'N/A'}</span>
              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Cell Phone: </span>
                <span className='pt-summary__item__response'>{profile.cellPhone || 'N/A'}</span>
              </div>
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--general--medical'>
              <ScrollableAnchor id={'heading--medical'}>
                <div className='pt-summary__subheading'>Medical Information</div>
              </ScrollableAnchor>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Tick-Borne Infections: </span>
                {/* <span className='pt-summary__item__response'>Lyme, Bartonella, Babesia</span> */}
                {profile.medical.tickBorneDiseases.length > 0 ?
                  <ul className='pt-summary__item__list'>
                    {profile.medical.tickBorneDiseases.map(disease =>
                      <li key={disease}>{disease}</li>
                    )}
                  </ul>
                  :
                  <span className='pt-summary__item__response'>N/A</span>
                }

              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Initial Diagnosis: </span>
                {/* <span className='pt-summary__item__response'>June 11th 2017</span> */}
                <span className='pt-summary__item__response'>
                  {(medical.initialInfectionDate.month && medical.initialInfectionDate.day && medical.initialInfectionDate.year) ?
                    <span>{medical.initialInfectionDate.month} {medical.initialInfectionDate.day} {medical.initialInfectionDate.year}</span>
                    :
                    'N/A'
                  }
                </span>
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
                <span className='pt-summary__item__label'>Past Visits: </span>
                {(medical.appointments && medical.appointments.filter(appt => moment(appt).isBefore(moment())).length > 0) ?
                  <ol className='pt-summary__item__list pt-summary__item__list--ordered'>
                    {medical.appointments.filter(appt => moment(appt).isSameOrBefore(moment())).sort((apptA, apptB) => apptA - apptB).map((appt, index) =>
                      <li key={index}>{moment(appt).format('MM/DD/YY')}</li>
                    )}
                  </ol>
                :
                  <span className='pt-summary__item__response'>N/A</span>
                }

              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Next Visit: </span>
                <span className='pt-summary__item__response'>
                  {(medical.appointments && medical.appointments.find(appt => moment(appt).isAfter(moment()))) ?
                    <p>{moment(medical.appointments.find(appt => moment(appt).isAfter(moment()))).format('MM/DD/YY (h:mm a)')}</p>
                  :
                    'N/A'
                  }
                </span>
              </div>
              {/* <div className='pt-summary__item'>
                <ol className='pt-summary__item__list pt-summary__item__list--ordered'>
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
                </ol>
              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Next Visit: </span>
                <span className='pt-summary__item__response'>06/13/18</span>
              </div> */}
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--general--account'>
              <ScrollableAnchor id={'heading--account'}>
                <div className='pt-summary__subheading'>Account</div>
              </ScrollableAnchor>

              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Joined: </span>
                <span className='pt-summary__item__response'>{moment(account.createdAt).format("MM-DD-YY")}</span>
              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Username: </span>
                <span className='pt-summary__item__response'>{this.props.patientInfo.username || "N/A"}</span>
              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Lyme Share Topics: </span>
                <ul className='pt-summary__item__list'>
                  {this.props.patientForumTopics.map(topic =>
                    <li key={topic._id}>{topic.title}</li>
                  )}
                </ul>
              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Check-in compliance: </span>
                <span className='pt-summary__item__response'>{this.props.checkinComplianceData.roundedCheckinPercentage}%</span>
                <div className='pt-summary__item__checkin-chart__container'>
                  <CheckinPieChart
                    daysCheckedIn={this.props.checkinComplianceData.daysCheckedIn}
                    daysNotCheckedIn={this.props.checkinComplianceData.daysNotCheckedIn}
                    animate={false}
                    showLegend={false}
                    height={140}
                    // padding={{top: 10}}
                  />
                </div>
              </div>
              <div className='pt-summary__item'>
                <span className='pt-summary__item__label'>Last Check-in: </span>
                <span className='pt-summary__item__response'>{this.props.checkinHistory ? moment(this.props.checkinHistory.lastCheckin).format('MMMM Do YYYY') : 'N/A'}</span>
              </div>
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--general--history'>
              <ScrollableAnchor id={'heading--history'}>
                <div className='pt-summary__subheading'>History</div>
              </ScrollableAnchor>

              {this.props.checkinHistory.checkins.slice().reverse().map(checkin =>
                <div className="section" key={checkin.date}>
                  <h4>{checkin.date}</h4>
                  {/* <h5>Symptoms</h5> */}
                  <table className='striped'>
                    <thead>
                      <tr>
                        <th>Symptoms</th>
                        <th>Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkin.symptoms.map(checkinSymptom =>
                        <tr key={checkinSymptom.name}>
                          <td>{capitalizePhrase(checkinSymptom.name)}</td>
                          <td>{checkinSymptom.severity === 0 ? 'N/A' : checkinSymptom.severity}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {(checkin.treatments && checkin.treatments.length > 0) &&
                    <table className='striped'>
                      {/* <h5>Treatments</h5> */}
                      <thead>
                        <tr>
                          <th>Treatments</th>
                          <th>Compliance</th>
                        </tr>
                      </thead>
                      <tbody>
                        { checkin.treatments.length === 0 ?
                          <tr>
                            <td className="grey-text">No Treatments This Day</td>
                          </tr>
                        :
                          checkin.treatments.map(checkinTreatment =>
                            <tr key={checkinTreatment.name}>
                              <td>{checkinTreatment.name}</td>
                              <td>
                                { (checkinTreatment.prescribedToday === false || checkinTreatment.compliance === 'NPD') ? "Not Prescribed Today"
                                  : checkinTreatment.compliance === null ? 'Not Specified'
                                  : checkinTreatment.compliance
                                }
                              </td>
                            </tr>
                          )
                        }
                      </tbody>
                    </table>
                  }
                  {checkin.notableEvents &&
                    <table className=''>
                      <thead>
                        <tr>
                          <th>Notable Events</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{checkin.notableEvents}</td>
                        </tr>
                      </tbody>
                    </table>
                  }
                </div>
              )}

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
              },
              {
                name: 'account',
                displayedName: 'Account'
              },
              {
                name: 'history',
                displayedName: 'History'
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
