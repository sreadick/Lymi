import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import { Session } from 'meteor/session';
import moment from 'moment';

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import Checkin from './Checkin';
import TreatmentChart from '../../components/patient/TreatmentChart';

class TreatmentsHistory extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <div></div>
    }
    return (
      <div className="page-content">
        <div className="page-content__main-heading">History: Treatments</div>

        <div className='history-options-button-container'>
          { this.props.showDeletedTab &&
            <button className={`btn ${this.props.includeDeletedTreatments ? 'deep-purple lighten-1' : 'grey'}`}
              onClick={() => Session.set('includeDeletedTreatments', !Session.get('includeDeletedTreatments'))}>
              {this.props.includeDeletedTreatments ?  'Exclude Deleted' : 'Include Deleted'}
            </button>
          }
        </div>
        {this.props.checkinHistory.checkins.length > 0 &&
          <TreatmentChart
            treatments={this.props.displayedTreatments}
            checkins={this.props.checkinHistory.checkins}
          />
        }
        <div className='section'>
          <h5>Checkins:</h5>
          {this.props.displayedCheckinTableItems.map(checkin =>
            <div className="section" key={checkin.date}>
              <h4>{checkin.date}</h4>
              { checkin.treatments === undefined ?
                <div>
                  <p>You didn't check in on this date</p>
                  <Link
                    className="waves-effect waves-light pink btn"
                    to={{
                      pathname: "/patient/checkin",
                      state: {
                        checkinDate: checkin.date,
                        symptoms: this.props.userSymptoms,
                        treatments: this.props.userTreatments,
                        position: (this.props.displayedCheckinTableItems.length - checkin.index - 1)
                      },
                    }}>
                    Check in now
                  </Link>
                </div>
                :
                <div>
                  {moment(checkin.date, 'MMMM Do YYYY').startOf('day').isBetween(moment().subtract(3, 'days'), moment()) &&
                    <Link
                      className="waves-effect waves-light deep-purple btn"
                      to={{
                        pathname: "/patient/checkin",
                        state: {
                          checkinDate: checkin.date,
                          symptoms: checkin.symptoms ? checkin.symptoms.map(symptom => {
                            return {
                              name: symptom.name
                            };
                          }) : undefined,
                          treatments: checkin.treatments ? checkin.treatments.map(treatment => {
                            return {
                              name: treatment.name,
                              dateSelectMode: 'daily',
                              // dateSelectMode: 'from now on',
                              // daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                            };
                          }) : undefined
                        },
                      }}>
                      Edit check-in
                    </Link>
                  }
                  <table className='striped'>
                    <thead>
                      <tr>
                        <th>Treatment</th>
                        <th>Compliance</th>
                      </tr>
                    </thead>

                    <tbody>
                      { checkin.treatments.length === 0 ?
                        <tr>
                          <td className="grey-text">No Treatments This Day</td>
                        </tr>
                      :
                        checkin.treatments.map(checkinTreatment =>
                          <tr key={checkinTreatment.name}>
                            <td>{checkinTreatment.name}</td>
                            <td>{checkinTreatment.compliance === null ? 'Not Specified' : checkinTreatment.compliance === 'NPD' ? "Not Prescribed Today" : checkinTreatment.compliance}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default createContainer((props) => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  const currentTreatments = UserTreatments.find().fetch();
  const currentAndDeletedTreatments = currentTreatments.slice();
  const displayedCheckinTableItems = checkinHistoryIsReady && CheckinHistories.findOne().checkins.reverse().slice();
  const lastThreeDays = [moment().format('MMMM Do YYYY'), moment().subtract(1, 'days').format('MMMM Do YYYY'), moment().subtract(2, 'days').format('MMMM Do YYYY')];

  if (checkinHistoryIsReady) {
    CheckinHistories.findOne().checkins.forEach((checkin) => {
      checkin.treatments.forEach((treatment) => {
        if (!currentAndDeletedTreatments.map(anyTreatment => anyTreatment.name).includes(treatment.name)) {
          currentAndDeletedTreatments.push(treatment);
        }
      });
    });
    lastThreeDays.forEach((day, index) => {
      if (!CheckinHistories.findOne().checkins.map(checkin => checkin.date).includes(day) && moment(day, 'MMMM Do YYYY').isAfter(moment(CheckinHistories.findOne().checkins[0].date, 'MMMM Do YYYY'))) {
        displayedCheckinTableItems.splice(index, 0, {date: day, symptoms: undefined, treatments: undefined, index})
      }
    })
  }
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    displayedCheckinTableItems,
    isFetching: (!checkinHistoryIsReady || !displayedCheckinTableItems || !symptomsHandle.ready() || !treatmentsHandle.ready()),
    includeDeletedTreatments: Session.get('includeDeletedTreatments') || false,
    showDeletedTab: currentTreatments.map(treatment => treatment.name).toString() !== currentAndDeletedTreatments.map(treatment => treatment.name).toString(),
    displayedTreatments: Session.get('includeDeletedTreatments') ? currentAndDeletedTreatments : currentTreatments,
  };

}, TreatmentsHistory);
