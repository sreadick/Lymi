import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Input, Button } from 'react-materialize';

import SymptomChart from '../SymptomChart';

export default SideBarNav = (props) => (
  <div className='symptom-history__navbar'>
    <div className={`symptom-history__navbar__link ${props.selectedTab === 'symptomSelectGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomSelectGraph')}>
      Select Five
    </div>
    <div className={`symptom-history__navbar__link ${props.selectedTab === 'symptomSystemGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomSystemGraph')}>
      Grouped by system
    </div>
    <div className={`symptom-history__navbar__link ${props.selectedTab === 'symptomWorstGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomWorstGraph')}>
      Most Severe
    </div>
    <div className={`symptom-history__navbar__link ${props.selectedTab === 'symptomChangesGraph' && 'active'}`} onClick={() => props.handleTabChange('symptomChangesGraph')}>
      Biggest Changes
    </div>
    <div className={`symptom-history__navbar__link ${props.selectedTab === 'symptomHistoryTable' && 'active'}`} onClick={() => props.handleTabChange('symptomHistoryTable')}>
      History Record Table
    </div>
  </div>
);
