import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class SymptomCheckbox extends React.Component {
  handleOnChange() {
    if (this.props.isChecked) {
      Meteor.call('userSymptoms.remove', this.props.symptom);
    } else {
      Meteor.call('userSymptoms.insert', this.props.symptom)
    }
  }
  render() {
    return (
      <div>
        <label>{this.props.symptom}
          <input type="checkbox" checked={this.props.isChecked} value={this.props.symptom} onChange={() => {
            this.handleOnChange();
          }}/>
        </label>
      </div>
    );
  }
};
