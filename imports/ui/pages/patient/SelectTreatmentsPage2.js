import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { UserTreatments } from '../../../api/user-treatments';
import { CommonTreatments } from '../../../api/common-treatments';

// import { TreatmentList } from '../../components/patient/TreatmentList';
import { TreatmentSelectSidebar } from '../../components/patient/TreatmentSelectSidebar';
import { TreatmentEditor } from '../../components/patient/TreatmentEditor';

class SelectTreatmentsPage2 extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <div></div>
    }
    return (
      <div className="page-content page-content--select-treatment-page2">
        <div className="page-content--select-treatment-page2__flex-wrapper">
          <TreatmentSelectSidebar userTreatments={this.props.userTreatments}/>
          <TreatmentEditor treatment={this.props.selectedTreatment} commonTreatments={this.props.commonTreatments} />
        </div>
        <Link className="col s2 waves-effect waves-light btn-large white blue-text" to="/patient/selectsymptoms">Back: Symptoms</Link>
        <button className={"col s2 right waves-effect waves-light white green-text " + (this.props.userTreatments.length > 0 ? "btn-large" : "btn-large disabled")}
           onClick={() => {
             this.props.history.push('/patient/dashboard')
           }}>
           Next: Dashboard
        </button>
      </div>
    );
  }
};

export default createContainer(() => {
  const treatmentHandle = Meteor.subscribe('userTreatments');
  Meteor.subscribe('commonTreatments');

  return {
    userTreatments: UserTreatments.find({}, {sort: {createdAt: -1}}).fetch(),
    selectedTreatment: UserTreatments.findOne(Session.get('currentTreatmentId')),
    commonTreatments: CommonTreatments.find({}, {sort: {class: 1}}).fetch(),
    isFetching: !treatmentHandle.ready(),
    showErrors: Session.get('showErrors'),
  }
}, SelectTreatmentsPage2);
