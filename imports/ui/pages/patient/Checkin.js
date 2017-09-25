import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

// import { UserSymptoms } from '../../../api/user-symptoms';
// import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import SymptomsCheckin from '../../components/patient/SymptomsCheckin';
import TreatmentsCheckin from '../../components/patient/TreatmentsCheckin';


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
      this.props.history.push('/patient')
    }
  }
  render() {
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
            yesterdaysCheckin={this.props.yesterdaysCheckin} />
          :
          <TreatmentsCheckin
            treatmentCheckinItems={this.props.treatmentCheckinItems}
            navigateToComponent={this.navigateToComponent}
            targetDate={this.props.targetDate}
            yesterdaysCheckin={this.props.yesterdaysCheckin} />
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

  const dateFilteredTreatments = treatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment(targetDate, 'MMMM Do YYYY').format('dddd'))) || (treatment.dateSelectMode === 'date range' && (treatment.daysOfWeek.includes(moment(targetDate, 'MMMM Do YYYY').format('dddd')) && moment(targetDate, 'MMMM Do YYYY').isBetween(treatment.startDateValue, treatment.endDateValue, 'day', '[]')) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MMMM Do YYYY')).includes(moment(targetDate, 'MMMM Do YYYY').format('MMMM Do YYYY')))));

  const foundCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === targetDate) : undefined;
  if (checkinHistoryIsReady){
    if (!foundCheckin) {
      Meteor.call('checkinHistories.checkins.create', {
        date: targetDate,
        symptoms: symptoms,
        treatments: dateFilteredTreatments,
        position: props.location.state.position || (CheckinHistories.findOne().checkins.length)
      });
    } else {
      Meteor.call('checkinHistories.checkins.update', {
        date: targetDate,
        symptoms: symptoms,
        todaysCheckinSymptoms: foundCheckin.symptoms,
        treatments: dateFilteredTreatments,
        todaysCheckinTreatments: foundCheckin.treatments
      });
    }
  }
  return {
    symptomCheckinItems: foundCheckin ? foundCheckin.symptoms : [],
    treatmentCheckinItems: foundCheckin ? foundCheckin.treatments : [],
    isFetching: !checkinHistoryIsReady,
    targetDate,
    yesterdaysCheckin
  }
}, Checkin)
