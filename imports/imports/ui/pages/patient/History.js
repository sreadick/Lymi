import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import { Session } from 'meteor/session';
import moment from 'moment';
import { capitalizePhrase, getNextColor, sortSymptoms, getExtendedHistory, getExtendedTreatmentHistory } from '../../../utils/utils';
import { Input, Col, Row } from 'react-materialize'

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';
import { CommonSymptoms } from '../../../api/common-symptoms';

import Loader from '/imports/ui/components/Loader';
import SymptomChart from '../../components/patient/SymptomChart';
import SymptomChartItem from '../../components/patient/SymptomChartItem';
import Checkin from './Checkin';

import HistoryHeader from '../../components/patient/history_views/HistoryHeader';
import SideBarNav from '../../components/patient/history_views/SideBarNav';

import SymptomSelectGraph from '../../components/patient/history_views/SymptomSelectGraph';
import SymptomSystemGraph from '../../components/patient/history_views/SymptomSystemGraph';
import SymptomWorstGraph from '../../components/patient/history_views/SymptomWorstGraph';
// import SymptomChangesGraph from '../../components/patient/history_views/SymptomChangesGraph';
import SymptomMostImprovedGraph from '../../components/patient/history_views/SymptomMostImprovedGraph';
import SymptomLeastImprovedGraph from '../../components/patient/history_views/SymptomLeastImprovedGraph';
import SymptomHistoryTable from '../../components/patient/history_views/SymptomHistoryTable';

import FullHistoryChart from '../../components/patient/history_views/FullHistoryChart';
import FullHistoryTable from '../../components/patient/history_views/FullHistoryTable';

import TreatmentChart from '../../components/patient/history_views/TreatmentChart';
import TreatmentTable from '../../components/patient/history_views/TreatmentTable';

import NotableEventsSelect from '../../components/patient/history_views/NotableEventsSelect';
import NotableEventsTable from '../../components/patient/history_views/NotableEventsTable';

// Todo: Refine extendedTreatmentCheckins to account for current day missed check-in
// Todo: Include deleted Sx/Rx
// Todo: Make severityAverage weekly moving average (rather than day to day)

class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // groupSymptoms: false,
      // includeDeletedSymptoms: false,
      // displayedSymptoms: []
      // graphedSymptoms: [],
      // graphStartDate: null,
      // graphEndDate: null,
      // checkinDates: [],
      selectedGroup: 'fullHistory',
      selectedTab: 'fullHistorySummary',
      selectedTabTitle: 'Summary'
    }
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
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
  handleGroupChange(group) {
    this.setState({selectedGroup: group})
  }
  handleTabChange(tab, title) {
    this.setState({selectedTab: tab, selectedTabTitle: title})
  }

  handleDateRangeChange(customRangeControl, rangeValue) {
    const currentDate = moment().format('MMMM Do YYYY');
    // const finalCheckinDate = this.props.checkinHistory.checkins[this.props.checkinHistory.checkins.length - 1].date;
    const initialCheckinDate = this.props.checkinHistory.checkins[0].date;
    if (customRangeControl === undefined) {
      if (rangeValue === 'all_dates') {
        Session.set({
          'graphStartDate': initialCheckinDate,
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'seven_days') {
        Session.set({
          'graphStartDate': moment(currentDate, 'MMMM Do YYYY').subtract(6, 'days').format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'thirty_days') {
        Session.set({
          'graphStartDate': moment(currentDate, 'MMMM Do YYYY').subtract(29, 'days').format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'twelve_months') {
        Session.set({
          'graphStartDate': moment(currentDate, 'MMMM Do YYYY').subtract(1, 'year').format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'year_to_current') {
        Session.set({
          'graphStartDate': moment(currentDate, 'MMMM Do YYYY').startOf('year').format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'prev_appt_to_current') {
        const appts = Meteor.user().profile.medical.appointments.slice().reverse();
        const lastAppt = appts.find(date => moment(date).isBefore(moment()));
        Session.set({
          'graphStartDate': moment(lastAppt).format('MMMM Do YYYY'),
          'graphEndDate': currentDate
        });
      } else if (rangeValue === 'custom' && Session.get('dateRangeOption') !== 'custom') {
        Session.set({
          'graphStartDate': initialCheckinDate,
          'graphEndDate': currentDate
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
            <SideBarNav
              selectedTab={this.state.selectedTab}
              selectedGroup={this.state.selectedGroup}
              handleTabChange={this.handleTabChange}
              handleGroupChange={this.handleGroupChange}
            />
          </div>

          <div className='symptom-history__graph-view__container'>
            <div className='symptom-history__graph-view card'>
              <HistoryHeader
                handleDateRangeChange={this.handleDateRangeChange}
                title={this.state.selectedTabTitle}
                startDate={this.props.graphStartDate}
                endDate={this.props.graphEndDate}
                dateRangeOption={this.props.dateRangeOption}
                allDates={this.props.allDates}
                showDeletedSymptomTab={(this.props.showDeletedSymptomTab && (this.state.selectedTab === "fullHistorySummary" || this.state.selectedTab === "symptomSelectGraph" || this.state.selectedTab === "symptomSystemGraph" || this.state.selectedTab === "symptomWorstGraph" || this.state.selectedTab === "symptomChangesGraph" || this.state.selectedTab === "symptomMostImprovedGraph" || this.state.selectedTab === "symptomLeastImprovedGraph"))}
                includeDeletedSymptoms={this.props.includeDeletedSymptoms}

                // showDeletedTreatmentTab={(this.props.showDeletedTreatmentTab && (this.state.selectedTab === "fullHistorySummary" || this.state.selectedTab === "treatmentChart"))}
                showDeletedTreatmentTab={false}
                includeDeletedTreatments={this.props.includeDeletedTreatments}

                // checkinDates={this.props.checkinHistory.checkins.map(checkin => checkin.date)}
                // checkinDates={this.props.checkinDates}
              />
              { this.state.selectedTab === 'fullHistorySummary' ?
                <FullHistoryChart
                  startDate={this.props.graphStartDate}
                  endDate={this.props.graphEndDate}
                  // filteredCheckins={this.props.checkinHistory.checkins.filter(checkin => this.props.checkinDates.includes(checkin.date))}
                  extendedCheckins={this.props.extendedCheckins}
                  showFullHistory={true}
                  displayedSymptoms={this.props.displayedSymptoms}
                />
              : this.state.selectedTab === 'fullHistoryTable' ?
                <FullHistoryTable
                  checkins={this.props.displayedCheckinTableItems.filter(checkin => this.props.checkinDates.includes(checkin.date))}
                  currentSymptoms={this.props.currentSymptoms}
                  currentTreatments={this.props.currentTreatments}
                  // startDate={this.props.graphStartDate}
                  // endDate={this.props.graphEndDate}
                />
              : this.state.selectedTab === 'symptomSelectGraph' ?
                <SymptomSelectGraph
                  symptoms={this.props.displayedSymptoms}
                  checkins={this.props.checkinHistory.checkins}
                  currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                  startDate={this.props.graphStartDate}
                  endDate={this.props.graphEndDate}
                  includeDeletedSymptoms={this.props.includeDeletedSymptoms}
                />
              : this.state.selectedTab === 'symptomSystemGraph' ?
                <SymptomSystemGraph
                  systems={this.props.symptomSystems}
                  symptoms={this.props.displayedSymptoms}
                  checkins={this.props.checkinHistory.checkins}
                  currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                  startDate={this.props.graphStartDate}
                  endDate={this.props.graphEndDate}
                />
              : this.state.selectedTab === 'symptomWorstGraph' ?
                <SymptomWorstGraph
                  symptoms={this.props.worstSymptoms}
                  checkins={this.props.checkinHistory.checkins}
                  currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                  startDate={this.props.graphStartDate}
                  endDate={this.props.graphEndDate}
                />
              // : this.state.selectedTab === 'symptomChangesGraph' ?
              //   <SymptomChangesGraph
              //     symptoms={this.props.symptomsByChanges}
              //     checkins={this.props.checkinHistory.checkins}
              //     currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
              //     startDate={this.props.graphStartDate}
              //     endDate={this.props.graphEndDate}
              //   />
              : this.state.selectedTab === 'symptomMostImprovedGraph' ?
                <SymptomMostImprovedGraph
                  symptoms={this.props.mostImprovedSymptoms}
                  checkins={this.props.checkinHistory.checkins}
                  currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                  startDate={this.props.graphStartDate}
                  endDate={this.props.graphEndDate}
                />
              : this.state.selectedTab === 'symptomLeastImprovedGraph' ?
                <SymptomLeastImprovedGraph
                  symptoms={this.props.leastImprovedSymptoms}
                  checkins={this.props.checkinHistory.checkins}
                  currentSymptomNames={this.props.currentSymptoms.map(symptom => symptom.name)}
                  startDate={this.props.graphStartDate}
                  endDate={this.props.graphEndDate}
                />
              : this.state.selectedTab === 'symptomHistoryTable' ?
                <SymptomHistoryTable
                  checkins={this.props.displayedCheckinTableItems.filter(checkin => this.props.checkinDates.includes(checkin.date))}
                  currentSymptoms={this.props.currentSymptoms}
                  currentTreatments={this.props.currentTreatments}
                  // startDate={this.props.graphStartDate}
                  // endDate={this.props.graphEndDate}
                />
              : this.state.selectedTab === 'treatmentChart' ?
                <TreatmentChart
                  // userTreatments={this.props.currentTreatments}
                  userTreatments={this.props.displayedTreatments}
                  // For retroactive data
                  // extendedTreatmentCheckins={this.props.extendedTreatmentCheckins}
                  // For missing checkins
                  extendedTreatmentCheckins={this.props.extendedCheckins}
                />
              : this.state.selectedTab === 'treatmentTable' ?
                <TreatmentTable
                  checkins={this.props.displayedCheckinTableItems.filter(checkin => this.props.checkinDates.includes(checkin.date))}
                  currentSymptoms={this.props.currentSymptoms}
                  currentTreatments={this.props.currentTreatments}
                  // startDate={this.props.graphStartDate}
                  // endDate={this.props.graphEndDate}
                />
              : this.state.selectedTab === 'notableEventsSelect' ?
                <NotableEventsSelect
                  checkins={this.props.checkinHistory.checkins.filter(checkin => this.props.checkinDates.includes(checkin.date))}
                  startDate={this.props.graphStartDate}
                  endDate={this.props.graphEndDate}
                />
              : this.state.selectedTab === 'notableEventsTable' ?
                <NotableEventsTable
                  checkins={this.props.checkinHistory.checkins.filter(checkin => !!checkin.notableEvents && this.props.checkinDates.includes(checkin.date)).slice().reverse()}
                  startDate={this.props.graphStartDate}
                  endDate={this.props.graphEndDate}
                />
              :
                <div></div>
              }
            </div>
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
  const commonSymptomsHandle = Meteor.subscribe('commonSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');

  const currentTreatments = UserTreatments.find().fetch();
  const currentSymptoms = UserSymptoms.find().fetch();

  const checkinHistory = CheckinHistories.findOne();
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  const currentAndDeletedSymptoms = currentSymptoms.slice();
  const currentAndDeletedTreatments = currentTreatments.slice();
  const displayedCheckinTableItems = checkinHistoryIsReady && CheckinHistories.findOne().checkins.reverse().slice();
  const lastThreeDays = [moment().format('MMMM Do YYYY'), moment().subtract(1, 'days').format('MMMM Do YYYY'), moment().subtract(2, 'days').format('MMMM Do YYYY')];
  if (checkinHistoryIsReady) {
    CheckinHistories.findOne().checkins.forEach((checkin) => {
      checkin.symptoms.forEach((symptom) => {
        if (!currentAndDeletedSymptoms.map(anySymptom => anySymptom.name).includes(symptom.name)) {
          currentAndDeletedSymptoms.push({
            color: getNextColor(currentAndDeletedSymptoms.length),
            system: symptom.system ? symptom.system : CommonSymptoms.findOne({name: symptom.name}) ? CommonSymptoms.findOne({name: symptom.name}).system : 'Other',
            _id: checkin.date + '_' + symptom.name,
            ...symptom
          });
        }
      });
      checkin.treatments.forEach((treatment) => {
        if (!currentAndDeletedTreatments.map(anyTreatment => anyTreatment.name).includes(treatment.name)) {
          currentAndDeletedTreatments.push({
            // color: getNextColor(currentAndDeletedTreatments.length),
            _id: treatment.name,
            // _id: checkin.date + '_' + treatment.name,
            userId: Meteor.userId(),
            name: treatment.name
            // ...treatment
          });
        }
      });
    });
    lastThreeDays.forEach((day, index) => {
      if (!CheckinHistories.findOne().checkins.map(checkin => checkin.date).includes(day) && moment(day, 'MMMM Do YYYY').isAfter(moment(CheckinHistories.findOne().checkins[0].date, 'MMMM Do YYYY'))) {
        displayedCheckinTableItems.splice(index, 0, {date: day, symptoms: undefined, treatments: undefined, notableEvents: '', index})
      }
    })
  }
  // const userSymptoms =  UserSymptoms.find({}, {$sort: {system: 1}}).fetch();
  const displayedSymptoms = Session.get('includeDeletedSymptoms') ? currentAndDeletedSymptoms : currentSymptoms;
  const displayedTreatments = Session.get('includeDeletedTreatments') ? currentAndDeletedTreatments : currentTreatments;
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
        ...symptom,
        // system: symptom.system ? symptom.system : CommonSymptoms.findOne({name: symptom.name}) ? CommonSymptoms.findOne({name: symptom.name}).system : 'Other',
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
  // const graphEndDate = Session.get('graphEndDate') ? Session.get('graphEndDate') : checkinHistoryIsReady ? CheckinHistories.findOne().checkins[CheckinHistories.findOne().checkins.length -1].date : null;
  const graphEndDate = Session.get('graphEndDate') ? Session.get('graphEndDate') : checkinHistoryIsReady ? moment().format('MMMM Do YYYY') : null;
  // const totalDatesNumber = checkinHistoryIsReady ? moment(graphEndDate, 'MMMM Do YYYY').diff(moment(graphStartDate, 'MMMM Do YYYY') , 'days') + 1 : 0;
  const totalDatesNumber = checkinHistoryIsReady ? moment().diff(moment(CheckinHistories.findOne().checkins[0].date, 'MMMM Do YYYY'), 'days') + 1 : 0;
  const allDates = checkinHistoryIsReady ? [...Array(totalDatesNumber).keys()].map((dateOffset) =>
    moment(CheckinHistories.findOne().checkins[0].date, 'MMMM Do YYYY').add(dateOffset, "d").format('MMMM Do YYYY')
  ) : [];

  const checkinDatesNumber = checkinHistoryIsReady ? moment(graphEndDate, 'MMMM Do YYYY').diff(moment(graphStartDate, 'MMMM Do YYYY') , 'days') + 1 : 0;
  const checkinDates = checkinHistoryIsReady ? [...Array(checkinDatesNumber).keys()].map((dateOffset) =>
    moment(graphStartDate, 'MMMM Do YYYY').add(dateOffset, "d").format('MMMM Do YYYY')
  ) : [];
  const symptomsWithScoreDetails = checkinHistoryIsReady ? sortSymptoms(displayedSymptoms, CheckinHistories.findOne().checkins, graphStartDate, graphEndDate) : undefined;
  // console.log(symptomsWithScoreDetails);
  const symptomsSeveritySorted = symptomsWithScoreDetails ? symptomsWithScoreDetails.slice().sort((a, b) => b.severityAverage - a.severityAverage) : []
  const symptomsImprovementSorted = symptomsWithScoreDetails ? symptomsWithScoreDetails.slice().sort((a, b) => b.improvementAverage - a.improvementAverage) : []
  if (checkinHistoryIsReady) {
    symptomSystems.sort((a, b) => {
      const systemASymptoms = symptomsWithScoreDetails.filter(symptom => symptom.system === a);
      const systemBSymptoms = symptomsWithScoreDetails.filter(symptom => symptom.system === b);
      const systemASeverityAverage = systemASymptoms.map(symptom => symptom.severityAverage).reduce((acc, currentVal) => (acc + currentVal)) / systemASymptoms.length;
      const systemBSeverityAverage = systemBSymptoms.map(symptom => symptom.severityAverage).reduce((acc, currentVal) => (acc + currentVal)) / systemBSymptoms.length;

      if (systemASeverityAverage >= systemBSeverityAverage) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  
  let extendedCheckins = (symptomsHandle.ready() && treatmentsHandle.ready() && checkinHandle.ready() && CheckinHistories.findOne().checkins.length > 0) ? getExtendedHistory(currentSymptoms, currentTreatments, CheckinHistories.findOne().checkins, 'full') : []
  extendedCheckins = extendedCheckins.filter(checkin => moment(checkin.date, "MMMM Do YYYY").isBetween(moment(graphStartDate, "MMMM Do YYYY"), moment(graphEndDate, "MMMM Do YYYY"), null, '[]'));
  return {
    displayedSymptoms: displayedSymptomsExtended,
    displayedTreatments,
    currentSymptoms,
    currentTreatments,
    displayedCheckinTableItems,
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHistoryIsReady || !displayedCheckinTableItems || !symptomsHandle.ready() || !commonSymptomsHandle.ready() || !treatmentsHandle.ready()),
    // groupSymptoms: Session.get('groupSymptoms') || true,
    groupSymptomsBy: Session.get('groupSymptomsBy') || 'system',
    sortSymptomsBy: Session.get('sortSymptomsBy') || 'averageWorst',
    maxSymptomsPerSegment,
    symptomSystems,
    // worstSymptoms: displayedSymptomsExtended.sort((a,b) => b.averageSeverityScore - a.averageSeverityScore).slice(0, 5),
    // worstSymptoms: !checkinHistoryIsReady ? [] : sortSymptoms('highest', displayedSymptoms, CheckinHistories.findOne().checkins, graphStartDate, graphEndDate).slice(0, 5),
    // symptomsByChanges: !checkinHistoryIsReady ? [] : sortSymptoms('changes', displayedSymptoms, CheckinHistories.findOne().checkins, graphStartDate, graphEndDate).slice(0, 5),
    worstSymptoms: symptomsSeveritySorted.slice(0, 5),
    leastImprovedSymptoms: symptomsImprovementSorted.filter(symptom => symptom.improvementAverage !== undefined).slice(0, 5),
    mostImprovedSymptoms: symptomsImprovementSorted.filter(symptom => symptom.improvementAverage !== undefined).reverse().slice(0, 5),
    symptomsByChanges: symptomsWithScoreDetails ? symptomsWithScoreDetails.sort((a, b) => b.biggestChangeAverage - a.biggestChangeAverage).slice(0, 5) : [],
    dateRangeOption: Session.get('dateRangeOption') || 'all_dates',
    graphStartDate,
    graphEndDate,
    checkinDates,
    allDates,
    includeDeletedSymptoms: Session.get('includeDeletedSymptoms') || false,
    // showDeletedTab: currentSymptoms.map(symptom => symptom.name).toString() !== currentAndDeletedSymptoms.map(symptom => symptom.name).toString(),
    // Edit for History Page
    includeDeletedTreatments: Session.get('includeDeletedTreatments') || false,
    showDeletedTreatmentTab: !!currentAndDeletedTreatments.find(treatment => !currentTreatments.includes(treatment)),
    showDeletedSymptomTab: !!currentAndDeletedSymptoms.find(symptom => !currentSymptoms.includes(symptom)),
    extendedTreatmentCheckins: (treatmentsHandle.ready() && checkinHandle.ready()) ? getExtendedTreatmentHistory(currentTreatments, checkinHistory.checkins) : [],
    extendedCheckins
  };

}, History);
