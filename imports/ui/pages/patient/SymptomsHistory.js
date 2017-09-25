import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import { Session } from 'meteor/session';
import moment from 'moment';
import { getNextColor } from '../../../utils/utils';

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import SymptomChart from '../../components/patient/SymptomChart';
import Checkin from './Checkin';

class SymptomsHistory extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     groupSymptoms: false,
  //     includeDeletedSymptoms: false,
  //     displayedSymptoms: []
  //   }
  // }
  //
  // componentDidMount() {
  //   Session.set('groupSymptoms', false)
  //   Session.set('includeDeletedSymptoms', false)
  //
  //   this.setState({
  //     displayedSymptoms: this.props.displayedSymptoms
  //   });
  // }
  //
  // componentDidUpdate(prevProps) {
  //   if (prevProps.displayedSymptoms !== this.props.displayedSymptoms) {
  //     this.setState({
  //       displayedSymptoms: this.props.displayedSymptoms,
  //     });
  //   }
  // }
  //
  // handleToggleOption(e, target) {
  //   Session.set(target, !Session.get(target))
  //   this.setState({[target]: Session.get(target)})
  // }

  render() {
    if (this.props.isFetching) {
      return <div></div>
    }
    return (
      <div className="page-content">
        <div className="page-content__main-heading">History: Symptoms</div>

        <div className='history-options-button-container'>
          <button className={`btn ${this.props.groupSymptoms ? 'deep-purple lighten-1' : 'grey'}`}
            onClick={() => Session.set('groupSymptoms', !Session.get('groupSymptoms'))}>
            {this.props.groupSymptoms ?  'Ungroup' : 'Group'}
          </button>
          { this.props.showDeletedTab &&
            <button className={`btn ${this.props.includeDeletedSymptoms ? 'deep-purple lighten-1' : 'grey'}`}
              onClick={() => Session.set('includeDeletedSymptoms', !Session.get('includeDeletedSymptoms'))}>
              {this.props.includeDeletedSymptoms ?  'Exclude Deleted' : 'Include Deleted'}
            </button>
          }
        </div>
        {this.props.displayedSymptoms.length > 0 ?
          this.props.displayedSymptoms.map((symptom, index) => {
            return (
              <div className="" key={symptom.name}>
                <span
                  className={`checkin-symptom-item ${!this.props.userSymptoms.map(userSymptom => userSymptom.name).find(userSymptomName => userSymptomName === symptom.name) ? 'deleted' : ''}`}
                  style={{color: symptom.color}}>
                  {symptom.name}
                </span>
              </div>
            );
          })
          :
          <div className="ui message">
            No symptoms are currently selected.
            <div>
              <Link className='ui basic button' to='/patient/selectsymptoms'>Add Symptoms</Link>
            </div>
          </div>
        }

        {this.props.checkinHistory.checkins.length > 0 &&
          <div className="">

              {this.props.groupSymptoms ?
              <div className={window.innerWidth > 1200 && "card"}>
                <SymptomChart
                  symptomNames={this.props.displayedSymptoms.map(symptom => symptom.name)}
                  symptomColors={this.props.displayedSymptoms.map(symptom => symptom.color)}
                  checkins={this.props.checkinHistory.checkins}
                  currentSymptomNames={this.props.userSymptoms.map(userSymptom => userSymptom.name)}
                  padding={{top: 30, right: 30, bottom: 10, left: 0}}
                />
              </div>
              : this.props.displayedSymptoms.map((symptom, index) => (
                <div className={window.innerWidth > 1200 && "card"} key={symptom.name}>
                  <SymptomChart
                    symptomNames={[symptom.name]}
                    symptomColors={[symptom.color]}
                    checkins={this.props.checkinHistory.checkins}
                    currentSymptomNames={this.props.userSymptoms.map(userSymptom => userSymptom.name)}
                    padding={{top: 30, right: 30, bottom: 10, left: 0}}
                  />
                </div>
              ))}
          </div>
        }
        <div className='section'>
          <h5>Checkins:</h5>
          {this.props.displayedCheckinTableItems.map(checkin =>
            <div className="section" key={checkin.date}>
              <h4>{checkin.date}</h4>
              { checkin.symptoms === undefined ?
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
                              dateSelectMode: 'from now on',
                              daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
                        <th>Symptom</th>
                        <th>Severity</th>
                      </tr>
                    </thead>

                    <tbody>
                      {checkin.symptoms.map(checkinSymptom =>
                        <tr key={checkinSymptom.name}>
                          <td>{checkinSymptom.name}</td>
                          <td>{checkinSymptom.severity === 0 ? 'N/A' : checkinSymptom.severity}</td>
                        </tr>
                      )}
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
  const currentSymptoms = UserSymptoms.find().fetch();
  const currentAndDeletedSymptoms = currentSymptoms.slice();
  const displayedCheckinTableItems = checkinHistoryIsReady && CheckinHistories.findOne().checkins.reverse().slice();
  const lastThreeDays = [moment().format('MMMM Do YYYY'), moment().subtract(1, 'days').format('MMMM Do YYYY'), moment().subtract(2, 'days').format('MMMM Do YYYY')];
  if (checkinHistoryIsReady) {
    CheckinHistories.findOne().checkins.forEach((checkin) => {
      checkin.symptoms.forEach((symptom) => {
        if (!currentAndDeletedSymptoms.map(anySymptom => anySymptom.name).includes(symptom.name)) {
          currentAndDeletedSymptoms.push({
            color: getNextColor(currentAndDeletedSymptoms.length),
            ...symptom
          });
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
    displayedCheckinTableItems,
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHistoryIsReady || !displayedCheckinTableItems || !symptomsHandle.ready() || !treatmentsHandle.ready()),
    groupSymptoms: Session.get('groupSymptoms') || false,
    includeDeletedSymptoms: Session.get('includeDeletedSymptoms') || false,
    showDeletedTab: currentSymptoms.map(symptom => symptom.name).toString() !== currentAndDeletedSymptoms.map(symptom => symptom.name).toString(),
    displayedSymptoms: Session.get('includeDeletedSymptoms') ? currentAndDeletedSymptoms : currentSymptoms,
  };

}, SymptomsHistory);
