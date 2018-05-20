import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import { Session } from 'meteor/session';
import moment from 'moment';
import { capitalizePhrase, getNextColor } from '../../../utils/utils';
import { Input } from 'react-materialize'

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import SymptomChart from '../../components/patient/SymptomChart';
import SymptomChartItem from '../../components/patient/SymptomChartItem';
import Checkin from './Checkin';

class SymptomsHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // groupSymptoms: false,
      // includeDeletedSymptoms: false,
      // displayedSymptoms: []
      graphedSymptoms: [],
      graphStartDate: null,
      graphEndDate: null,
      checkinDates: []
    }
  }
  //
  // componentDidMount() {
  //   Session.set('groupSymptoms', false)
  //   Session.set('includeDeletedSymptoms', false)
  //
  //   this.setState({
  //     displayedSymptoms: this.props.displayedSymptoms
  //   });
  // }

  componentDidUpdate(prevProps) {
    // if (prevProps.displayedSymptoms !== this.props.displayedSymptoms) {
    //   this.setState({
    //     displayedSymptoms: this.props.displayedSymptoms,
    //   });
    // }
    if (this.props.checkinHistory && (!this.state.graphStartDate || !this.state.graphEndDate)) {
      const graphStartDate = this.props.checkinHistory.checkins[0].date;
      const graphEndDate = this.props.checkinHistory.checkins[this.props.checkinHistory.checkins.length -1].date;
      const totalDatesNumber = moment(graphEndDate, 'MMMM Do YYYY').diff(moment(graphStartDate, 'MMMM Do YYYY') , 'days') + 1;
      const checkinDates = [...Array(totalDatesNumber).keys()].map((dateOffset) =>
        moment(graphStartDate, 'MMMM Do YYYY').add(dateOffset, "d").format('MMMM Do YYYY')
      );
      this.setState({graphStartDate, graphEndDate, checkinDates})
    }
  }
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
        {/* <div className="page-content__main-heading">History: Symptoms</div> */}

        <div className='section'></div>
        <p>Select 5 symptoms to graph:</p>
        {/* <div className='row'> */}
          {this.props.displayedSymptoms.map(symptom =>
            <Input
              key={symptom.name}
              type='checkbox'
              name='graphedSymptoms'
              value={symptom.name}
              label={symptom.name}
              defaultChecked={this.state.graphedSymptoms.includes(symptom.name)}
              disabled={this.state.graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name) === false && this.state.graphedSymptoms.length >= 5}
              onChange={() => {
                const graphedSymptoms = this.state.graphedSymptoms.slice();
                if (graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name)) {
                  const symptomIndex = graphedSymptoms.indexOf(symptom)
                  graphedSymptoms.splice(symptomIndex, 1);
                } else {
                  graphedSymptoms.push(symptom)
                }
                this.setState({graphedSymptoms})
              }}
            />
          )}
        {/* </div> */}
        <SymptomChart
          symptomNames={this.state.graphedSymptoms.map(symptom => symptom.name)}
          symptomColors={this.state.graphedSymptoms.map(symptom => symptom.color)}
          checkins={this.props.checkinHistory.checkins}
          currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
          padding={{top: 30, right: 30, bottom: 10, left: 0}}
        />

        <div className='section'></div>
        <div className='row history-options-button-container'>
          <Input s={2} type='select' label='Group:' defaultValue={this.props.groupSymptomsBy} onChange={(e) => Session.set('groupSymptomsBy', e.target.value)}>
            <option value='all'>All</option>
            <option value='system'>By Organ System</option>
            <option value='none'>None</option>
          </Input>
          <Input s={2} type='select' label='Sort:' defaultValue={this.props.sortSymptomsBy} onChange={(e) => Session.set('sortSymptomsBy', e.target.value)}>
            <option value='averageWorst'>Average Worst</option>
            <option value='currentWorst'>Current Worst</option>
          </Input>
          <Input s={3} type='select' label='Max # of Symptoms per Graph:' defaultValue={this.props.maxSymptomsPerSegment} onChange={(e) => Session.set('maxSymptomsPerSegment', parseInt(e.target.value))}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
          </Input>
          {this.props.showDeletedTab &&
            <button className={`col s2 offset-s3 btn ${this.props.includeDeletedSymptoms ? 'white black-text' : 'black'}`}
              onClick={() => Session.set('includeDeletedSymptoms', !Session.get('includeDeletedSymptoms'))}>
              {this.props.includeDeletedSymptoms ?  'Exclude Deleted' : 'Include Deleted'}
            </button>
          }
          <Input s={2} type='select' label='Start Date' value={this.state.graphStartDate || ''} onChange={(e) => this.setState({graphStartDate: e.target.value})}>
            {this.state.checkinDates.map(checkinDate =>
              <option
                key={checkinDate}
                value={checkinDate}
                disabled={moment(checkinDate, 'MMMM Do YYYY').isAfter(moment(this.state.graphEndDate, "MMMM Do YYYY"), 'day')}>
                {checkinDate}
              </option>
            )}
          </Input>
          <Input s={2} type='select' label='End Date' value={this.state.graphEndDate || ''} onChange={(e) => this.setState({graphEndDate: e.target.value})}>
            {this.state.checkinDates.map(checkinDate =>
              <option
                key={checkinDate}
                value={checkinDate}
                disabled={moment(checkinDate, 'MMMM Do YYYY').isBefore(moment(this.state.graphStartDate, "MMMM Do YYYY"), 'day')}>
                {checkinDate}
              </option>
            )}
          </Input>
        </div>

        {/* <div className='page-content--symptom-history__graph-wrapper'> */}
        <div className='page-content--symptom-history__graph-wrapper z-depth-4'>
          {this.props.checkinHistory.checkins.length > 0 &&
            <div>
              {this.props.groupSymptomsBy === 'all' ?
                <SymptomChartItem
                  title='All Symptoms'
                  symptoms={this.props.displayedSymptoms}
                  currentUserSymptomsNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                  checkins={this.props.checkinHistory.checkins} maxSymptomsPerSegment={this.props.maxSymptomsPerSegment}
                  startDate={this.state.graphStartDate}
                  endDate={this.state.graphEndDate}
                />
              : this.props.groupSymptomsBy === 'system' ?
                this.props.symptomSystems.map((system, index) =>
                  <SymptomChartItem
                    key={index}
                    title={system}
                    symptoms={this.props.displayedSymptoms.filter(symptom => symptom.system === system)}
                    currentUserSymptomsNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                    checkins={this.props.checkinHistory.checkins}
                    maxSymptomsPerSegment={this.props.maxSymptomsPerSegment}
                    startDate={this.state.graphStartDate}
                    endDate={this.state.graphEndDate}
                  />
                )
              : this.props.displayedSymptoms.map((symptom, index) => (
                <SymptomChartItem
                  key={index}
                  symptoms={[symptom]}
                  currentUserSymptomsNames={[symptom.name]}
                  checkins={this.props.checkinHistory.checkins}
                  maxSymptomsPerSegment={this.props.maxSymptomsPerSegment}
                  startDate={this.state.graphStartDate}
                  endDate={this.state.graphEndDate}
                />
              ))}
            </div>
          }
        </div>
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
                        symptoms: this.props.currentSymptoms,
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
                        <th>Symptom</th>
                        <th>Severity</th>
                      </tr>
                    </thead>

                    <tbody>
                      {checkin.symptoms.map(checkinSymptom =>
                        <tr key={checkinSymptom.name}>
                          <td>{capitalizePhrase(checkinSymptom.name)}</td>
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
  // const userSymptoms =  UserSymptoms.find({}, {$sort: {system: 1}}).fetch();
  const displayedSymptoms = Session.get('includeDeletedSymptoms') ? currentAndDeletedSymptoms : currentSymptoms;
  const maxSymptomsPerSegment = Session.get('maxSymptomsPerSegment') || 3;
  const symptomSystems = [];
  displayedSymptoms.map(symptom => symptom.system).forEach(system => !symptomSystems.includes(system) && symptomSystems.push(system));

  // edit
  let displayedSymptomsExtended = [];
  if (checkinHistoryIsReady) {
    displayedSymptomsExtended = displayedSymptoms.map(symptom => {
      let totalSeverityScore = 0;
      let symptomCount = 0;
      let lastSeverityScore = 0;
      const allSymptomCheckins = CheckinHistories.findOne().checkins.map(checkin => checkin.symptoms);
      allSymptomCheckins.forEach(symptomCheckinGroup => {
        symptomCheckinGroup.forEach(symptomCheckin => {
          if (symptomCheckin.name === symptom.name) {
            totalSeverityScore += symptomCheckin.severity;
            lastSeverityScore = symptomCheckin.severity;
            symptomCount++;
          }
        })
      })
      return {
        averageSeverityScore: totalSeverityScore / symptomCount,
        lastSeverityScore,
        ...symptom
      }
    });
  }
  displayedSymptomsExtended.sort((a, b) => {
    if (Session.get('sortSymptomsBy') === 'currentWorst') {
      return b.lastSeverityScore - a.lastSeverityScore
    } else {
      return b.averageSeverityScore - a.averageSeverityScore
    }
  });
  // console.log(sortedSymptoms);
  // console.log(sortedSymptoms);
  // checkinHistoryIsReady && CheckinHistories.findOne().checkins.map(checkins => checkins.symptoms).forEach(checkinSymptomGroup => {
  //   console.log(checkinSymptomGroup);
  // });
  // const sortedSymptoms = userSymptoms.sort((a, b) => {
  //
  //   console.log(b);
  // })
  return {
    // userSymptoms,
    displayedSymptoms: displayedSymptomsExtended,
    currentSymptoms,
    userTreatments: UserTreatments.find().fetch(),
    displayedCheckinTableItems,
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHistoryIsReady || !displayedCheckinTableItems || !symptomsHandle.ready() || !treatmentsHandle.ready()),
    // groupSymptoms: Session.get('groupSymptoms') || true,
    groupSymptomsBy: Session.get('groupSymptomsBy') || 'system',
    sortSymptomsBy: Session.get('sortSymptomsBy') || 'averageWorst',
    includeDeletedSymptoms: Session.get('includeDeletedSymptoms') || false,
    showDeletedTab: currentSymptoms.map(symptom => symptom.name).toString() !== currentAndDeletedSymptoms.map(symptom => symptom.name).toString(),
    maxSymptomsPerSegment,
    symptomSystems
  };

}, SymptomsHistory);
