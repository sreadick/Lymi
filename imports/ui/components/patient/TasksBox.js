import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

export default TasksBox = (props) => (
  <div className="dashboard-user-info__tasks-box z-depth-4">
    <div className='section'>

      <h5 className="purple-text text-lighten-2 center-align">Tasks</h5>
        {
          props.dailyCheckinStatus !== 'complete' ?
          <div>
            <div>
              {props.dailyCheckinStatus === 'partially complete' ? "Your check in is incomplete" : "You haven't checked in today"}
            </div>
            <Link
              className="waves-effect waves-light purple darken-1 btn"
              to={{
                pathname: "/patient/checkin",
                state: {
                  checkinDate: moment().format('MMMM Do YYYY'),
                  symptoms: props.userSymptoms,
                  treatments: props.userTreatments
                },
              }}>
              {props.dailyCheckinStatus === 'partially complete' ? "Finish checking in" : "Check in now"}
            </Link>
          </div>
        :
          <p className='center'>No tasks require your attention.</p>
        }
    </div>
  </div>
);
