import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import { Session } from 'meteor/session';
import { getNextColor } from '../../utils/utils';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';

import SymptomChart from '../components/SymptomChart';

class SymptomsHistory extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     groupSymptoms: false,
  //     includeDeleted: false,
  //     displayedSymptoms: []
  //   }
  // }
  //
  // componentDidMount() {
  //   Session.set('groupSymptoms', false)
  //   Session.set('includeDeleted', false)
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
            <button className={`btn ${this.props.includeDeleted ? 'deep-purple lighten-1' : 'grey'}`}
              onClick={() => Session.set('includeDeleted', !Session.get('includeDeleted'))}>
              {this.props.includeDeleted ?  'Exclude Deleted' : 'Include Deleted'}
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
              <Link className='ui basic button' to='/home/selectsymptoms'>Add Symptoms</Link>
            </div>
          </div>
        }

        {this.props.checkinHistory.checkins.length > 0 &&
          <div className="">

              {/* {this.props.displayedSymptoms.length > 0 && */}
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
        <div>
          <div className='section'></div>
          <h5>Checkins:</h5>
          {this.props.checkinHistory.checkins.map(checkin =>
            <div key={checkin.date}>
              <h4>{checkin.date}</h4>
              <table className='striped'>
                <thead>
                  <tr>
                    <th>Symptom</th>
                    <th>Severity</th>
                  </tr>
                </thead>

                <tbody>
                  {checkin.symptoms.map(symptoms =>
                    <tr key={symptoms.name}>
                      <td>{symptoms.name}</td>
                      <td>{symptoms.severity === 0 ? 'N/A' : symptoms.severity}</td>
                    </tr>
                  )}
                </tbody>
              </table>
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

  if (checkinHistoryIsReady) {
    CheckinHistories.findOne().checkins.forEach((checkin) => {
      checkin.symptoms.forEach((symptom) => {
        if (!currentAndDeletedSymptoms.map(anySymptom => anySymptom.name).includes(symptom.name)) {
          currentAndDeletedSymptoms.push({
            // color: getNextColor(currentAndDeletedSymptoms.map(symptom => symptom.color)[currentAndDeletedSymptoms.length - 1]),
            color: getNextColor(currentAndDeletedSymptoms.length),
            ...symptom
          });
        }
      })
    });
  }
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHistoryIsReady || !symptomsHandle.ready() || !treatmentsHandle.ready()),
    groupSymptoms: Session.get('groupSymptoms') || false,
    includeDeleted: Session.get('includeDeleted') || false,
    showDeletedTab: currentSymptoms.map(symptom => symptom.name).toString() !== currentAndDeletedSymptoms.map(symptom => symptom.name).toString(),
    displayedSymptoms: Session.get('includeDeleted') ? currentAndDeletedSymptoms : currentSymptoms,
  };

}, SymptomsHistory);
