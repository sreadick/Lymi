import React from 'react';
import { Meteor } from 'meteor/meteor';
import Toggle from 'react-toggle';

export default class SymptomCheckbox extends React.Component {
  handleChange(e) {
    if (!e.target.checked) {
      Meteor.call('userSymptoms.remove', this.props.symptom);
    } else {
      Meteor.call('userSymptoms.insert', this.props.symptom)
    }
  }
  render() {
    return (
      <div>
        <label className="symptom-group__item">
          <Toggle
            className="symptom_toggle"
            checked={this.props.isChecked}
            value="yes"
            onChange={this.handleChange.bind(this)} />
          <span className="symptom-group__item__title">{this.props.symptom}</span>
        </label>
      </div>

    );
  }
};
