import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import FlipMove from 'react-flip-move';

import { UserTreatments } from '../../../api/user-treatments';

import { TreatmentItem } from './TreatmentItem';

export class TreatmentList extends React.Component {
  getAllErrors() {
    for (let i = 0; i < this.props.userTreatments.length; ++i) {
      const errors = {};
      if (this.props.userTreatments.find((treatment) => this.props.userTreatments[i].name.toLowerCase() === treatment.name.toLowerCase() && this.props.userTreatments[i]._id !== treatment._id)) {
        errors.name = "needs to be unique"
      }
      if (this.props.userTreatments[i].name.length < 3) {
        errors.name = "needs to be at least three characters";
      }
      if (parseInt(this.props.userTreatments[i].amount) !== parseFloat(this.props.userTreatments[i].amount) || parseInt(this.props.userTreatments[i].amount) <= 0) {
        errors.amount = "should be a positive whole number"
      }
      if (this.props.userTreatments[i].dose_type !== 'pills' && this.props.userTreatments[i].dose <= 0) {
        errors.dose = "should be a positive number";
      }
      if (parseInt(this.props.userTreatments[i].frequency) !== parseFloat(this.props.userTreatments[i].frequency) || parseInt(this.props.userTreatments[i].frequency) <= 0) {
        errors.frequency = "should be a positive whole number"
      }
      if ((this.props.userTreatments[i].dateSelectMode !== 'individual select') && this.props.userTreatments[i].daysOfWeek.length === 0) {
        errors.daysOfWeek = 'Select at least one day of the week'
      }
      if (this.props.userTreatments[i].dateSelectMode === 'date range' && (!this.props.userTreatments[i].startDateValue || !this.props.userTreatments[i].endDateValue || this.props.userTreatments[i].startDateValue === this.props.userTreatments[i].endDateValue)) {
        errors.dateRange = 'Select a start and end date';
      }
      if (this.props.userTreatments[i].dateSelectMode === 'individual select' && this.props.userTreatments[i].individualDateValues.length === 0) {
        errors.individualDates = 'Select at least one day';
      }

      Meteor.call('userTreatments.update', this.props.userTreatments[i]._id, {
        errors,
        // showDateDetails: (this.props.showErrors && (errors.daysOfWeek || errors.dateRange || errors.individualDates)) ? true : false
      });
    }
  }

  render() {
    return (
      <FlipMove duration={700} easing="ease-out">
        {this.props.userTreatments.length === 0
        ? <div className="section">
            <h5 className="header">Click the button above to add new treatments</h5>
            <p>All changes are automatically saved and you can edit the list anytime</p>
          </div>
        :
        this.props.userTreatments.map((treatment) => {
          return (
            // <div className="treatment-item" key={treatment._id}>
            <div className="" key={treatment._id}>
              <TreatmentItem
                treatment={treatment}
                commonTreatments={this.props.commonTreatments}
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
