import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import { Session } from 'meteor/session';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';
// import { Images } from '../../api/images';

import Checkin from './Checkin';
import SymptomChart from '../components/SymptomChart';
import ProfileBackgroundModel from '../components/ProfileBackgroundModel';


// ToDo //

// react production build

class Dashboard extends React.Component {
  selectProfilePhoto() {
    const file = this.refs.photoInput.files[0];
    const imageType = /image.*/;

    if (file.type.match(imageType)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = reader.result;
        Meteor.users.update(Meteor.userId(), {
          $set: {
            'profile.userPhoto': img.src
          }
        });

      }

      reader.readAsDataURL(file);
    } else {
      alert('File type not supported');
    }
  }

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
        {this.props.userPhoto &&
          <div className='userPhoto__wrapper'>
            <img className='userPhoto' src={this.props.userPhoto} />
          </div>
        }
        {/* <div className="page-content__main-heading">Dashboard</div> */}
        {this.props.showProfileBackgroundModel && <ProfileBackgroundModel />}
        <div className='dashboard-user-info' style={{backgroundImage: Meteor.user() ? `url(${Meteor.user().profile.backgroundURL})` : '' }}>
          <div className='dashboard-user-info__name'>
            {Meteor.user() && <h2>{Meteor.user().profile.firstName} {Meteor.user().profile.lastName}</h2>}
          </div>
          <div className="dashboard-user-info__tasks-box z-depth-4">
            <div className='section'>
              <h5 className="purple-text text-lighten-2 center-align">Tasks</h5>
                {
                  this.props.dailyCheckinStatus !== 'complete' ?
                  <div>
                    <div>
                      {this.props.dailyCheckinStatus === 'partially complete' ? "Your check in is incomplete" : "You haven't checked in today"}
                    </div>
                    <Link className="waves-effect waves-light purple darken-1 btn" to="/home/checkin/symptoms">
                      {this.props.dailyCheckinStatus === 'partially complete' ? "Finish checking in" : "Check in now"}
                    </Link>
                  </div>
                :
                  <p>No tasks require your attention.</p>
                }
              <div className='section'>
                <h6>Optional:</h6>
                {
                  this.props.dailyCheckinStatus === 'complete' &&
                  <div className="">
                    <Link className="waves-effect waves-light blue btn" to="/home/checkin/symptoms">Edit check-in</Link>
                    <span className='grey-text'>{`Last checked in ${moment(this.props.checkinHistory.lastCheckin).fromNow()}`}</span>
                  </div>
                }
                <button className='black btn' onClick={() => {
                  Session.set('showProfileBackgroundModel', true)
                }}>Change profile background</button>
                <div>
                  <span>Add profile picture </span>
                  <input type='file' ref='photoInput' onChange={this.selectProfilePhoto.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Checkin />

        <div className="row dashboard-chart-section">
          <div className='col sm12 m3'>
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
            <div>
              <Link className="waves-effect waves-light blue btn" to="/home/selectsymptoms">Edit</Link>
              <Link className='waves-effect waves-light black btn' to="/home/history/symptoms">Full History</Link>
            </div>
          </div>
          <div className='col sm12 m9'>
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

  // edit
  let dailyCheckinStatus;
  if ((checkinHistoryIsReady && todaysCheckin) && (todaysCheckin.symptoms.every(checkinSymptom => checkinSymptom.severity > 0) && todaysCheckin.treatments.every(checkinTreatment => checkinTreatment.compliance !== null))) {
    dailyCheckinStatus = 'complete';
  } else if ((checkinHistoryIsReady && todaysCheckin) && (todaysCheckin.symptoms.some(checkinSymptom => checkinSymptom.severity > 0) || todaysCheckin.treatments.some(checkinTreatment => checkinTreatment.compliance !== null))) {
    dailyCheckinStatus = 'partially complete';
  } else {
    dailyCheckinStatus = 'incomplete';
  }

  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHistoryIsReady || !symptomsHandle.ready() || !treatmentsHandle.ready()),
    showProfileBackgroundModel: Session.get('showProfileBackgroundModel'),
    userPhoto: (Meteor.user() && Meteor.user().profile.userPhoto) ? Meteor.user().profile.userPhoto : undefined,

    // edit
    dailyCheckinStatus
  };
}, Dashboard);
