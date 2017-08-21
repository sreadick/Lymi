import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { UserTreatments } from '../../api/user-treatments';

import { TreatmentList } from '../components/TreatmentList';

class SelectTreatmentsPage extends React.Component {

  componentDidMount() {
    Session.set('showErrors', false);
  }

  handleAddTreatment() {
    const hasErrors = this.validateTreatments();
    if (hasErrors) {
      Session.set('showErrors', true);
    } else {
      Session.set('showErrors', false);
      Meteor.call('userTreatments.insert');
    }
  }

  validateTreatments() {
    for (let i = 0; i < this.props.userTreatments.length; ++i) {
      if (Object.keys(this.props.userTreatments[i].errors).length > 0) {
        this.refs.errorMessage.classList.add('revealed');
        setTimeout(() => {
          this.refs.errorMessage && this.refs.errorMessage.classList.remove('revealed');
        }, 5000);
        return true
      }
    }
    return false
  }


  render() {
    if (this.props.isFetching) {
      return <div></div>
    }
    return (
      // <div className="ui container">
      <div className="page-content">
        <div className="page-content__main-heading">Select Treatments</div>
          <div>
          <button className="waves-effect waves-light black btn add-treatment-button"
            onClick={this.handleAddTreatment.bind(this)}>
            New Treatment
          </button>
          <TreatmentList userTreatments={this.props.userTreatments} showErrors={this.props.showErrors}/>
          <div className='row'>
            <Link className="col s2 waves-effect waves-light btn-large purple lighten-2" to="/home/selectsymptoms">Back: Symptoms</Link>
            <span className="col s8 center-align select-treatment-bottom-error grey-text" ref="errorMessage">Check above for errors and try again...</span>
            <button className={"col s2 right waves-effect waves-light green " + (this.props.userTreatments.length > 0 ? "btn-large" : "btn-large disabled")}
               onClick={() => {
                 const hasErrors = this.validateTreatments();
                 hasErrors ? Session.set('showErrors', true) : this.props.history.push('/home/dashboard')
               }}>
               Next: Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  const treatmentHandle = Meteor.subscribe('userTreatments');
  return {
    userTreatments: UserTreatments.find({}, {sort: {createdAt: -1}}).fetch(),
    isFetching: !treatmentHandle.ready(),
    showErrors: Session.get('showErrors')
  }
}, SelectTreatmentsPage);
