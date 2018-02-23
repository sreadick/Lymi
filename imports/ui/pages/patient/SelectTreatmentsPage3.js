import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { UserTreatments } from '../../../api/user-treatments';
import { CommonTreatments } from '../../../api/common-treatments';

import Loader from '/imports/ui/components/Loader';
// import { TreatmentList } from '../../components/patient/TreatmentList';
import { TreatmentSelectSidebar2 } from '../../components/patient/TreatmentSelectSidebar2';
import { TreatmentEditor2 } from '../../components/patient/TreatmentEditor2';
import { TreatmentEditor3 } from '../../components/patient/TreatmentEditor3';
import { TreatmentDetailDisplay } from '../../components/patient/TreatmentDetailDisplay';

import { getNextColor, capitalizePhrase } from '../../../utils/utils';

class SelectTreatmentsPage3 extends React.Component {
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
      return <Loader />
    } else if (!Meteor.user().profile.settings.trackedItems.includes('treatments')) {
      return <Redirect to='/patient'/>
    }
    return (
      <div className="page-content page-content--select-treatment-page2">
        <div className="page-content--select-treatment-page2__flex-wrapper">
          <TreatmentSelectSidebar2 userTreatments={this.props.userTreatments}/>
          <TreatmentDetailDisplay treatment={this.props.selectedTreatmentDetails} />

          {/* {this.props.selectedTreatment && */}
          { this.props.displayTreatmentEditor &&
            <TreatmentEditor3
              treatment={this.props.selectedTreatment || null}
              commonTreatments={this.props.commonTreatments}
              otherUserTreatmentNames={!this.props.selectedTreatment ?
                this.props.userTreatments.map(treatment => treatment.name.toLowerCase())
                :
                this.props.userTreatments.filter(treatment => treatment._id !== this.props.selectedTreatment._id).map(treatment => treatment.name.toLowerCase())}
              // showErrors={this.props.showErrors}
              nextColor={this.props.nextColor}
             />
         }

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

  if (!Session.get('selectedTreatmentDetails') && UserTreatments.find().fetch().length > 0) {
    Session.set('selectedTreatmentDetails', UserTreatments.find().fetch()[UserTreatments.find().fetch().length - 1]._id)
  }

  const userTreatments = UserTreatments.find({}, {sort: {createdAt: -1}}).fetch();
  return {
    userTreatments,
    // userTreatments: UserTreatments.find({}, {sort: {createdAt: -1}}).fetch(),
    selectedTreatment: UserTreatments.findOne(Session.get('currentTreatmentId')),
    selectedTreatmentDetails: UserTreatments.findOne(Session.get('selectedTreatmentDetails')),
    commonTreatments: CommonTreatments.find({}, {sort: {class: 1}}).fetch(),
    isFetching: !treatmentHandle.ready(),
    showErrors: Session.get('showErrors'),
    errorMessage: Session.get('errorMessage'),
    displayTreatmentEditor: Session.get('displayTreatmentEditor'),

    nextColor: userTreatments.length > 0 ? getNextColor(userTreatments.length) : getNextColor(0),
  }
}, SelectTreatmentsPage3);
