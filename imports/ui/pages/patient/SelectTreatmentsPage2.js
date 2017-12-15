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
  validateTreatments() {
    const treatmentNames = [];
    for (let i = 0; i < this.props.userTreatments.length; ++i) {
      if (Object.keys(this.props.userTreatments[i].errors).length > 0) {
        this.refs.errorMessage.classList.add('revealed');
        setTimeout(() => {
          this.refs.errorMessage && this.refs.errorMessage.classList.remove('revealed');
        }, 5000);
        Session.set('errorMessage', 'Check above for errors and try again...')
        return true
      } else if (treatmentNames.includes(this.props.userTreatments[i].name.toLowerCase())) {
        this.refs.errorMessage.classList.add('revealed');
        setTimeout(() => {
          this.refs.errorMessage && this.refs.errorMessage.classList.remove('revealed');
        }, 5000);
        Session.set('errorMessage', 'Two or more treatments have the same name')
        return true
      }
      treatmentNames.push(this.props.userTreatments[i].name.toLowerCase());
    }
    return false
  }
  render() {
    if (this.props.isFetching) {
      return <div></div>
    } else if (!Meteor.user().profile.settings.trackedItems.includes('treatments')) {
      return <Redirect to='/patient'/>
    }
    return (
      <div className="page-content page-content--select-treatment-page2">
        <div className="page-content--select-treatment-page2__flex-wrapper">
          <TreatmentSelectSidebar userTreatments={this.props.userTreatments}/>
          <TreatmentEditor
            treatment={this.props.selectedTreatment}
            commonTreatments={this.props.commonTreatments}
            showErrors={true}
            // showErrors={this.props.showErrors}
           />
        </div>
        <div className='row'>
          <Link className="col s2 waves-effect waves-light btn-large white blue-text" to="/patient/selectsymptoms">Back: Symptoms</Link>
          <span className="col s8 center-align select-treatment-bottom-error red-text" ref="errorMessage">{this.props.errorMessage}</span>
          <button className={"col s2 right waves-effect waves-light white green-text " + (this.props.userTreatments.length > 0 ? "btn-large" : "btn-large disabled")}
             onClick={() => {
               const hasErrors = this.validateTreatments();
               hasErrors ? Session.set('showErrors', true) : this.props.history.push('/patient/dashboard')
             }}>
             Next: Dashboard
          </button>
        </div>
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
    errorMessage: Session.get('errorMessage'),
  }
}, SelectTreatmentsPage2);
