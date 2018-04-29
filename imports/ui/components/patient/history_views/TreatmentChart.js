import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

import TreatmentChartUI from '../TreatmentChart2';

export default class TreatmentChart extends React.Component {
  render() {
    return (
      <div className='card'>
        <TreatmentChartUI
          treatments={this.props.userTreatments}
          currentTreatmentNames={this.props.userTreatments.map(treatment => treatment.name)}
          checkins={this.props.extendedTreatmentCheckins}
        />
      </div>
    );
  }
};
