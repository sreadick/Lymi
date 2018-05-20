import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input, Button } from 'react-materialize';
import { Session } from 'meteor/session';
import moment from 'moment';
import { DayPickerSingleDateController } from 'react-dates';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

export default class AppointmentScheduler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointmentDate: props.currentAppt ? moment(props.currentAppt).startOf('day') : undefined,
      appointmentTime: props.currentAppt ? moment(props.currentAppt) : moment().startOf('day'),
    };
  }

  confirmAppointmentDate(day, time, method) {
    let date;
    if (time) {
      date = moment(day).add(time.hours(), 'hours').add(time.minutes(), 'minutes');
    } else {
      date = day;
    }
    if (method === 'create') {
      Meteor.call('users.appointments.create', date.valueOf())
    } else if (method === 'update') {
      Meteor.call('users.appointments.updateLast', date.valueOf())
    }
    Session.set('showAppointmentScheduler', false);
  }


  render() {
    return (
      <div className='boxed-view__modal-overlay'>
        <div className='boxed-view__box--doctor-search'>
          <div className='boxed-view__box--doctor-search__header'>
            <Row>
              <i
                className='small right material-icons button--icon'
                onClick={() => Session.set('showAppointmentScheduler', false) }>
                close
              </i>
            </Row>
            <Row>
              <h4>{this.props.currentAppt ? 'Update' : 'Add'} Appointment</h4>
            </Row>
          </div>
          <div className='date-picker-wrapper individual-date-picker'>
            <DayPickerSingleDateController
              date={this.state.appointmentDate}
              onDateChange={date => this.setState({appointmentDate: date})}
              // isOutsideRange={(day) => (day.isBefore(moment().startOf('day')) ) ? true : false}
            />
          </div>
          <TimePicker
            showSecond={false}
            value={this.state.appointmentTime || null}
            className="xxx browser-default"
            onChange={(newDoseTime) => this.setState({appointmentTime: newDoseTime})}
            format={'h:mm a'}
            use12Hours
          />
          <Button
            className={this.props.currentAppt ? 'blue' : 'white black-text'}
            onClick={() => this.confirmAppointmentDate(this.state.appointmentDate, this.state.appointmentTime, this.props.currentAppt ? 'update' : 'create')}>
            {this.props.currentAppt ? 'Update Appointment' : 'Set Appointment'}
          </Button>
        </div>
      </div>
    );
  }
};

// export default createContainer(props => {
//   let searchedDocInfo = Session.get('searchedDocInfo');
//   // console.log(searchedDocInfo);
//   const searchedDoctorHandle = Meteor.subscribe('searchedDoctor', {
//     firstName: searchedDocInfo ? searchedDocInfo.firstName : '',
//     lastName: searchedDocInfo ? searchedDocInfo.lastName : '',
//     zip: searchedDocInfo ? searchedDocInfo.zip : ''
//   });
//
//   const searchedDoctor = Meteor.users.findOne({
//     'account.type': 'doctor',
//     'profile.firstName': searchedDocInfo ? searchedDocInfo.firstName : '',
//     'profile.lastName': searchedDocInfo ? searchedDocInfo.lastName : '',
//     'profile.zip': searchedDocInfo ? searchedDocInfo.zip : ''
//   });
//   // console.log('searchedDoctor:' , searchedDoctor);
//   const isDocLinked = Session.get('isDocLinked') || false;
//   return {
//     searchedDoctor,
//     searchedDocInfo,
//     isDocLinked,
//     isFetching: !Meteor.user() || !searchedDoctorHandle.ready(),
//   }
// }, AppointmentScheduler)
