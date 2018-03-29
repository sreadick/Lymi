import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import ReactTooltip from 'react-tooltip'
import { filterCurrentDayTreatments, capitalizePhrase } from '../../../utils/utils';

// import { UserSymptoms } from '../../../api/user-symptoms';
// import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import Loader from '/imports/ui/components/Loader';
import SymptomsCheckin from '../../components/patient/SymptomsCheckin';
import TreatmentsCheckin from '../../components/patient/TreatmentsCheckin';
import NotableEventsCheckin from '../../components/patient/NotableEventsCheckin';


class Checkin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fromTreatmentsCheckin: false,
      checkinComponent: 'symptoms'
    }

    this.navigateToComponent = this.navigateToComponent.bind(this);
  }

  navigateToComponent(component) {
    if (component !== 'dashboard') {
      this.setState({checkinComponent: component})
      window.scrollTo(0, 0);
    } else {
      document.getElementById('message--dashboard--success').classList.add('active');
      this.props.history.push('/patient/dashboard')
    }
  }
  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className='page-content--checkin'>
        {/* <h3 className='center-align'>Check in for {this.props.location.state.checkinDate}</h3> */}
        <h3 className=''>{this.props.location.state.checkinDate}</h3>
        {this.props.trackedItems.length > 1 &&
          <nav className='breadcrumb__wrapper--check-in'>
            <div className="nav-wrapper">
              <div className="col s12">
                {this.props.trackedItems.map(trackedItem => {
                  const itemState = trackedItem === this.state.checkinComponent ? 'active'
                    :
                    (this.props.symptomCheckinCompleted && this.props.treatmentCheckinCompleted) ?
                    'clickable'
                    :
                    trackedItem === 'symptoms' ?
                    'clickable'
                    :
                    trackedItem === 'treatments' ?
                      ((this.state.checkinComponent === 'symptoms' && this.props.symptomCheckinCompleted) || this.state.checkinComponent === 'notable events') ?
                      'clickable'
                      :
                      'disabled'
                    :
                    trackedItem === 'notable events' ?
                      ((this.state.checkinComponent === 'treatments' && this.props.treatmentCheckinCompleted)) ?
                      'clickable'
                      :
                      'disabled'
                    :
                    'disabled';
                  return (
                    <Link
                      key={trackedItem}
                      to=""
                      data-tip data-for={`${trackedItem}_tooltip`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (e.target.classList.contains('clickable')) {
                          this.navigateToComponent(trackedItem);
                        }
                      }}
                      className={'breadcrumb breadcrumb--check-in ' + itemState}>
                      {capitalizePhrase(trackedItem)}
                      {itemState === 'disabled' &&
                        <ReactTooltip
                          id={`${trackedItem}_tooltip`}
                          type='error'
                          place='right'
                          effect='solid'>
                          <div>{`Fill out all ${trackedItem === 'treatments' ? 'symptoms' : 'treatments'}.`}</div>
                        </ReactTooltip>
                      }
                    </Link>
                  )
                })}
                <div
                  className={`breadcrumb--check-in--finish ${(!this.props.treatmentCheckinCompleted || !this.props.symptomCheckinCompleted) && 'disabled'}`}
                  data-tip data-for='checkin_done'
                  onClick={() => {
                    if (this.props.treatmentCheckinCompleted && this.props.symptomCheckinCompleted) {
                      this.navigateToComponent('dashboard')
                    }
                  }}>
                  Done
                </div>
                {(!this.props.treatmentCheckinCompleted || !this.props.symptomCheckinCompleted) &&
                  <ReactTooltip
                    id='checkin_done'
                    type='error'
                    place='left'
                    effect='solid'>
                    <div>Fill out all symptoms and treatments.</div>
                  </ReactTooltip>
                }
              </div>
            </div>
          </nav>
        }
        {this.state.checkinComponent === 'symptoms' ?
          <SymptomsCheckin
            symptomCheckinItems={this.props.symptomCheckinItems}
            treatmentCheckinItems={this.props.treatmentCheckinItems}
            fromTreatmentsCheckin={this.state.fromTreatmentsCheckin}
            navigateToComponent={this.navigateToComponent}
            targetDate={this.props.targetDate}
            yesterdaysCheckin={this.props.yesterdaysCheckin}
            trackedItems={this.props.trackedItems}
            symptomCheckinCompleted={this.props.symptomCheckinCompleted}
           />
          : this.state.checkinComponent === 'treatments' ?
          <TreatmentsCheckin
            treatmentCheckinItems={this.props.treatmentCheckinItems}
            navigateToComponent={this.navigateToComponent}
            targetDate={this.props.targetDate}
            yesterdaysCheckin={this.props.yesterdaysCheckin}
            nonPrescribedTreatmentNames={this.props.nonPrescribedTreatmentNames}
            trackedItems={this.props.trackedItems}
            treatmentCheckinCompleted={this.props.treatmentCheckinCompleted}
          />
          :
          <NotableEventsCheckin
            navigateToComponent={this.navigateToComponent}
            notableEventsMessage={this.props.notableEventsMessage}
            targetDate={this.props.targetDate}
            trackedItems={this.props.trackedItems}
          />
        }
      </div>
    );
  }
};

export default createContainer(props => {
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  const targetDate = props.location.state.checkinDate;
  let yesterdaysCheckin = checkinHistoryIsReady ? (moment(targetDate, 'MMMM Do YYYY').format('MMMM Do YYYY') === moment().format('MMMM Do YYYY') && CheckinHistories.findOne().checkins.find((checkin) => checkin.date === moment().subtract(1, 'day').format('MMMM Do YYYY'))) : undefined;
  const symptoms = props.location.state.symptoms;
  const treatments = props.location.state.treatments;

  // const dateFilteredTreatments = treatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment(targetDate, 'MMMM Do YYYY').format('dddd'))) || (treatment.dateSelectMode === 'date range' && (treatment.daysOfWeek.includes(moment(targetDate, 'MMMM Do YYYY').format('dddd')) && moment(targetDate, 'MMMM Do YYYY').isBetween(treatment.startDateValue, treatment.endDateValue, 'day', '[]')) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MMMM Do YYYY')).includes(moment(targetDate, 'MMMM Do YYYY').format('MMMM Do YYYY')))));
  const dateFilteredTreatments = filterCurrentDayTreatments(treatments);

  const foundCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === targetDate) : undefined;
  if (checkinHistoryIsReady){
    if (!foundCheckin) {
      Meteor.call('checkinHistories.checkins.create', {
        date: targetDate,
        symptoms: symptoms,
        treatments: treatments,
        todayTreatments: dateFilteredTreatments,
        position: props.location.state.position || (CheckinHistories.findOne().checkins.length)
      });
    } else {
      Meteor.call('checkinHistories.checkins.update', {
        date: targetDate,
        symptoms: symptoms,
        todaysCheckinSymptoms: foundCheckin.symptoms,
        treatments: treatments,
        todayTreatments: dateFilteredTreatments,
        todaysCheckinTreatments: foundCheckin.treatments,
        todaysNotableEvents: foundCheckin.notableEvents
      });
    }
  }

  const symptomCheckinItems = foundCheckin ? foundCheckin.symptoms : [];
  const treatmentCheckinItems = foundCheckin ? foundCheckin.treatments.filter(checkinTreatment => checkinTreatment.prescribedToday) : [];
  const trackedItems = Meteor.user().profile.settings.trackedItems;

  return {
    // symptomCheckinItems: foundCheckin ? foundCheckin.symptoms : [],
    // treatmentCheckinItems: foundCheckin ? foundCheckin.treatments.filter(checkinTreatment => checkinTreatment.prescribedToday) : [],
    notableEventsMessage: foundCheckin ? foundCheckin.notableEvents : '',
    nonPrescribedTreatmentNames: foundCheckin ? foundCheckin.treatments.filter(checkinTreatment => !checkinTreatment.prescribedToday).map(checkinTreatment => checkinTreatment.name) : [],
    isFetching: !checkinHistoryIsReady,
    targetDate,
    yesterdaysCheckin,
    // trackedItems: Meteor.user().profile.settings.trackedItems,
    trackedItems,
    symptomCheckinItems,
    treatmentCheckinItems,
    symptomCheckinCompleted: symptomCheckinItems.filter((symptom) => symptom.severity > 0).length === symptomCheckinItems.length,
    treatmentCheckinCompleted: (!trackedItems.includes('treatments') || treatmentCheckinItems.filter((treatment) => treatment.compliance !== null).length === treatmentCheckinItems.length),

  }
}, Checkin)
