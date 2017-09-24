import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import { CheckinHistories } from '../../api/checkin-histories';

import Checkin from '../pages/Checkin';

class TasksBox extends React.Component {
  render() {
    // if (this.props.isFetching) {
    //   return (
    //     <div className="progress">
    //       <div className="indeterminate"></div>
    //     </div>
    //   );
    // }
    return (
      <div className="dashboard-user-info__tasks-box z-depth-4">
        {/* <Checkin /> */}
          <div className='section'>

          <h5 className="purple-text text-lighten-2 center-align">Tasks</h5>
            {
              this.props.dailyCheckinStatus !== 'complete' ?
              <div>
                <div>
                  {this.props.dailyCheckinStatus === 'partially complete' ? "Your check in is incomplete" : "You haven't checked in today"}
                </div>
                {/* <Link className="waves-effect waves-light purple darken-1 btn" to="/home/checkin/symptoms"> */}
                <Link
                  className="waves-effect waves-light purple darken-1 btn"
                  to={{
                    pathname: "/home/checkin",
                    state: {
                      checkinDate: moment().format('MMMM Do YYYY'),
                      symptoms: this.props.userSymptoms,
                      treatments: this.props.userTreatments
                    },
                  }}>
                  {this.props.dailyCheckinStatus === 'partially complete' ? "Finish checking in" : "Check in now"}
                </Link>
              </div>
            :
              <p className='center'>No tasks require your attention.</p>
            }
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  // const checkinHandle = Meteor.subscribe('checkinHistories');
  // const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  // const currentDate = moment().format('MMMM Do YYYY');
  // const todaysCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;
  // // edit
  // let dailyCheckinStatus;
  // if ((checkinHistoryIsReady && todaysCheckin) && (props.userSymptoms.every(userSymptom => todaysCheckin.symptoms.find(checkinSymptom => (checkinSymptom.name === userSymptom.name && checkinSymptom.severity > 0))) && props.todayTreatments.every(userTreatment => todaysCheckin.treatments.find(checkinTreatment => (checkinTreatment.name === userTreatment.name && checkinTreatment.compliance !== null))))) {
  //   dailyCheckinStatus = 'complete';
  // } else if ((checkinHistoryIsReady && todaysCheckin) && (props.userSymptoms.some(userSymptom => todaysCheckin.symptoms.find(checkinSymptom => (checkinSymptom.name === userSymptom.name && checkinSymptom.severity > 0))) || props.todayTreatments.some(userTreatment => todaysCheckin.treatments.find(checkinTreatment => (checkinTreatment.name === userTreatment.name && checkinTreatment.compliance !== null))))) {
  //   dailyCheckinStatus = 'partially complete';
  // } else {
  //   dailyCheckinStatus = 'incomplete';
  // }

  return {
    // checkinHistory: CheckinHistories.findOne(),
    // isFetching: !checkinHistoryIsReady,
    // dailyCheckinStatus
  };
}, TasksBox)
