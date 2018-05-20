import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import {capitalizePhrase} from '/imports/utils/utils';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input } from 'react-materialize';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';
import ReactTooltip from 'react-tooltip';

import { CheckinHistories } from '../../../api/checkin-histories';
import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';

import Loader from '/imports/ui/components/Loader';
// import SymptomChart from '../../components/patient/SymptomChart';
import TreatmentChart from '../../components/patient/TreatmentChart';

import PtInfoSideNav from '../../components/doctor/PtInfoSideNav';
import SxInfo from '../../components/doctor/patient-info/SxInfo';
import RxInfo from '../../components/doctor/patient-info/RxInfo';
import GeneralInfo from '../../components/doctor/patient-info/GeneralInfo';
import NotableEvents from '../../components/patient/NotableEvents';

// import EventsInfo from '../../components/doctor/patient-info/EventsInfo';

// Todo: App crashes if no check-ins or specific check-in items (e.g. notable events).

configureAnchors({offset: -120, scrollDuration: 800});

class PatientSummary2 extends React.Component {
  constructor() {
    super();

    this.state = {
      // activeLink: 'symptoms',
      activeTab: 'symptoms'
    };
  }
  // componentDidMount() {
  //   const symptomAnchorTopPosition = document.querySelector('.pt-summary__heading--symptoms').getBoundingClientRect().top;
  //   const treatmentAnchorTopPosition = document.querySelector('.pt-summary__heading--treatments').getBoundingClientRect().top;
  //   const infoAnchorTopPosition = document.querySelector('.pt-summary__heading--info').getBoundingClientRect().top;
  //   const header1height = document.querySelector('.nav-header.private.doctor').getBoundingClientRect().height;
  //   const header2height = document.querySelector('.pt-summary__header__wrapper').getBoundingClientRect().height;
  //   const headerHeights = header1height + header2height;
  //
  //   document.addEventListener('scroll', () => {
  //     if (window.scrollY + headerHeights >= Math.floor(infoAnchorTopPosition)) {
  //       this.setState({activeLink: 'info'})
  //     } else if (window.scrollY + headerHeights >= Math.floor(treatmentAnchorTopPosition)) {
  //       this.setState({activeLink: 'treatments'})
  //     } else {
  //       this.setState({activeLink: 'symptoms'})
  //     }
  //   })
  // }
  componentDidMount() {
    // const subsectionSelectFive = document.querySelector('#pt-summary__subsection--select-five');

    // const symptomAnchorTopPosition = document.querySelector('.pt-summary__heading--symptoms').getBoundingClientRect().top;
    // const treatmentAnchorTopPosition = document.querySelector('.pt-summary__heading--treatments').getBoundingClientRect().top;
    // const infoAnchorTopPosition = document.querySelector('.pt-summary__heading--info').getBoundingClientRect().top;
    // const header1height = document.querySelector('.nav-header.private.doctor').getBoundingClientRect().height;
    // const header2height = document.querySelector('.pt-summary__header__wrapper').getBoundingClientRect().height;
    // const headerHeights = header1height + header2height;

    // document.addEventListener('scroll', () => {
    //   if (window.scrollY + headerHeights >= Math.floor(infoAnchorTopPosition)) {
    //     this.setState({activeLink: 'info'})
    //   } else if (window.scrollY + headerHeights >= Math.floor(treatmentAnchorTopPosition)) {
    //     this.setState({activeLink: 'treatments'})
    //   } else {
    //     this.setState({activeLink: 'symptoms'})
    //   }
    // })
  }

  render() {
    const {props} = this;

    if (props.isFetching) {
      return (
        <Loader />
      );
    } else if (!props.patient) {
      return (
        <div className='page-content doctor'>
          <h2>Patient Not Found</h2>
          <Link className='blue btn' to='/doctor/home'>Go Back</Link>
        </div>
      )
    }
    return (
      <div className='page-content--pt-summary'>
        <div className='pt-summary__header__wrapper'>
          {props.patient &&
            <div className='pt-summary__header'>
              <span className='pt-summary__header__pt-name'>{props.patient.profile.firstName} {props.patient.profile.lastName}</span>
              <div>
                {/* {['symptoms', 'treatments', 'notable events', 'user info'].map(tabName => {
                  if (tabName === 'treatments' || tabName === 'notable events') {

                  }
                  return (
                    <span
                      key={tabName}
                      className={`pt-summary__header__link ${this.state.activeTab === tabName && 'active'}`}
                      onClick={() => this.setState({activeTab: tabName})}>
                      {capitalizePhrase(tabName)}
                    </span>
                  );
                })} */}
                <span
                  className={`pt-summary__header__link ${this.state.activeTab === 'symptoms' && 'active'}`}
                  onClick={() => this.setState({activeTab: 'symptoms'})}>
                  Symptoms
                </span>
                <span
                  // className={`pt-summary__header__link ${this.state.activeTab === 'treatments' && 'active'}`}
                  // onClick={() => this.setState({activeTab: 'treatments'})}>
                  className={`pt-summary__header__link ${this.state.activeTab === 'treatments' ? 'active' : !props.patient.profile.settings.trackedItems.includes("treatments") ? 'disabled' : ''}`}
                  onClick={() => {
                    if (props.patient.profile.settings.trackedItems.includes('treatments')) {
                      this.setState({activeTab: 'treatments'})
                    }
                  }}
                  data-tip data-for='treatmentsTab'>
                  Treatments
                  {!props.patient.profile.settings.trackedItems.includes('treatments') &&
                    <ReactTooltip type='error' place='bottom' id='treatmentsTab' effect='solid'>
                      User is not recording treatments.
                    </ReactTooltip>
                  }
                </span>
                <span
                  className={`pt-summary__header__link ${this.state.activeTab === 'notable events' ? 'active' : !props.patient.profile.settings.trackedItems.includes("notable events") ? 'disabled' : ''}`}
                  onClick={() => {
                    if (props.patient.profile.settings.trackedItems.includes('notable events')) {
                      this.setState({activeTab: 'notable events'})
                    }
                  }}
                  data-tip data-for='notableEventsTab'>
                  Notable Events
                  {!props.patient.profile.settings.trackedItems.includes('notable events') &&
                    <ReactTooltip type='error' place='bottom' id='notableEventsTab' effect='solid'>
                      User is not recording notable events.
                    </ReactTooltip>
                  }
                </span>
                <span
                  className={`pt-summary__header__link ${this.state.activeTab === 'user info' && 'active'}`}
                  onClick={() => this.setState({activeTab: 'user info'})}>
                  User Info
                </span>
              </div>
              <button
                className='btn right red darken-2'
                onClick={() => alert("This feature is not yet implemented. It would allow doctors to send app related notifcations, such as a request to provide more in-app information (e.g. 'please fill out medical information'). This message system will be one-way (doctor to patient) so as not to inundate doctor's accounts with messages from all their patients'. Notifications will be displayed on the 'Notifcation Sidebar' on the Pt Dashboard page as well as the 'Notifcation Dropdown' on the top nav-bar. It will take 2 days tops to complete, let me know if you see the value and want me to procede")}>
                Send Message
              </button>
            </div>
          }
        </div>

        <div className='pt-summary__flex-wrapper'>
          <div className='pt-summary__content'>
            {this.state.activeTab === 'symptoms' ?
              <SxInfo
                patientSymptoms={props.patientSymptoms}
                checkins={props.patientCheckinHistory.checkins}
                patientSxSystems={props.patientSxSystems}
              />
            : this.state.activeTab === 'treatments' ?
              <RxInfo />
            : this.state.activeTab === 'notable events' ?
              <div className='pt-summary__section'>
                <div className='pt-summary__subsection'>
                  <div className='pt-summary__subheading'>Select Date</div>
                  <NotableEvents checkins={props.patientCheckinHistory.checkins.filter(checkin => !!checkin.notableEvents)}/>
                </div>
              </div>
            :
              <GeneralInfo />
            }


          </div>

          <div className='pt-summary__navbar__wrapper'>
            {/* <PtInfoSideNav activeLink={this.state.activeLink}/> */}
            <PtInfoSideNav activeLink={undefined}/>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  const patientId = props.computedMatch.params.patientId;
  const currentPatientsHandle = Meteor.subscribe('currentPatients');
  const patientSymptomsHandle = Meteor.subscribe('patientSymptoms', patientId);
  const patientTreatmentsHandle = Meteor.subscribe('patientTreatments', patientId);
  const patientCheckinHistoriesHandle = Meteor.subscribe('patientCheckinHistories', patientId);

  const patientSymptoms = UserSymptoms.find().fetch();
  const patientTreatments = UserTreatments.find().fetch();
  const patientCheckinHistory = CheckinHistories.findOne();

  // Todo: Optimize
  let patientSxSystems = [];
  patientSymptoms.forEach((symptom) => {
    if (!patientSxSystems.includes(symptom.system)) {
      patientSxSystems.push(symptom.system);
    }
  })
  return {
    patient: Meteor.users.findOne({_id: patientId}),
    patientSymptoms,
    patientTreatments,
    patientCheckinHistory,
    patientSxSystems,
    isFetching: !currentPatientsHandle.ready() || !patientCheckinHistoriesHandle.ready() || !patientSymptomsHandle.ready() || !patientTreatmentsHandle.ready()
  };
}, PatientSummary2);
