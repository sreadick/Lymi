import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

import SxRxDisplay from '../../../components/patient/SxRxDisplay';


export default class FullHistoryChart extends React.Component {
  render() {
    return (
      <div>
        <SxRxDisplay
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          // filteredCheckins={this.props.filteredCheckins}
          filteredCheckins={this.props.extendedCheckins}
          // showFullHistory={this.props.showFullHistory}
          displayedSymptoms={this.props.displayedSymptoms}
        />
      </div>
    );
  }
};
