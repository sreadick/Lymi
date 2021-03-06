import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import {capitalizePhrase, sortSymptoms, getExtendedTreatmentHistory, getCheckinComplianceData} from '/imports/utils/utils';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Row, Col, Input } from 'react-materialize';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';
import ReactTooltip from 'react-tooltip';

import { CheckinHistories } from '../../../api/checkin-histories';
import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { Topics } from '../../../api/forum';

import Loader from '/imports/ui/components/Loader';

import MessageBox from '../../components/doctor/MessageBox';
import PtInfoSideNav from '../../components/doctor/PtInfoSideNav';
import SxInfo from '../../components/doctor/patient-info/SxInfo';
import RxInfo from '../../components/doctor/patient-info/RxInfo';
import GeneralInfo from '../../components/doctor/patient-info/GeneralInfo';
import EventsInfo from '../../components/doctor/patient-info/EventsInfo';

// import EventsInfo from '../../components/doctor/patient-info/EventsInfo';

// Todo: App crashes if no check-ins or specific check-in items (e.g. notable events).
// Todo: Make configureAnchors offset dynamic).
// Todo: History bar breaks pt name is too long

configureAnchors({offset: -120, scrollDuration: 800});

class PatientSummary2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // activeLink: 'symptoms',
      activeTab: 'user info',
      headerHeights: 0,
      dateRangeOption: 'all_dates',
      graphStartDate: '',
      graphEndDate: ''
    };
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.patientCheckinHistory && !!this.props.patientCheckinHistory) {
      this.setState({
        graphStartDate: this.props.patientCheckinHistory.checkins.length > 0 ? this.props.patientCheckinHistory.checkins[0].date : undefined,
        graphEndDate: this.props.patientCheckinHistory.checkins.length > 0 ? this.props.patientCheckinHistory.checkins[this.props.patientCheckinHistory.checkins.length - 1].date : undefined
      })
    }
  }
  componentDidMount() {
  //   const symptomAnchorTopPosition = document.querySelector('.pt-summary__heading--symptoms').getBoundingClientRect().top;
  //   const treatmentAnchorTopPosition = document.querySelector('.pt-summary__heading--treatments').getBoundingClientRect().top;
  //   const infoAnchorTopPosition = document.querySelector('.pt-summary__heading--info').getBoundingClientRect().top;
    const header1height = document.querySelector('.nav-header.private.doctor').getBoundingClientRect().height;
    // console.log(header1height);
    this.setState({headerHeights: header1height * 2})
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
  }

  handleDateRangeChange(customRangeControl, rangeValue) {
    const currentDate = moment().format('MMMM Do YYYY');
    const initialCheckinDate = (this.props.patientCheckinHistory && this.props.patientCheckinHistory.checkins.length > 0 ) ? this.props.patientCheckinHistory.checkins[0].date : undefined;
    if (customRangeControl === undefined) {
      if (rangeValue === 'all_dates') {
        this.setState({
          'graphStartDate': initialCheckinDate,
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'seven_days') {
        this.setState({
          'graphStartDate': moment(currentDate, 'MMMM Do YYYY').subtract(6, 'days').format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'thirty_days') {
        this.setState({
          'graphStartDate': moment(currentDate, 'MMMM Do YYYY').subtract(29, 'days').format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'twelve_months') {
        this.setState({
          'graphStartDate': moment(currentDate, 'MMMM Do YYYY').subtract(1, 'year').format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'year_to_current') {
        this.setState({
          'graphStartDate': moment(currentDate, 'MMMM Do YYYY').startOf('year').format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'prev_appt_to_current') {
        const appts = Meteor.user().profile.medical.appointments.slice().reverse();
        const lastAppt = appts.find(date => moment(date).isBefore(moment()));
        this.setState({
          'graphStartDate': moment(lastAppt).format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'custom' && this.state.dateRangeOption !== 'custom') {
        this.setState({
          'graphStartDate': initialCheckinDate,
          'graphEndDate': currentDate
        });
      }
      this.setState({'dateRangeOption': rangeValue});
    } else {
      this.setState({[customRangeControl]: rangeValue});
    }
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
          <h2 className='white-text'>Patient Not Found</h2>
          <Link className='blue btn' to='/doctor/home'>Go Back</Link>
        </div>
      )
    } else if (!props.patientCheckinHistory.checkins || props.patientCheckinHistory.checkins.length === 0) {
      return (
        <div className='page-content doctor'>
          <h2 className='white-text'>No Patient History</h2>
          <Link className='blue btn' to='/doctor/home'>Go Back</Link>
        </div>
      )
    }
    return (
      <div className='page-content--pt-summary'>
        {props.showMessageBox &&
          <MessageBox
            patient={props.patient}
          />
        }
        <div className='pt-summary__header__wrapper'>
          <div className='pt-summary__header'>
            <div className='pt-summary__header__pt-name'>
              <i
                className='material-icons'
                onClick={() => props.history.push('/doctor/home')}>
                keyboard_arrow_left
              </i>
              {props.patient.profile.firstName} {props.patient.profile.lastName}
              {/* <div></div> */}
            </div>

            <div>
              <span
                className={`pt-summary__header__link ${this.state.activeTab === 'user info' && 'active'}`}
                onClick={() => this.setState({activeTab: 'user info'})}>
                User Data
              </span>
              <span
                className={`pt-summary__header__link ${this.state.activeTab === 'symptoms' && 'active'}`}
                onClick={() => this.setState({activeTab: 'symptoms'})}>
                Symptoms
              </span>
              <span
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
            </div>



            <div className='row pt-summary__header__date-container'>
              <Input
                s={5}
                type='select'
                // label='Date Range'
                value={this.state.dateRangeOption}
                onChange={(e) => this.handleDateRangeChange(undefined, e.target.value)}>
                <option value='all_dates'>All Dates</option>
                <option value='seven_days'>Last 7 Days</option>
                <option value='thirty_days'>Last 30 Days</option>
                <option value='twelve_months'>Last 12 Months</option>
                <option value='year_to_current'>Year to Date</option>
                {props.patient.profile.medical.appointments &&
                  <option value='prev_appt_to_current'>Since Last Appointment</option>
                }
                <option value='custom'>Custom Range</option>
              </Input>
              {this.state.dateRangeOption === 'custom' &&
                <Input
                  s={3}
                  type='select'
                  // label='End Date'
                  disabled={this.state.dateRangeOption !== 'custom'}
                  value={this.state.graphEndDate || ''}
                  onChange={(e) => this.handleDateRangeChange('graphEndDate', e.target.value)}>
                  {props.patientCheckinHistory.checkins.map(checkin => checkin.date).map(date =>
                    <option
                      key={date}
                      value={date}
                      disabled={moment(date, 'MMMM Do YYYY').isBefore(moment(this.state.graphStartDate, "MMMM Do YYYY"), 'day')}>
                      {/* {date} */}
                      {moment(date, 'MMMM Do YYYY').format('MM/DD/YY')}
                    </option>
                  )}
                </Input>
              }
              {this.state.dateRangeOption === 'custom' &&
                <Input
                  s={3}
                  type='select'
                  // label='Start Date'
                  disabled={this.state.dateRangeOption !== 'custom'}
                  value={this.state.graphStartDate || ''}
                  onChange={(e) => this.handleDateRangeChange('graphStartDate', e.target.value)}>
                  {props.patientCheckinHistory.checkins.map(checkin => checkin.date).map(date =>
                    <option
                      key={date}
                      value={date}
                      disabled={moment(date, 'MMMM Do YYYY').isAfter(moment(this.state.graphEndDate, "MMMM Do YYYY"), 'day')}>
                      {/* {date} */}
                      {moment(date, 'MMMM Do YYYY').format('MM/DD/YY')}
                    </option>
                  )}
                </Input>
              }

            </div>


            <button
              className='btn right red darken-4'
              onClick={() => Session.set('showMessageBox', true)}>
              {/* onClick={() => alert("This feature is not yet implemented. It would allow doctors to send app related notifcations, such as a request to provide more in-app information (e.g. 'please fill out medical information'). This message system will be one-way (doctor to patient) so as not to inundate doctor's accounts with messages from all their patients'. Notifications will be displayed on the 'Notifcation Sidebar' on the Pt Dashboard page as well as the 'Notifcation Dropdown' on the top nav-bar. It will take 2 days tops to complete, let me know if you see the value and want me to procede")}> */}
              Send Message
            </button>
          </div>
        </div>

        {/* <div className='pt-summary__flex-wrapper'>
          <div className='pt-summary__content'> */}
            {this.state.activeTab === 'symptoms' ?
              <SxInfo
                patientSymptoms={props.patientSymptoms}
                highestSeveritySymptoms={props.highestSeveritySymptoms}
                biggestChangeSymptoms={props.biggestChangeSymptoms}
                // checkins={props.patientCheckinHistory.checkins}
                checkins={ props.patientCheckinHistory.checkins.filter(checkin => moment(checkin.date, 'MMMM Do YYYY').isBetween(moment(this.state.graphStartDate, 'MMMM Do YYYY'), moment(this.state.graphEndDate, 'MMMM Do YYYY'), 'days', [])) }

                patientSxSystems={props.patientSxSystems}
                headerHeights={this.state.headerHeights}
              />
            : this.state.activeTab === 'treatments' ?
              <RxInfo
                patientTreatments={props.patientTreatments}
                // checkins={props.patientCheckinHistory.checkins}
                checkins={getExtendedTreatmentHistory(props.patientTreatments, props.patientCheckinHistory.checkins).slice(-14)}
                headerHeights={this.state.headerHeights}
              />
            : this.state.activeTab === 'notable events' ?
              <EventsInfo
                checkins={props.patientCheckinHistory.checkins}
                headerHeights={this.state.headerHeights}
              />
            :
              <GeneralInfo
                patientInfo={props.patient}
                patientForumTopics={props.patientForumTopics}
                checkins={ props.patientCheckinHistory.checkins.filter(checkin => moment(checkin.date, 'MMMM Do YYYY').isBetween(moment(this.state.graphStartDate, 'MMMM Do YYYY'), moment(this.state.graphEndDate, 'MMMM Do YYYY'), 'days', [])) }
                // checkins={props.patientCheckinHistory.checkins.filter(checkin => {
                //   if (moment(checkin.date, 'MMMM Do YYYY').isBetween(moment(this.state.graphStartDate, 'MMMM Do YYYY'), moment(this.state.graphEndDate, 'MMMM Do YYYY'), 'days', [])) {
                //     return true;
                //   } else {
                //     return false;
                //   }
                // })}
                lastCheckin={props.patientCheckinHistory.lastCheckin}
                checkinComplianceData={getCheckinComplianceData(props.patient.account.createdAt, props.patientCheckinHistory.checkins)}
                headerHeights={this.state.headerHeights}
              />
            }


          {/* </div> */}

          {/* <div className='pt-summary__navbar__wrapper'>
            <PtInfoSideNav activeLink={this.state.activeLink}/>
            <PtInfoSideNav activeLink={undefined}/>
          </div> */}
        {/* </div> */}
      </div>
    );
  }
}

export default createContainer(props => {
  // Todo: update checkin array to include dates before initial checkins (for meds) and past last checkin (i.e. missed checkins).

  const patientId = props.computedMatch.params.patientId;
  const currentPatientsHandle = Meteor.subscribe('currentPatients');
  const patientSymptomsHandle = Meteor.subscribe('patientSymptoms', patientId);
  const patientTreatmentsHandle = Meteor.subscribe('patientTreatments', patientId);
  const patientCheckinHistoriesHandle = Meteor.subscribe('patientCheckinHistories', patientId);
  const topicsHandle = Meteor.subscribe('topics');

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

  const symptomsExtendedData = (currentPatientsHandle.ready() && patientCheckinHistoriesHandle.ready() && patientCheckinHistory && patientCheckinHistory.checkins.length > 0) ? sortSymptoms(patientSymptoms, patientCheckinHistory.checkins, patientCheckinHistory.checkins[0].date, patientCheckinHistory.checkins[patientCheckinHistory.checkins.length - 1].date) : [];
  const symptomsSeveritySorted = symptomsExtendedData.slice().sort((symptomA, symptomB) => symptomB.severityAverage - symptomA.severityAverage);
  const symptomsChangeSorted = symptomsExtendedData.slice().sort((symptomA, symptomB) => symptomB.biggestChangeAverage - symptomA.biggestChangeAverage);


  // const header1height = document.querySelector('.nav-header.private.doctor').getBoundingClientRect().height;
  // const header2height = document.querySelector('.pt-summary__header__wrapper').getBoundingClientRect().height;
  // console.log(header1height + header2height);
  return {
    patient: Meteor.users.findOne({_id: patientId}),
    patientSymptoms,
    patientTreatments,
    patientCheckinHistory,
    patientSxSystems,
    patientForumTopics: Topics.find({authorId: patientId}).fetch(),
    highestSeveritySymptoms: symptomsSeveritySorted.slice(0, 5),
    biggestChangeSymptoms: symptomsChangeSorted.slice(0, 5),
    showMessageBox: Session.get('showMessageBox') || false,
    isFetching: !currentPatientsHandle.ready() || !patientCheckinHistoriesHandle.ready() || !patientSymptomsHandle.ready() || !patientTreatmentsHandle.ready() || !topicsHandle.ready()
  };
}, PatientSummary2);
