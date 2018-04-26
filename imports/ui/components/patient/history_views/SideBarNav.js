import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Input, Button } from 'react-materialize';
import Collapsible from 'react-collapsible';

export default SideBarNav = (props) => (
  <div className='symptom-history__navbar'>
    <Collapsible
      open={props.selectedGroup === 'fullHistory'}
      onOpening={() => props.handleTabChange('selectedGroup', 'fullHistory')}
      trigger= {
        <div onClick={() => props.handleTabChange('selectedGroup', 'fullHistory')}>Full History</div>
      }>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'fullHistorySummary' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'fullHistorySummary')}>
        Summary
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'fullHistoryTable' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'fullHistoryTable')}>
        Table
      </div>
    </Collapsible>

    <Collapsible
      open={props.selectedGroup === 'symptoms'}
      onOpening={() => props.handleTabChange('selectedGroup', 'symptoms')}
      trigger= {
        <div>Symptoms</div>
      }>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomSelectGraph' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'symptomSelectGraph')}>
        Select Five
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomSystemGraph' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'symptomSystemGraph')}>
        Grouped by system
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomWorstGraph' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'symptomWorstGraph')}>
        Most Severe
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomChangesGraph' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'symptomChangesGraph')}>
        Biggest Changes
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'symptomHistoryTable' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'symptomHistoryTable')}>
        Symptom Table
      </div>
    </Collapsible>

    <Collapsible
      open={props.selectedGroup === 'treatments'}
      onOpening={() => props.handleTabChange('selectedGroup', 'treatments')}
      trigger= {
        <div>Treatments</div>
      }>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'treatmentChart' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'treatmentChart')}>
        Treatment Chart
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'treatmentTable' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'treatmentTable')}>
        Treatment Table
      </div>
    </Collapsible>

    <Collapsible
      open={props.selectedGroup === 'notableEvents'}
      onOpening={() => props.handleTabChange('selectedGroup', 'notableEvents')}
      trigger= {
        <div>Notable Events</div>
      }>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'notableEventsSelect' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'notableEventsSelect')}>
        Select Date
      </div>
      <div className={`symptom-history__navbar__tab ${props.selectedTab === 'notableEventsTable' && 'active'}`} onClick={() => props.handleTabChange('selectedTab', 'notableEventsTable')}>
        Events Table
      </div>
    </Collapsible>
  </div>
);
