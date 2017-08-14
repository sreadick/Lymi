import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { UserTreatments } from '../../api/user-treatments';

import { TreatmentList } from '../components/TreatmentList';

class SelectTreatmentsPage extends React.Component {
  constructor(props) {
    super(props);

  }

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
      <div className="ui container">
        <div className="page-content__main-heading">Select Treatments</div>
          <div>
          <button className="ui basic black button add-treatment-button"
            onClick={this.handleAddTreatment.bind(this)}>
            New Treatment
          </button>
          <TreatmentList userTreatments={this.props.userTreatments} showErrors={this.props.showErrors}/>
          <Link className="ui large blue left floated button" to="/home/selectsymptoms">Back</Link>
          <button className={"ui large green right floated " + (this.props.userTreatments.length > 0 ? "button" : "disabled button")}
             onClick={() => {
               const hasErrors = this.validateTreatments();
               hasErrors ? Session.set('showErrors', true) : this.props.history.push('/home/dashboard')
             }}>
             Next
          </button>
          <div className="ui small center aligned black header select-treatment-bottom-error" ref="errorMessage">check above for errors and try again...</div>
          <div className="ui hidden fitted clearing divider"></div>
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
