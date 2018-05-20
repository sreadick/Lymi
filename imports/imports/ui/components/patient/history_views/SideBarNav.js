import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Input, Button } from 'react-materialize';
import Collapsible from 'react-collapsible';

export default SideBarNav = (props) => (
  <div className='symptom-history__navbar'>
    <Collapsible
      open={props.selectedGroup === 'fullHistory'}
      onOpening={() => props.handleGroupChange('fullHistory')}
      trigger= {
        <div>Full History</div>
      }>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'fullHistorySummary' && 'active'}`} onClick={() => props.handleTabChange('fullHistorySummary', 'Summary')}>
        Summary
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'fullHistoryTable' && 'active'}`} onClick={() => props.handleTabChange('fullHistoryTable', 'Table')}>
        Table
      </div>
    </Collapsible>

    <Collapsible
      open={props.selectedGroup === 'symptoms'}
      onOpening={() => props.handleGroupChange('symptoms')}
      trigger= {
        <div>Symptoms</div>
      }>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomSelectGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomSelectGraph', 'Select Five:')}>
        Select Five
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomSystemGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomSystemGraph', 'Grouped by System')}>
        Grouped by system
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomWorstGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomWorstGraph', 'Most Severe')}>
        Most Severe
      </div>
      {/* <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomChangesGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomChangesGraph', 'Greatest Changes')}>
        Biggest Changes
      </div> */}
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomMostImprovedGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomMostImprovedGraph', 'Most Improved')}>
        Most Improved
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomLeastImprovedGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomLeastImprovedGraph', 'Least Improved')}>
        Least Improved
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomHistoryTable' && 'active'}`} onClick={() => props.handleTabChange('symptomHistoryTable', 'Symptom Table')}>
        Symptom Table
      </div>
    </Collapsible>

    <Collapsible
      open={props.selectedGroup === 'treatments'}
      onOpening={() => props.handleGroupChange('treatments')}
      trigger= {
        <div>Treatments</div>
      }>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'treatmentChart' && 'active'}`} onClick={() => props.handleTabChange('treatmentChart', 'Treatment Chart')}>
        Treatment Chart
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'treatmentTable' && 'active'}`} onClick={() => props.handleTabChange('treatmentTable', 'Treatment Table')}>
        Treatment Table
      </div>
    </Collapsible>

    <Collapsible
      open={props.selectedGroup === 'notableEvents'}
      onOpening={() => props.handleGroupChange('notableEvents')}
      trigger= {
        <div>Notable Events</div>
      }>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'notableEventsSelect' && 'active'}`} onClick={() => props.handleTabChange('notableEventsSelect', 'Select Date')}>
        Select Date
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'notableEventsTable' && 'active'}`} onClick={() => props.handleTabChange('notableEventsTable', 'Events Table')}>
        Events Table
      </div>
    </Collapsible>
  </div>
);
