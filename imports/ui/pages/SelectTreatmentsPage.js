import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import FlipMove from 'react-flip-move';

import { UserTreatments } from '../../api/user-treatments';

import { TreatmentItem } from '../components/TreatmentItem';

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
        return true
      }
    }
    return false
  }

  renderUserTreatments() {
    return (
      <FlipMove duration={700} easing="ease-out">
        {this.props.userTreatments.length === 0
        ? <div className="ui container">
            <div className="ui message">
              <div className="header">Click the green button to add new treatments</div>
              <p>All changes are automatically saved and you can edit the list anytime</p>
            </div>
          </div>
        : this.props.userTreatments.map((treatment) =>
            <div className="treatment-item" key={treatment._id}>
              <TreatmentItem
                treatment={treatment}
                showErrors={this.props.showErrors}/>
            </div>
          )
        }
        <div>
          <Link className="ui blue left floated button" to="/home/selectsymptoms">Back</Link>
          <button className={"ui purple right floated " + (this.props.userTreatments.length > 0 ? "button" : "disabled button")}
             onClick={() => {
               const hasErrors = this.validateTreatments();
               hasErrors ? Session.set('showErrors', true) : this.props.history.push('/home/dashboard')
             }}>
             Next
          </button>
        </div>
      </FlipMove>
    );
  }


  render() {
    return (
      <div>
        <div className="page-content">
          <h1 className="ui centered header">Select Treatments</h1>
          <button className="ui positive basic button"
            onClick={this.handleAddTreatment.bind(this)}>
            New Treatment
          </button>
          {this.renderUserTreatments()}
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  Meteor.subscribe('userTreatments');
  return {
    userTreatments: UserTreatments.find({}, {sort: {createdAt: -1}}).fetch(),
    showErrors: Session.get('showErrors')
  }
}, SelectTreatmentsPage);
