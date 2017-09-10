import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect, Link } from 'react-router-dom';
import { Session } from 'meteor/session';
import moment from 'moment';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';

import TreatmentChart from '../components/TreatmentChart';
import Checkin from './Checkin';

class TreatmentsHistory extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <div></div>
    }
    return (
      <div className="page-content">
        <div className="page-content__main-heading">History: Treatments</div>

      </div>
    );
  }
};

export default createContainer((props) => {

  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userTreatments: UserTreatments.find().fetch(),
    checkinHistory: CheckinHistories.findOne(),
    isFetching: (!checkinHistoryIsReady || !displayedCheckinTableItems || !symptomsHandle.ready() || !treatmentsHandle.ready()),
    groupSymptoms: Session.get('groupSymptoms') || false,
    includeDeleted: Session.get('includeDeleted') || false,
    showDeletedTab: currentSymptoms.map(symptom => symptom.name).toString() !== currentAndDeletedSymptoms.map(symptom => symptom.name).toString(),
    displayedSymptoms: Session.get('includeDeleted') ? currentAndDeletedSymptoms : currentSymptoms,
  };

}, TreatmentsHistory);
