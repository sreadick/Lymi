import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { filterCurrentDayTreatments } from '../../../utils/utils';

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
      <div className='page-content'>
        <h3 className='center-align'>Check in for {this.props.location.state.checkinDate}</h3>
        {this.state.checkinComponent === 'symptoms' ?
          <SymptomsCheckin
            symptomCheckinItems={this.props.symptomCheckinItems}
            treatmentCheckinItems={this.props.treatmentCheckinItems}
            fromTreatmentsCheckin={this.state.fromTreatmentsCheckin}
            navigateToComponent={this.navigateToComponent}
            targetDate={this.props.targetDate}
            yesterdaysCheckin={this.props.yesterdaysCheckin}
            trackedItems={this.props.trackedItems}
           />
          : this.state.checkinComponent === 'treatments' ?
          <TreatmentsCheckin
            treatmentCheckinItems={this.props.treatmentCheckinItems}
            navigateToComponent={this.navigateToComponent}
            targetDate={this.props.targetDate}
            yesterdaysCheckin={this.props.yesterdaysCheckin}
            nonPrescribedTreatmentNames={this.props.nonPrescribedTreatmentNames}
            trackedItems={this.props.trackedItems}
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
  return {
    symptomCheckinItems: foundCheckin ? foundCheckin.symptoms : [],
    treatmentCheckinItems: foundCheckin ? foundCheckin.treatments.filter(checkinTreatment => checkinTreatment.prescribedToday) : [],
    notableEventsMessage: foundCheckin ? foundCheckin.notableEvents : '',
    nonPrescribedTreatmentNames: foundCheckin ? foundCheckin.treatments.filter(checkinTreatment => !checkinTreatment.prescribedToday).map(checkinTreatment => checkinTreatment.name) : [],
    isFetching: !checkinHistoryIsReady,
    targetDate,
    yesterdaysCheckin,
    trackedItems: Meteor.user().profile.settings.trackedItems
  }
}, Checkin)
