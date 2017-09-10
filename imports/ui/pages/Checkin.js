import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';

// import SymptomsCheckin from './SymptomsCheckin';
// import TreatmentsCheckin from './TreatmentsCheckin';
import SymptomsCheckin from '../components/SymptomsCheckin';
import TreatmentsCheckin from '../components/TreatmentsCheckin';


class Checkin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fromTreatmentsCheckin: false,
      checkinComponent: 'symptoms'
    }

    this.navigateToComponent = this.navigateToComponent.bind(this);
  }
  componentDidMount() {
    // Session.set('checkinDate', this.props.location.state.checkinDate)
  }

  // componentDidUpdate(prevProps) {
  //   console.log(0);
  //   if (!this.props.isFetching && (this.props.userTreatments !== prevProps.userTreatments || this.props.userSymptoms !== prevProps.userSymptoms)) {
  //     console.log(1);
  //     if (!this.props.foundCheckin) {
  //       console.log(2);
  //       Meteor.call('checkinHistories.checkins.create', {
  //         date: this.props.targetDate,
  //         symptoms: this.props.userSymptoms,
  //         treatments: this.props.userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment(this.props.targetDate, 'MMMM Do YYYY').format('dddd'))) || (treatment.dateSelectMode === 'date range' && moment(this.props.targetDate, 'MMMM Do YYYY').isBetween(treatment.startDateValue, treatment.endDateValue) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue)).includes(moment(this.props.targetDate, 'MMMM Do YYYY'))))),
  //       });
  //     } else {
  //       console.log(3);
  //       Meteor.call('checkinHistories.checkins.update', {
  //         date: this.props.targetDate,
  //         symptoms: this.props.userSymptoms,
  //         todaysCheckinSymptoms: this.props.foundCheckin.symptoms,
  //         treatments: this.props.userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment(this.props.targetDate, 'MMMM Do YYYY').format('dddd'))) || (treatment.dateSelectMode === 'date range' && moment(this.props.targetDate, 'MMMM Do YYYY').isBetween(treatment.startDateValue, treatment.endDateValue) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue)).includes(moment(this.props.targetDate, 'MMMM Do YYYY'))))),
  //         todaysCheckinTreatments: this.props.foundCheckin.treatments
  //       });
  //     }
  //   } else {
  //     console.log(4);
  //   }
  //     // if (!this.props.todaysCheckin) {
  //     //   Meteor.call('checkinHistories.checkins.create', {
  //     //     date: this.props.currentDate,
  //     //     symptoms: this.props.userSymptoms,
  //     //     treatments: this.props.userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'date range' && moment().isBetween(treatment.startDateValue, treatment.endDateValue) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY'))))),
  //     //   });
  //     // } else {
  //     //   Meteor.call('checkinHistories.checkins.update', {
  //     //     date: this.props.currentDate,
  //     //     symptoms: this.props.userSymptoms,
  //     //     todaysCheckinSymptoms: this.props.todaysCheckin.symptoms,
  //     //     treatments: this.props.userTreatments.filter((treatment) => (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment().format('dddd'))) || (treatment.dateSelectMode === 'date range' && moment().isBetween(treatment.startDateValue, treatment.endDateValue) || (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY'))))),
  //     //     todaysCheckinTreatments: this.props.todaysCheckin.treatments
  //     //   });
  //     // }
  //
  // }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.location !== this.props.location) {
  //     if (this.props.location.pathname === "/home/checkin/treatments") {
  //       this.setState({ fromTreatmentsCheckin: true })
  //     } else {
  //       this.setState({ fromTreatmentsCheckin: false })
  //     }
  //   }
  // }
  navigateToComponent(component) {
    if (component !== 'dashboard') {
      this.setState({checkinComponent: component})
    } else {
      this.props.history.push('/home')
    }
    // if (checkinComponent === 'symptoms') {
    //   if (this.props.treatmentCheckinItems.length > 0) {
    //     // console.log(1);
    //     this.setState({checkinComponent: 'treatments'})
    //   } else {
    //     // console.log(2);
    //     this.props.history.push('/home')
    //   }
    // } else if (checkinComponent === 'treatments') {
    //   this.props.history.push('/home')
    // }
  }
  render() {
    // if (this.props.isFetching) {
    //   return (
    //     <div className="progress">
    //       <div className="indeterminate"></div>
    //     </div>
    //   );
    // } else if (this.props.userSymptoms.length === 0 || this.props.userTreatments.length === 0) {
    //   return <Redirect to="/home" />
    // } else if (this.props.userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0)) {
    //   return <Redirect to="/home/selecttreatments" />
    // }
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
      // <Switch>
      //   <Route exact path="/home/checkin/symptoms" render={() => {
      //     return (
      //       <SymptomsCheckin
      //         symptomCheckinItems={this.props.symptomCheckinItems}
      //         treatmentCheckinItems={this.props.treatmentCheckinItems}
      //         fromTreatmentsCheckin={this.state.fromTreatmentsCheckin}
      //         {...this.props}
      //       />
      //     );
      //   }} />
      //   <Route exact path="/home/checkin/treatments" render={() => {
      //     return <TreatmentsCheckin treatmentCheckinItems={this.props.treatmentCheckinItems} {...this.props} />
      //   }} />
      //   <Route exact path="/home/checkin" render={() => {
      //     return <Redirect to="/home/checkin/symptoms" />
      //   }} />
      // </Switch>
    );
  }
};

export default createContainer(props => {
  // Meteor.subscribe('userSymptoms');
  // Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  // const currentDate = moment().format('MMMM Do YYYY');
  // let todaysCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;
  const targetDate = props.location.state.checkinDate;
  let yesterdaysCheckin = checkinHistoryIsReady ? (moment(targetDate, 'MMMM Do YYYY').format('MMMM Do YYYY') === moment().format('MMMM Do YYYY') && CheckinHistories.findOne().checkins.find((checkin) => checkin.date === moment().subtract(1, 'day').format('MMMM Do YYYY'))) : undefined;
  const symptoms = props.location.state.symptoms;
  const treatments = props.location.state.treatments;
  // const userSymptoms = UserSymptoms.find().fetch();
  // const userTreatments = UserTreatments.find().fetch();

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
    // } else if (!symptoms.every(symptom => foundCheckin.symptoms.find(checkinSymptom => checkinSymptom.name === symptom.name)) || !dateFilteredTreatments.every(treatment => foundCheckin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name))) {
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
    // currentDate,
    // userSymptoms,
    // userTreatments,
    symptomCheckinItems: foundCheckin ? foundCheckin.symptoms : [],
    treatmentCheckinItems: foundCheckin ? foundCheckin.treatments : [],
    isFetching: !checkinHistoryIsReady,
    targetDate,
    // targetDate,
    // foundCheckin
    // checkinHistoryIsReady,
    // todaysCheckin,
    yesterdaysCheckin
  }
}, Checkin)
