import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import { Session } from 'meteor/session';
import moment from 'moment';
import { capitalizePhrase, getNextColor, sortSymptoms } from '../../../utils/utils';
import { Input, Col, Row } from 'react-materialize'

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

import Loader from '/imports/ui/components/Loader';
import SymptomChart from '../../components/patient/SymptomChart';
import SymptomChartItem from '../../components/patient/SymptomChartItem';
import Checkin from './Checkin';

import SideBarNav from '../../components/patient/history_views/SideBarNav';
import SymptomSelectGraph from '../../components/patient/history_views/SymptomSelectGraph';
import SymptomSystemGraph from '../../components/patient/history_views/SymptomSystemGraph';
import SymptomWorstGraph from '../../components/patient/history_views/SymptomWorstGraph';
import SymptomChangesGraph from '../../components/patient/history_views/SymptomChangesGraph';
import SymptomHistoryTable from '../../components/patient/history_views/SymptomHistoryTable';


class SymptomsHistory2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // groupSymptoms: false,
      // includeDeletedSymptoms: false,
      // displayedSymptoms: []
      graphedSymptoms: [],
      // graphStartDate: null,
      // graphEndDate: null,
      // checkinDates: [],
      selectedTab: 'symptomSelectGraph',
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

  // componentDidUpdate(prevProps) {
  //   // if (prevProps.displayedSymptoms !== this.props.displayedSymptoms) {
  //   //   this.setState({
  //   //     displayedSymptoms: this.props.displayedSymptoms,
  //   //   });
  //   // }
  //   if (this.props.checkinHistory && (!Session.get('graphStartDate') || !Session.get('graphEndDate'))) {
  //   // if (this.props.checkinHistory && (!this.state.graphStartDate || !this.state.graphEndDate)) {
  //     console.log(1);
  //     const graphStartDate = this.props.checkinHistory.checkins[0].date;
  //     const graphEndDate = this.props.checkinHistory.checkins[this.props.checkinHistory.checkins.length -1].date;
  //     const totalDatesNumber = moment(graphEndDate, 'MMMM Do YYYY').diff(moment(graphStartDate, 'MMMM Do YYYY') , 'days') + 1;
  //     const checkinDates = [...Array(totalDatesNumber).keys()].map((dateOffset) =>
  //       moment(graphStartDate, 'MMMM Do YYYY').add(dateOffset, "d").format('MMMM Do YYYY')
  //     );
  //     // this.setState({graphStartDate, graphEndDate, checkinDates})
  //     // Session.set({graphStartDate, graphEndDate, checkinDates})
  //   }
  // }
  //
  // handleToggleOption(e, target) {
  //   Session.set(target, !Session.get(target))
  //   this.setState({[target]: Session.get(target)})
  // }
  handleTabChange(tabName) {
    this.setState({'selectedTab': tabName})
  }

  handleDateRangeChange(customRangeControl, rangeValue) {
    const finalCheckinDate = this.props.checkinHistory.checkins[this.props.checkinHistory.checkins.length - 1].date;
    const initialCheckinDate = this.props.checkinHistory.checkins[0].date;

    if (customRangeControl === undefined) {
      if (rangeValue === 'all_dates') {
        Session.set({
          'graphStartDate': initialCheckinDate,
          'graphEndDate': finalCheckinDate
        });
      } else if (rangeValue === 'seven_days') {
        Session.set({
          'graphStartDate': moment(finalCheckinDate, 'MMMM Do YYYY').subtract(6, 'days').format('MMMM Do YYYY'),
          'graphEndDate': finalCheckinDate
        });
      } else if (rangeValue === 'thirty_days') {
        Session.set({
          'graphStartDate': moment(finalCheckinDate, 'MMMM Do YYYY').subtract(29, 'days').format('MMMM Do YYYY'),
          'graphEndDate': finalCheckinDate
        });
      } else if (rangeValue === 'twelve_months') {
        Session.set({
          'graphStartDate': moment(finalCheckinDate, 'MMMM Do YYYY').subtract(1, 'year').format('MMMM Do YYYY'),
          'graphEndDate': finalCheckinDate
        });
      } else if (rangeValue === 'year_to_current') {
        Session.set({
          'graphStartDate': moment(finalCheckinDate, 'MMMM Do YYYY').startOf('year').format('MMMM Do YYYY'),
          'graphEndDate': finalCheckinDate
        });
      } else if (rangeValue === 'custom' && Session.get('dateRangeOption') !== 'custom') {
        Session.set({
          'graphStartDate': initialCheckinDate,
          'graphEndDate': finalCheckinDate
        });
      }
      Session.set('dateRangeOption', rangeValue);
    } else {
      Session.set(customRangeControl, rangeValue);
    }
  }

  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className="page-content page-content--symptom-history">
        <div className='symptom-history__flex-wrapper'>

          <div className='symptom-history__navbar__container'>
            <SideBarNav selectedTab={this.state.selectedTab} handleTabChange={this.handleTabChange.bind(this)}/>
          </div>

          <div className='symptom-history__graph-view__container'>
            {this.state.selectedTab === 'symptomSelectGraph' ?
              <SymptomSelectGraph
                symptoms={this.props.displayedSymptoms}
                checkins={this.props.checkinHistory.checkins}
                currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                startDate={this.props.graphStartDate}
                endDate={this.props.graphEndDate}
                checkinDates={this.props.checkinHistory.checkins.map(checkin => checkin.date)}
                handleDateRangeChange={this.handleDateRangeChange.bind(this)}
                dateRangeOption={this.props.dateRangeOption}
              />
              : this.state.selectedTab === 'symptomSystemGraph' ?
              <SymptomSystemGraph
                systems={this.props.symptomSystems}
                symptoms={this.props.displayedSymptoms}
                checkins={this.props.checkinHistory.checkins}
                currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                startDate={this.props.graphStartDate}
                endDate={this.props.graphEndDate}
                checkinDates={this.props.checkinHistory.checkins.map(checkin => checkin.date)}
                handleDateRangeChange={this.handleDateRangeChange.bind(this)}
                dateRangeOption={this.props.dateRangeOption}
              />
              : this.state.selectedTab === 'symptomWorstGraph' ?
              <SymptomWorstGraph
                symptoms={this.props.worstSymptoms}
                checkins={this.props.checkinHistory.checkins}
                currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                startDate={this.props.graphStartDate}
                endDate={this.props.graphEndDate}
                checkinDates={this.props.checkinHistory.checkins.map(checkin => checkin.date)}
                handleDateRangeChange={this.handleDateRangeChange.bind(this)}
                dateRangeOption={this.props.dateRangeOption}
              />
              : this.state.selectedTab === 'symptomChangesGraph' ?
              <SymptomChangesGraph
                symptoms={this.props.symptomsByChanges}
                checkins={this.props.checkinHistory.checkins}
                currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                startDate={this.props.graphStartDate}
                endDate={this.props.graphEndDate}
                checkinDates={this.props.checkinHistory.checkins.map(checkin => checkin.date)}
                handleDateRangeChange={this.handleDateRangeChange.bind(this)}
                dateRangeOption={this.props.dateRangeOption}
              />
              : this.state.selectedTab === 'symptomHistoryTable' ?
              <SymptomHistoryTable
                checkins={this.props.displayedCheckinTableItems}
                currentSymptoms={this.props.currentSymptoms}
                currentTreatments={this.props.userTreatments}
              />
              :
              <div></div>
            }
          </div>
        </div>

        {/* <div className='section'></div>
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
        </div> */}
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

  const graphStartDate = Session.get('graphStartDate') ? Session.get('graphStartDate') : checkinHistoryIsReady ? CheckinHistories.findOne().checkins[0].date : null;
  const graphEndDate = Session.get('graphEndDate') ? Session.get('graphEndDate') : checkinHistoryIsReady ? CheckinHistories.findOne().checkins[CheckinHistories.findOne().checkins.length -1].date : null;
  // const totalDatesNumber = checkinHistoryIsReady ? moment(graphEndDate, 'MMMM Do YYYY').diff(moment(graphStartDate, 'MMMM Do YYYY') , 'days') + 1 : 0;
  // const checkinDates = checkinHistoryIsReady ? [...Array(totalDatesNumber).keys()].map((dateOffset) =>
  //   moment(graphStartDate, 'MMMM Do YYYY').add(dateOffset, "d").format('MMMM Do YYYY')
  // ) : [];
  const symptomsWithScoreDetails = checkinHistoryIsReady ? sortSymptoms(displayedSymptoms, CheckinHistories.findOne().checkins, graphStartDate, graphEndDate) : undefined;


  const symptomsSeveritySorted = symptomsWithScoreDetails ? symptomsWithScoreDetails.sort((a, b) => b.severityAverage - a.severityAverage) : []
  if (checkinHistoryIsReady) {
    symptomSystems.sort((a, b) => {
      const systemASymptoms = symptomsWithScoreDetails.filter(symptom => symptom.system === a);
      const systemBSymptoms = symptomsWithScoreDetails.filter(symptom => symptom.system === b);
      const systemASeverityAverage = systemASymptoms.map(symptom => symptom.severityAverage).reduce((acc, currentVal) => (acc + currentVal)) / systemASymptoms.length;
      const systemBSeverityAverage = systemBSymptoms.map(symptom => symptom.severityAverage).reduce((acc, currentVal) => (acc + currentVal)) / systemBSymptoms.length;

      if (systemASeverityAverage >= systemBSeverityAverage) {
        // console.log(1);
        // console.log(a, '===>', b);
        // console.log(systemASeverityAverage, '===>', systemBSeverityAverage);
        return -1;
      } else {
        // console.log(2);
        // console.log(a, '===>', b);
        // console.log(systemASeverityAverage, '===>', systemBSeverityAverage);
        return 1;
      }
    });
  }
  return {
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
    symptomSystems,
    //edit for history2
    // worstSymptoms: displayedSymptomsExtended.sort((a,b) => b.averageSeverityScore - a.averageSeverityScore).slice(0, 5),
    // worstSymptoms: !checkinHistoryIsReady ? [] : sortSymptoms('highest', displayedSymptoms, CheckinHistories.findOne().checkins, graphStartDate, graphEndDate).slice(0, 5),
    // symptomsByChanges: !checkinHistoryIsReady ? [] : sortSymptoms('changes', displayedSymptoms, CheckinHistories.findOne().checkins, graphStartDate, graphEndDate).slice(0, 5),
    worstSymptoms: symptomsSeveritySorted.slice(0, 5),
    symptomsByChanges: symptomsWithScoreDetails ? symptomsWithScoreDetails.sort((a, b) => b.biggestChangeAverage - a.biggestChangeAverage).slice(0, 5) : [],
    dateRangeOption: Session.get('dateRangeOption') || 'all_dates',
    graphStartDate,
    graphEndDate,
  };

}, SymptomsHistory2);
