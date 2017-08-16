import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import FlipMove from 'react-flip-move';

import { UserTreatments } from '../../api/user-treatments';

import { TreatmentItem } from './TreatmentItem';

export class TreatmentList extends React.Component {
  getAllErrors() {
    for (let i = 0; i < this.props.userTreatments.length; ++i) {
      const errors = {};
      if (this.props.userTreatments.find((treatment) => this.props.userTreatments[i].name.toLowerCase() === treatment.name.toLowerCase() && this.props.userTreatments[i]._id !== treatment._id)) {
        errors.name = "needs to be unique"
      }
      if (this.props.userTreatments[i].name.length < 3) {
        errors.name = "needs to be at least three characters.";
      }
      if (parseInt(this.props.userTreatments[i].amount) !== parseFloat(this.props.userTreatments[i].amount) || parseInt(this.props.userTreatments[i].amount) <= 0) {
        errors.amount = "should be a positive whole number."
      }
      if (this.props.userTreatments[i].dose_type !== 'pills' && this.props.userTreatments[i].dose <= 0) {
        errors.dose = "should be a positive number";
      }
      if (parseInt(this.props.userTreatments[i].frequency) !== parseFloat(this.props.userTreatments[i].frequency) || parseInt(this.props.userTreatments[i].frequency) <= 0) {
        errors.frequency = "should be a positive whole number."
      }

      Meteor.call('userTreatments.update', this.props.userTreatments[i]._id, {
        errors
      });
    }
  }

  render() {
    return (
      <FlipMove duration={700} easing="ease-out">
        {this.props.userTreatments.length === 0
        ? <div className="">
            <div className="ui hidden divider"></div>
            <div className="ui message">
              <div className="header">Click the button above to add new treatments</div>
              <p>All changes are automatically saved and you can edit the list anytime</p>
            </div>
            <div className="ui hidden divider"></div>
          </div>
        :
        this.props.userTreatments.map((treatment, index) => {
          return (
            <div className="treatment-item" key={treatment._id}>
              <TreatmentItem
                treatment={treatment}
                errors={treatment.errors}
                showErrors={this.props.showErrors}
                getAllErrors={this.getAllErrors.bind(this)}
              />
            </div>
          )
        })}

      </FlipMove>
    );
  }
};