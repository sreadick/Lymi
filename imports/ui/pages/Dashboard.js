import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';

import Checkin from './Checkin';
import SymptomChart from '../components/SymptomChart';

// ToDo //

// materialize
// react production build

class Dashboard extends React.Component {
  render() {
    if (this.props.isFetching) {
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      );
    } else if (this.props.userSymptoms.length === 0 || this.props.userTreatments.length === 0) {
      return <Redirect to="/home" />
    } else if (this.props.userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0)) {
      return <Redirect to="/home/selecttreatments" />
    }
    return (
      <div className="">
        {/* <div className="page-content__main-heading">Dashboard</div> */}
        <div className='dashboard-user-info'>
          <div className='dashboard-user-info__name'>
            {Meteor.user() && <h2>{Meteor.user().profile.firstName} {Meteor.user().profile.lastName}</h2>}
          </div>
          <div className="dashboard-user-info__tasks-box z-depth-4">
            <div className='section'>
              <h5 className="purple-text text-lighten-2 center-align">Tasks</h5>
                {
                  this.props.checkinHistory.dailyCompleted !== 'yes' ?
                  <div>
                    <div>
                      {this.props.checkinHistory.dailyCompleted === 'partial' ? "Your check in is incomplete" : "You haven't checked in today"}
                    </div>
                    <Link className="waves-effect waves-light purple darken-1 btn" to="/home/checkin/symptoms">
                      {this.props.checkinHistory.dailyCompleted === 'partial' ? "Finish checking in" : "Check in now"}
                    </Link>
                  </div>
                :
                  <p>No tasks require your attention.</p>
                }
              <div className='section'>
                <h6>Optional:</h6>
                {
                  this.props.checkinHistory.dailyCompleted === 'yes' &&
                  <div className="">
                    <Link className="waves-effect waves-light blue btn" to="/home/checkin/symptoms">Edit check-in</Link>
                    <span className='grey-text'>{`Last checked in ${moment(this.props.checkinHistory.lastCheckin).fromNow()}`}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <Checkin />

        <div className="row dashboard-chart-section">
          <div className='col m3'>
            <div className="dashboard-chart-section__list">
              <ol className='collection with-header z-depth-2'>
                <li className="collection-header"><h5>My Symptoms:</h5></li>

                {this.props.userSymptoms.map((symptom) => {
                  return (
                    <li className="collection-item" key={symptom._id} style={{background: symptom.color, color: 'white'}}>
                      <span className="">
                        {symptom.name}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <Link className="waves-effect waves-light blue btn" to="/home/selectsymptoms">Edit</Link>
            <Link className='waves-effect waves-light black btn' to="/home/history/symptoms">Full History</Link>
          </div>
          <div className='col m9'>
            <div className="dashboard-chart-section__chart__wrapper z-depth-2">
              <div className="dashboard-chart-section__chart">
                {this.props.checkinHistory.checkins.length > 0 &&
                  // <div className={window.innerWidth > 1200 && "card"}>
                  <div>
                    <SymptomChart
                      symptomNames={this.props.userSymptoms.map(symptom => symptom.name)}
                      checkins={this.props.checkinHistory.checkins}
                      symptomColors={this.props.userSymptoms.map(symptom => symptom.color)}
                      height={100}
                      padding={{top: 30, right: 30, bottom: 10, left: 0}}
                    />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>


        <div className="row dashboard-chart-section treatments">
          <div className='col s3'>
            <div className="dashboard-chart-section__list">
              <ol className='collection with-header z-depth-2'>
                <li className="collection-header"><h5>My Treatments:</h5></li>
                {this.props.userTreatments.map((treatment) => {
                  return (
                    <li className="collection-item" key={treatment._id}>
                      <div className="title">{treatment.name.charAt(0).toUpperCase() + treatment.name.slice(1)}</div>
                      <pre className='grey-text'>
                        <em>
                          {` ${treatment.amount} ${treatment.dose_type !== "pills" ? `x ${treatment.dose}${treatment.dose_type}` : treatment.amount === 1 ? "pill" : "pills"} ${treatment.frequency}/day`}
                        </em>
                      </pre>
                    </li>
                  );
                })}
              </ol>
            </div>
            <Link className="waves-effect waves-light blue btn" to="/home/selecttreatments">edit</Link>
          </div>
          <div className='col s9 center-align'>
            <h4 className='grey-text'>[Graph Coming Soon]</h4>
          </div>
        </div>

      </div>
    );
  }
};

export default createContainer(() => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  const currentDate = moment().format('MMMM Do YYYY');
  const todaysCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;
  // if (checkinHistoryIsReady && !todaysCheckin) {
  //   Meteor.call('checkinHistories.checkins.update', {
  //     date: currentDate,
  //     symptoms: UserSymptoms.find().fetch(),
  //     treatments: UserTreatments.find().fetch(),
  //   });
  //   Meteor.call('checkinHistories.dailyCompleted.update', 'no')
  // }
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHistoryIsReady || !symptomsHandle.ready() || !treatmentsHandle.ready()),
  };
}, Dashboard);
